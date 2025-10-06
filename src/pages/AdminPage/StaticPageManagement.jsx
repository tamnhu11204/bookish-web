import React, { useState, useEffect } from 'react';
import TextEditor from './partials/TextEditor';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as StaticPageService from '../../services/StaticPageService';

const StaticPageManagement = () => {
  const [policy, setPolicy] = useState('');
  const [instruction, setInstruction] = useState('');

  // Hàm tải chi tiết static page
  const loadStaticPageDetails = async () => {
    try {
      // Lấy dữ liệu Chính sách hỗ trợ
      const policyData = await StaticPageService.getDetailStaticPage('67892c83334944263f60f91e');
      setPolicy(policyData.data.content);

      // Lấy dữ liệu Hướng dẫn đặt hàng
      const instructionData = await StaticPageService.getDetailStaticPage('67892c92334944263f60f921');
      setInstruction(instructionData.data.content);
    } catch (error) {
      console.error('Không thể tải dữ liệu static page:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
  };

  // Gọi hàm loadStaticPageDetails khi trang được tải
  useEffect(() => {
    loadStaticPageDetails();
  }, []);



  const handleUpdatePolicy = async () => {
    try {
      const data = { content: policy };
      const response = await StaticPageService.updateStaticPage('67892c83334944263f60f91e', data);
      alert('Cập nhật Chính sách hỗ trợ thành công!');
      console.log(response);
    } catch (error) {
      alert('Cập nhật Chính sách hỗ trợ thất bại!');
      console.error(error);
    }
  };

  const handleUpdateInstruction = async () => {
    try {
      const data = { content: instruction };
      const response = await StaticPageService.updateStaticPage('67892c92334944263f60f921', data);
      alert('Cập nhật Hướng dẫn đặt hàng thành công!');
      console.log(response);
    } catch (error) {
      alert('Cập nhật Hướng dẫn đặt hàng thất bại!');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <div className="title-section">
        <h3 className="text mb-0">TRANG HỖ TRỢ KHÁCH HÀNG</h3>
      </div>
      <h3 className="title-profile">Chính sách hỗ trợ</h3>
      <TextEditor value={policy} onChange={setPolicy} />
      <div className="card-footer" style={{ marginTop: '20px', textAlign: "right" }}>
        <ButtonComponent textButton="Cập nhật" onClick={handleUpdatePolicy} />
      </div>

      <h3 className="title-profile">Hướng dẫn đặt hàng</h3>
      <TextEditor value={instruction} onChange={setInstruction} />
      <div className="card-footer" style={{ marginBottom: "30px", marginTop: '20px', textAlign: "right" }}>
        <ButtonComponent textButton="Cập nhật" onClick={handleUpdateInstruction} />
      </div>
    </div>
  );
};

export default StaticPageManagement;
