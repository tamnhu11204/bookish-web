import React, { useState, useEffect } from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as ImportService from '../../services/ImportService';
import './AdminPage.css';
import * as message from "../../components/MessageComponent/MessageComponent";

// Hàm tiện ích để lấy URL ảnh
const getImageUrl = (imgField) => {
  if (Array.isArray(imgField) && imgField.length > 0) return imgField[0];
  if (typeof imgField === 'string') return imgField;
  return 'https://placehold.co/80x80';
};

const ImportDetails = ({ isOpen, importId, onCancel }) => {
  const [importDetails, setImportDetails] = useState(null);
  const [originalDetails, setOriginalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchImportDetails = async () => {
      if (!importId) return;

      try {
        setLoading(true);
        const response = await ImportService.getImportById(importId);
        if (response.status === 'OK') {
          setImportDetails(response.data);
          setOriginalDetails(response.data);
          setEditedItems(response.data.importItems.map(item => ({ ...item })));
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

  const total = editedItems?.reduce(
    (sum, item) => sum + (item.importPrice * item.quantity),
    0
  ) || 0;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUndo = () => {
    setEditedItems(originalDetails.importItems.map(item => ({ ...item })));
    setIsEditing(false);
  };

  const handleImportPriceChange = (index, value) => {
    const newItems = [...editedItems];
    newItems[index].importPrice = parseInt(value) || 0;
    setEditedItems(newItems);
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...editedItems];
    newItems[index].quantity = parseInt(value) || 0;
    setEditedItems(newItems);
  };

  const getChanges = () => {
    const changes = [];
    editedItems.forEach((item, index) => {
      const originalItem = originalDetails.importItems[index];
      if (item.importPrice !== originalItem.importPrice || item.quantity !== originalItem.quantity) {
        changes.push({
          productName: item.product?.name || 'Không xác định',
          originalImportPrice: originalItem.importPrice,
          newImportPrice: item.importPrice,
          originalQuantity: originalItem.quantity,
          newQuantity: item.quantity,
        });
      }
    });
    return changes;
  };

  const handleConfirm = () => {
    const changes = getChanges();
    if (changes.length === 0) {
      message.warn("Không có thay đổi để xác nhận!");
      setIsEditing(false);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedImport = {
        ...importDetails,
        importItems: editedItems.map(item => ({
          product: item.product._id,
          importPrice: item.importPrice,
          quantity: item.quantity,
        })),
        totalImportPrice: total,
      };
      const response = await ImportService.updateImport(importId, updatedImport);
      if (response.status === 'OK') {
        setImportDetails({ ...importDetails, importItems: editedItems, totalImportPrice: total });
        setOriginalDetails({ ...importDetails, importItems: editedItems, totalImportPrice: total });
        setIsEditing(false);
        setShowConfirmModal(false);
        message.success("Cập nhật lần nhập hàng thành công!");
      } else {
        message.error("Không thể cập nhật lần nhập hàng!");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        message.error("Không tìm thấy lần nhập hàng để cập nhật!");
      } else {
        message.error("Có lỗi xảy ra khi cập nhật lần nhập hàng!");
      }
      console.error('Error updating import:', err);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="import-details" style={{ padding: '0 20px' }}>
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
            <div className="row">
              <div className="col-md-2">
                <img
                  src={getImageUrl(importDetails.supplier?.img)}
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
                {editedItems?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product?.code || item.product?._id?.slice(-6) || 'N/A'}</td>
                    <td>
                      <img
                        src={getImageUrl(item.product?.img)}
                        alt={item.product?.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{item.product?.name || 'Không xác định'}</td>
                    <td>{(item.product?.price || 0).toLocaleString()}đ</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.importPrice}
                          onChange={(e) => handleImportPriceChange(index, e.target.value)}
                          className="form-control"
                          style={{ width: '120px' }}
                          min="0"
                        />
                      ) : (
                        (item.importPrice || 0).toLocaleString() + 'đ'
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          className="form-control"
                          style={{ width: '100px' }}
                          min="0"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>{(item.importPrice * item.quantity).toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end">
              <h5 className="text-danger">
                Tổng tiền: {total.toLocaleString()}đ
              </h5>
            </div>

            <div className="text-end">
              {isEditing ? (
                <>
                  <ButtonComponent
                    textButton="Hoàn tác"
                    className="btn btn-secondary me-3" // Tăng từ me-2 lên me-3
                    onClick={handleUndo}
                  />
                  <ButtonComponent
                    textButton="Xác nhận"
                    className="btn btn-success me-3" // Tăng từ me-2 lên me-3
                    onClick={handleConfirm}
                  />
                </>
              ) : (
                <ButtonComponent
                  textButton="Chỉnh sửa"
                  className="btn btn-primary me-3" // Tăng từ me-2 lên me-3
                  onClick={handleEdit}
                />
              )}
              <ButtonComponent
                textButton="Trở về"
                onClick={onCancel}
              />
            </div>

            {showConfirmModal && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">XÁC NHẬN THAY ĐỔI</h5>
                      <button type="button" className="btn-close" onClick={handleCancelConfirm}></button>
                    </div>
                    <div className="modal-body">
                      <h6>Danh sách thay đổi:</h6>
                      {getChanges().length > 0 ? (
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Sản phẩm</th>
                              <th>Giá nhập (Cũ)</th>
                              <th>Giá nhập (Mới)</th>
                              <th>Số lượng (Cũ)</th>
                              <th>Số lượng (Mới)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getChanges().map((change, index) => (
                              <tr key={index}>
                                <td>{change.productName}</td>
                                <td>{change.originalImportPrice.toLocaleString()}đ</td>
                                <td>{change.newImportPrice.toLocaleString()}đ</td>
                                <td>{change.originalQuantity}</td>
                                <td>{change.newQuantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>Không có thay đổi nào.</p>
                      )}
                    </div>
                    <div className="modal-footer">
                      <ButtonComponent
                        textButton="Hủy bỏ"
                        className="btn btn-secondary me-3" // Thêm me-3 để tạo khoảng cách
                        onClick={handleCancelConfirm}
                      />
                      <ButtonComponent
                        textButton="Lưu thay đổi"
                        className="btn btn-success"
                        onClick={handleSaveChanges}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">Không có dữ liệu để hiển thị.</div>
        )}
      </div>
    </div>
  );
};

export default ImportDetails;