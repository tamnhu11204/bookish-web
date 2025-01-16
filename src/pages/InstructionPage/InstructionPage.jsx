import React, { useState, useEffect } from 'react';
import * as StaticPageService from '../../services/StaticPageService';
import parse from 'html-react-parser';

const InstructionPage = () => {
  const [instruction, setInstruction] = useState('');

  // Hàm tải chi tiết static page
  const loadStaticPageDetails = async () => {
    try {
      const instructionData = await StaticPageService.getDetailStaticPage('67892c92334944263f60f921');
      setInstruction(instructionData.data.content); // Gán nội dung HTML vào state
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
      <h1 style={{color: '#198754', marginTop:'10px', marginBottom:'20px'}}>Hướng dẫn đặt hàng</h1>
      <div style={{fontSize:'16px'}}>{instruction ? parse(instruction) : 'Đang tải nội dung...'}</div>
    </div>
  );
};

export default InstructionPage;
