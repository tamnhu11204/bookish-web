import React from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const DeleteImportModal = ({ isOpen, importData, onConfirm, onCancel }) => {
  if (!isOpen || !importData) return null;

  // Tính tổng tiền
  const total = importData?.importItems?.reduce(
    (sum, item) => sum + (item.importPrice * item.quantity),
    0
  ) || 0;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">XÁC NHẬN XÓA LẦN NHẬP HÀNG</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div className="container">
              {/* Thông tin nhà cung cấp */}
              <div className="row">
                <div className="col-md-2">
                  <img
                    src={importData.supplier?.image || 'https://placehold.co/100x100'}
                    alt={importData.supplier?.name || 'Nhà cung cấp'}
                    className="img-thumbnail"
                  />
                </div>
                <div className="col-md-10">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Nhà cung cấp:</strong> {importData.supplier?.name || 'Không xác định'}</p>
                      <p><strong>Số điện thoại:</strong> {importData.supplier?.phone || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {importData.supplier?.address || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Ngày nhập hàng:</strong> {new Date(importData.importDate).toLocaleDateString('vi-VN')}</p>
                      <p><strong>Email:</strong> {importData.supplier?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              {/* Thông tin đơn hàng */}
              <h5 className="bg-light p-2">Mã nhập hàng: {importData._id.slice(-6)}</h5>
              <table className="table table-bordered">
                <thead>
                  <tr className="table-success">
                    <th>Mã sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá nhập</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.importItems?.map((item, index) => (
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
            </div>
          </div>
          <div className="modal-footer">
            <ButtonComponent
              textButton="Hủy bỏ"
              onClick={onCancel}
              className="btn btn-secondary"
            />
            <ButtonComponent
              textButton="Xác nhận xóa"
              onClick={onConfirm}
              className="btn btn-danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteImportModal;