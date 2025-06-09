import React from 'react';
import './AdminChat.css';

const AdminChatList = ({ users, selectedUserId, onSelectUser }) => {
  // Tạo chữ cái đầu cho avatar fallback
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
    <div className="admin-chat-list border-end bg-white shadow-sm">
      <h5 className="p-3 mb-0 bg-gray-100 text-gray-700 font-semibold">Khách hàng</h5>
      <ul className="list-group list-group-flush">
        {users.map((user) => (
          <li
            key={user._id}
            className={`list-group-item list-group-item-action d-flex align-items-center p-3 ${selectedUserId === user._id ? 'active bg-blue-50' : 'hover:bg-gray-50'
              }`}
            onClick={() => onSelectUser(user)}
            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
          >
            {/* Avatar */}
            <div className="avatar-container me-3">
              {user.img ? (
                <img
                  src={user.img || 'https://via.placeholder.com/100'}
                  alt="Avatar"
                  className="avatar-img"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '3px solid #ffffff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginBottom: '10px',
                  }}
                />
              ) : (
                <div className="avatar-fallback rounded-circle bg-gray-200 d-flex align-items-center justify-content-center text-gray-600 font-medium">
                  {getAvatarFallback(user.name)}
                </div>
              )}
            </div>
            {/* Thông tin khách hàng */}
            <div className="flex-grow-1">
              <strong className="text-gray-800">{user.name || 'Khách chưa đăng ký'}</strong>
              <br />
              <small className="text-gray-500">
                {user.latestMessage?.content?.slice(0, 30) || 'Không có tin nhắn'}
                {user.latestMessage?.content?.length > 30 && '...'}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminChatList;