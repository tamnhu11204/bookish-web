import React from 'react'
import { useQuery } from '@tanstack/react-query'
import * as PromotionService from '../../services/PromotionService';

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

      // Lấy danh sách ưu đãi từ API
          const getAllPromotion = async () => {
              const res = await PromotionService.getAllPromotion();
              console.log('data', res)
              return res.data;
          };
      
          const { isLoading: isLoadingPromotion, data: promotions } = useQuery({
              queryKey: ['promotions'],
              queryFn: getAllPromotion,
          });

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
    
      // Lọc và sắp xếp các ưu đãi
  const validPromotions = promotions
  ?.filter((promotion) => new Date(promotion.finish) > new Date()) // Lọc ưu đãi còn hạn
  ?.sort((a, b) => b.value - a.value); // Sắp xếp theo value giảm dần
    
      const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Đã sao chép mã: ${code}`);
      };
    
      

    return (
        <div className="container my-5" style={formStyle}>
      <header className="text-center mb-5">
        <h1 className="text-success fw-bold" style={formStyle}>Bookish</h1>
        <h3>Ưu Đãi Tháng 1</h3>
        <div className="d-flex justify-content-center gap-3 my-3">
          <button className="btn btn-outline-success" style={formStyle}>Giảm Giá Sốc</button>
          <button className="btn btn-outline-success" style={formStyle}>Mã Freeship</button>
          <button className="btn btn-outline-success" style={formStyle}>Quà Tặng</button>
        </div>
        <button className="btn btn-success" style={formStyle}>Khám Phá Ngay</button>
      </header>

      <section className="mb-5">
        <h4 className="bg-success text-white py-2 px-3">ƯU ĐÃI </h4>
        <div className="row">
        {validPromotions && validPromotions.length > 0 ?
          (validPromotions.map((promotion, index) => (
            <div className="col-md-6" key={index} >
              <DiscountCard title={`Giảm giá ${promotion.value} vnd tổng đơn hàng`} onCopy={handleCopyCode} 
              description = {`Đơn hàng từ ${promotion.condition} vnd, số lượng có hạn`} 
              code ={promotion._id}
             time={`Hết hạn: ${(new Date(promotion.finish).toISOString().split('T')[0])}`}/>
            </div>
          ))):(null)}
        </div>
      </section>

      
    </div>
  );
};

export default DiscountPage