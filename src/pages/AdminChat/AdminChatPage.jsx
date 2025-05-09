import React, { useEffect, useState } from 'react';
import AdminChatList from './AdminChatList';
import AdminChatWindow from './AdminChatWindow';
import { adminReplyToUser, getAllUsersWithLatestMessage, getConversationWithUser } from '../../services/ChatService';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const AdminChatPage = () => {
  const token = useSelector((state) => state.user?.access_token);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      withCredentials: true, // Đảm bảo cookies được gửi kèm theo request
    });

    socket.on('supportRequest', (data) => {
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
            name: data.userId.startsWith('guest_') ? 'Khách' : 'Khách hàng',
            latestMessage: {
              content: data.message,
              timestamp: data.timestamp,
              isHandled: false,
            },
          },
        ];
      });
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (token) fetchUsers();
    else setError('Vui lòng đăng nhập để xem danh sách khách hàng');
  }, [token]);

  useEffect(() => {
    if (selectedUser?._id && token) fetchMessages(selectedUser._id);
  }, [selectedUser, token]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsersWithLatestMessage(token);
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      setError('Không thể tải danh sách khách hàng. Vui lòng kiểm tra token hoặc server.');
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const data = await getConversationWithUser(userId, token);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    }
  };

  const handleSendMessage = async (content) => {
    try {
      console.log('gvv', token)
      await adminReplyToUser(selectedUser._id, content, token);
      setMessages([...messages, { content, sender: 'admin', timestamp: new Date() }]);
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
      setError(null);
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
      setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container-fluid mt-3">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row border rounded" style={{ height: '75vh' }}>
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
            <div className="h-100 d-flex align-items-center justify-content-center">
              <p>Chọn một khách hàng để bắt đầu trò chuyện.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;