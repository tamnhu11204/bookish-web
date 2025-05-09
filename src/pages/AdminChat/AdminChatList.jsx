import React from 'react';
import './AdminChat.css';

const AdminChatList = ({ users, selectedUserId, onSelectUser }) => {
  return (
    <div className="admin-chat-list border-end">
      <h5 className="p-3 mb-0 bg-light">Khách hàng</h5>
      <ul className="list-group list-group-flush">
        {users.map((user) => (
          <li
            key={user._id}
            className={`list-group-item list-group-item-action ${selectedUserId === user._id ? 'active' : ''
              }`}
            onClick={() => onSelectUser(user)}
          >
            <strong>{user.name || 'Khách chưa đăng ký'}</strong>
            <br />
            <small className="text-muted">
              {user.latestMessage?.content?.slice(0, 30) || 'Không có tin nhắn'}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminChatList;