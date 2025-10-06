import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import FooterComponent from '../FooterComponent/FooterComponent';

const DefaultComponent = ({ children }) => {
  const location = useLocation();
  const hideFooter = location.pathname === '/livechat'; // Ẩn footer trong AdminChatPage

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />
      <main className="flex-grow-1" style={{ backgroundColor: "#F9F6F2" }}>
        {children}
      </main>
      {!hideFooter && <FooterComponent />}
    </div>
  );
};

export default DefaultComponent;