import React, { useState, useEffect, useRef } from 'react';
import './AdminChat.css';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const AdminChatWindow = ({ user, messages, onSend }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setInput('');
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  // Định dạng thời gian
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Avatar fallback
  const getAvatarFallback = (name) => {
    if (!name) return 'K';
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return initials || 'K';
  };

  return (
    <div className="admin-chat-window d-flex flex-column bg-white">
      {/* Tiêu đề chat */}
      <div className="chat-header p-3 bg-gray-100 border-bottom d-flex align-items-center">
        <div className="avatar-container me-3">
          {user?.img ? (
            <img
              src={user.img}
              alt={user.name || 'Khách'}
              className="avatar-img rounded-circle"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          ) : (
            <div className="avatar-fallback rounded-circle bg-gray-200 d-flex align-items-center justify-content-center text-gray-600 font-medium">
              {getAvatarFallback(user?.name)}
            </div>
          )}
        </div>
        <h6 className="mb-0 text-gray-800 font-semibold">
          {user?.name || 'Khách chưa đăng ký'}
        </h6>
      </div>

      {/* Nội dung chat */}
      <div className="chat-body flex-grow-1 overflow-auto p-4 bg-gray-50">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 d-flex ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'
                }`}
            >
              <div
                className={`p-3 rounded-lg shadow-sm ${msg.sender === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border'
                  }`}
                style={{ maxWidth: '70%', wordBreak: 'break-word' }}
              >
                <div>{msg.content || msg.message}</div>
                <small
                  className={`d-block mt-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                >
                  {formatTimestamp(msg.timestamp)}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Không có tin nhắn</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập liệu */}
      <div className="chat-input border-top p-3 bg-white d-flex align-items-center">
        <input
          type="text"
          className="form-control me-2 rounded-pill border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
        />
        <ButtonComponent
          textButton="Gửi"
          onClick={handleSend} />
      </div>
    </div>
  );
};

export default AdminChatWindow;