import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import CardComponent from '../../components/CardComponent/CardComponent'

const DiscountPage = () => {

    const formStyle = {
        fontSize: "16px", // Tăng cỡ chữ toàn bộ form
      };
    const DiscountCard = ({ title, description, code, time, onCopy }) => {
        return (
          <div className="card mb-3" style={formStyle}>
            <div className="card-body">
              <h5 className="card-title" style={formStyle}>{title} </h5>
              <p className="card-text">{description} </p>
              <p className="card-text text-muted" >{time}</p>
              <div className="d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  value={code}
                  readOnly
                  className="form-control me-2 text-center"
                  style={{ width: "150px" ,fontSize: "16px"
                    
                  }}
                 
                />
                <button className="btn btn-success" onClick={() => onCopy(code)} style={formStyle}>
                  Copy mã
                </button>
              </div>
            </div>
          </div>
        );
      };

      const timeDiscounts = [
        {
          title: "Giảm 20k phí vận chuyển",
          description: "Đơn hàng từ 200k, nhận ngay",
          code: "ABC1234560R",
          time: "27/02/2024 10:00",
        },
        {
          title: "Giảm 20k phí vận chuyển",
          description: "Đơn hàng từ 200k, số lượng có hạn",
          code: "DEF1234567X",
          time: "27/02/2024 21:00",
        },
      ];
    
      const categoryDiscounts = [
        {
          title: "Mã giảm 25k",
          description: "Áp dụng cho sách thiếu nhi từ 200k",
          code: "XYZ1234567K",
          time: "27/02/2024 23:59",
        },
        {
          title: "Mã giảm 25k",
          description: "Áp dụng cho sách văn học từ 200k",
          code: "LMN1234560Z",
          time: "27/02/2024 23:59",
        },
      ];
    
      const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Đã sao chép mã: ${code}`);
      };
    
      

    return (
        <div className="container my-5" style={formStyle}>
      <header className="text-center mb-5">
        <h1 className="text-success fw-bold" style={formStyle}>Bookish</h1>
        <h3>Ưu Đãi Tháng 9</h3>
        <div className="d-flex justify-content-center gap-3 my-3">
          <button className="btn btn-outline-success" style={formStyle}>Giảm Giá Sốc</button>
          <button className="btn btn-outline-success" style={formStyle}>Mã Freeship</button>
          <button className="btn btn-outline-success" style={formStyle}>Quà Tặng</button>
        </div>
        <button className="btn btn-success" style={formStyle}>Khám Phá Ngay</button>
      </header>

      <section className="mb-5">
        <h4 className="bg-success text-white py-2 px-3">ƯU ĐÃI KHUNG GIỜ</h4>
        <div className="row">
          {timeDiscounts.map((discount, index) => (
            <div className="col-md-6" key={index} >
              <DiscountCard {...discount} onCopy={handleCopyCode} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="bg-success text-white py-2 px-3">ƯU ĐÃI THỂ LOẠI</h4>
        <div className="row">
          {categoryDiscounts.map((discount, index) => (
            <div className="col-md-6" key={index}>
              <DiscountCard {...discount} onCopy={handleCopyCode} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscountPage