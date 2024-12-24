import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import FooterComponent from '../FooterComponent/FooterComponent';

const DefaultComponent = ({ children, isShowFooter }) => {
  return (
    <div>
      <HeaderComponent />
      {children}
      {/* Hiển thị Footer nếu isShowFooter là true */}
      {isShowFooter && <FooterComponent />}
    </div>
  );
};

export default DefaultComponent;
