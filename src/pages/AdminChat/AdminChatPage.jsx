import React, { useEffect, useState, useRef, useCallback } from 'react';
import AdminChatList from './AdminChatList';
import AdminChatWindow from './AdminChatWindow';
import { adminReplyToUser, getAllUsersWithLatestMessage, getConversationWithUser } from '../../services/ChatService';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const AdminChatPage = () => {
  const token = useSelector((state) => state.user?.access_token);
  const userId = useSelector((state) => state.user?.userId);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsersWithLatestMessage(token);
      console.log('data user', data);
      setUsers(
        data.users.map((user) => ({
          ...user,
          name: user.name || (user._id.startsWith('guest_') ? 'Khách' : 'Khách hàng'),
          avatar: user.avatar || null,
        }))
      );
      setError(null);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      setError('Không thể tải danh sách khách hàng. Vui lòng kiểm tra token hoặc server.');
    }
  }, [token]);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const data = await getConversationWithUser(userId, token);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    }
  }, [token]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      withCredentials: true,
      query: { userId },
    });

    socketRef.current.on('supportRequest', (data) => {
      console.log('Received supportRequest:', data);
      setUsers((prev) => {
        const exists = prev.find((u) => u._id === data.userId);
        if (exists) {
          return prev.map((u) =>
            u._id === data.userId
              ? {
                ...u,
                latestMessage: {
                  content: data.message,
                  timestamp: data.timestamp,
                  isHandled: false,
                },
              }
              : u
          );
        }
        return [
          ...prev,
          {
            _id: data.userId,
            name: data.userId.startsWith('guest_') ? 'Khách' : data.name || 'Khách hàng',
            avatar: data.avatar || null,
            latestMessage: {
              content: data.message,
              timestamp: data.timestamp,
              isHandled: false,
            },
          },
        ];
      });
    });

    socketRef.current.on('newMessage', (data) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            content: data.message,
            sender: data.sender,
            timestamp: data.timestamp,
          },
        ]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);

  useEffect(() => {
    if (token) fetchUsers();
    else setError('Vui lòng đăng nhập để xem danh sách khách hàng');
  }, [token, fetchUsers]);

  useEffect(() => {
    if (selectedUser?._id && token) fetchMessages(selectedUser._id);
  }, [selectedUser, token, fetchMessages]);

  const handleSendMessage = async (content) => {
    try {
      console.log('Sending message with token:', token);
      await adminReplyToUser(selectedUser._id, content, token);
      const newMessage = { content, sender: 'admin', timestamp: new Date() };
      setMessages([...messages, newMessage]);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? {
              ...u,
              latestMessage: { content, timestamp: new Date(), isHandled: true },
            }
            : u
        )
      );
      socketRef.current.emit('newMessage', {
        userId: selectedUser._id,
        message: content,
        sender: 'admin',
        timestamp: new Date(),
      });
      setError(null);
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
      setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row border rounded shadow-sm bg-white" style={{ height: '100vh', minHeight: 'calc(100vh - 60px)' }}>
        <div className="col-md-4 p-0">
          <AdminChatList
            users={users}
            selectedUserId={selectedUser?._id}
            onSelectUser={setSelectedUser}
          />
        </div>
        <div className="col-md-8 p-0">
          {selectedUser ? (
            <AdminChatWindow
              user={selectedUser}
              messages={messages}
              onSend={handleSendMessage}
            />
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center text-gray-500">
              <p>Chọn một khách hàng để bắt đầu trò chuyện.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;