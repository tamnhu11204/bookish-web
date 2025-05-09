import React, { useState, useEffect, useRef } from 'react';
import './AdminChat.css';

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

  return (
    <div className="admin-chat-window d-flex flex-column">
      <div className="chat-header p-3 bg-light border-bottom">
        <h6 className="mb-0">{user?.name || 'Khách chưa đăng ký'}</h6>
      </div>

      <div className="chat-body flex-grow-1 overflow-auto p-3">
        {Array.isArray(messages) ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 d-flex ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-2 rounded ${msg.sender === 'admin' ? 'bg-primary text-white' : 'bg-light'}`}
                style={{ maxWidth: '70%' }}
              >
                {msg.content || msg.message}
              </div>
            </div>
          ))
        ) : (
          <p>Không có tin nhắn</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input border-top p-2 d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default AdminChatWindow;