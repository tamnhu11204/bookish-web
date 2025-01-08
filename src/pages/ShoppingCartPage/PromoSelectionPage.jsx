import React from 'react';
import PromoItemComponent from '../../components/PromoItemComponent/PromoItemComponent';
import "../PromoSelectionPage/Promo.css"
const PromoSelectionPage = ({ isOpen, onClick1 }) => {
  if (!isOpen) return null; // Không hiển thị nếu isOpen là false

  return (
    <div className="custom-modal">
      <div className="modal-content">
        <div className='promo'>
          <div className="p-4 border rounded" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-success mb-0">
                <i className="bi bi-percent me-2"></i>CHỌN MÃ KHUYẾN MÃI
              </h5>
              <button className="btn-close" aria-label="Close" onClick={onClick1}></button>
            </div>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập mã khuyến mãi/Quà tặng"
              />
              <button className="btn btn-success">Áp dụng</button>
            </div>

            <div className="mb-4">
              <h6 className="mb-2">Mã giảm giá</h6>
              <small className="text-muted">Áp dụng tối đa: 1</small>

              <PromoItemComponent
                icon="https://via.placeholder.com/50" // Thay thế bằng link icon thực tế
                title="MÃ GIẢM GIÁ 25K - CHO ĐƠN HÀNG TỪ 100K"
                dateRange="Từ 01/01/2023 đến 01/02/2023"
                isApplied={true}
                onActionClick={() => alert('Bỏ chọn mã này')}
                actionLabel="Bỏ chọn"
              />

              <PromoItemComponent
                icon="https://via.placeholder.com/50" // Thay thế bằng link icon thực tế
                title="MÃ GIẢM GIÁ 5K - CHO ĐƠN HÀNG TỪ 50K"
                dateRange="Từ 01/01/2023 đến 01/02/2023"
                isApplied={false}
                onActionClick={() => alert('Áp dụng mã này')}
                actionLabel="Áp dụng"
              />
            </div>

            <div>
              <h6 className="mb-2">Quà tặng</h6>
              <small className="text-muted">Tự động áp dụng khi thỏa điều kiện</small>

              <PromoItemComponent
                icon="https://via.placeholder.com/50" // Thay thế bằng link icon thực tế
                title="MÓC KHÓA NGẪU NHIÊN - CHO ĐƠN HÀNG TỪ 100K"
                dateRange="Từ 01/01/2024 đến 01/02/2024"
                isApplied={true}
                onActionClick={() => { }}
                actionLabel=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSelectionPage;
