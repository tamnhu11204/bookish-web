import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import FooterComponent from '../FooterComponent/FooterComponent';

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      {children}
      {/* Hiển thị Footer nếu isShowFooter là true */}
      <FooterComponent />
    </div>
  );
};

export default DefaultComponent;
