import React, { useState, useEffect } from 'react';
import * as StaticPageService from '../../services/StaticPageService';
import parse from 'html-react-parser';

const PolicyPage = () => {
  const [Policy, setPolicy] = useState('');

  // Hàm tải chi tiết static page
  const loadStaticPageDetails = async () => {
    try {
      const PolicyData = await StaticPageService.getDetailStaticPage('67892c83334944263f60f91e');
      setPolicy(PolicyData.data.content); // Gán nội dung HTML vào state
    } catch (error) {
      console.error('Không thể tải dữ liệu static page:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
  };

  // Gọi API khi trang được tải
  useEffect(() => {
    loadStaticPageDetails();
  }, []);

  return (
    <div className='container'>
      <h1 style={{color: '#198754', marginTop:'10px', marginBottom:'20px'}}>Chính sách hỗ trợ hoàn đơn</h1>
      <div style={{fontSize:'16px'}}>{Policy ? parse(Policy) : 'Đang tải nội dung...'}</div>
    </div>
  );
};

export default PolicyPage;
