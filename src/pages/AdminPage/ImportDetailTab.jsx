import React, { useState, useEffect } from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as ImportService from '../../services/ImportService';

const ImportDetails = ({ isOpen, importId, onCancel }) => {
  const [importDetails, setImportDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy chi tiết lần nhập hàng từ backend
  useEffect(() => {
    const fetchImportDetails = async () => {
      if (!importId) return;

      try {
        setLoading(true);
        const response = await ImportService.getImportById(importId);
        if (response.status === 'OK') {
          setImportDetails(response.data);
        } else {
          setError('Không thể tải chi tiết lần nhập hàng.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải chi tiết lần nhập hàng.');
        console.error('Error fetching import details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImportDetails();
  }, [importId]);

  // Tính tổng tiền
  const total = importDetails?.importItems?.reduce(
    (sum, item) => sum + (item.importPrice * item.quantity),
    0
  ) || 0;

  if (!isOpen) return null;

  return (
    <div style={{ padding: '0 20px' }}>
      <div className="title-section">
        <h3 className="text mb-0">LỊCH SỬ NHẬP HÀNG - Chi tiết</h3>
      </div>
      <div className="container my-4">
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : importDetails ? (
          <>
            {/* Thông tin nhà cung cấp */}
            <div className="row">
              <div className="col-md-2">
                <img
                  src={importDetails.supplier?.image || 'https://placehold.co/100x100'}
                  alt={importDetails.supplier?.name || 'Nhà cung cấp'}
                  className="img-thumbnail"
                />
              </div>
              <div className="col-md-10">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nhà cung cấp:</strong> {importDetails.supplier?.name || 'Không xác định'}</p>
                    <p><strong>Số điện thoại:</strong> {importDetails.supplier?.phone || 'N/A'}</p>
                    <p><strong>Địa chỉ:</strong> {importDetails.supplier?.address || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Ngày nhập hàng:</strong> {new Date(importDetails.importDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Email:</strong> {importDetails.supplier?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* Thông tin đơn hàng */}
            <h5 className="bg-light p-2">Mã nhập hàng: {importDetails._id.slice(-6)}</h5>
            <table className="table table-bordered">
              <thead>
                <tr className="table-success">
                  <th>Mã sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá bìa</th>
                  <th>Giá nhập</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {importDetails.importItems?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product?.code || item.product?._id?.slice(-6) || 'N/A'}</td>
                    <td>
                      <img
                        src={item.product?.image || 'https://placehold.co/80x80'}
                        alt={item.product?.name || 'Sản phẩm'}
                        className="img-thumbnail"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>{item.product?.name || 'Không xác định'}</td>
                    <td>{(item.product?.price || 0).toLocaleString()}đ</td>
                    <td>{(item.importPrice || 0).toLocaleString()}đ</td>
                    <td>{item.quantity}</td>
                    <td>{(item.importPrice * item.quantity).toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tổng tiền */}
            <div className="text-end">
              <h5 className="text-danger">
                Tổng tiền: {total.toLocaleString()}đ
              </h5>
            </div>
            <div className="text-end">
              <ButtonComponent
                textButton="Trở về"
                onClick={onCancel}
              />
            </div>
          </>
        ) : (
          <div className="text-center">Không có dữ liệu để hiển thị.</div>
        )}
      </div>
    </div>
  );
};

export default ImportDetails;