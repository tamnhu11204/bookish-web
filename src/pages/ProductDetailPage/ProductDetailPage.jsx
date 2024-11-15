import React from 'react'
import './ProductDetailPage.css'
import img4 from '../../assets/img/img4.png'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2'

const handleQuantityChange = (index, newQuantity) => {
  console.log(`Sản phẩm ${index} có số lượng mới: ${newQuantity}`);
};
const quantity = 10;

const ProductDetailPage = () => {
  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div class="container" >
        <div className="row">
          <div className="col-4">
            <div className="card-detail" >
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <img src={img4} className="custom-img" />
              </div>

              <div className="card-body-detail">
                <div className="thumbnail-container">
                  {[...Array(2)].map((thumbnail, index) => (
                    <div className="thumbnail" key={index}>
                      <img src={img4} alt={`Thumbnail ${index + 1}`} className="img-thumbnail" />
                    </div>
                  ))}
                  <div className="thumbnail">
                    <div className="btn" variant="outline-secondary">+2</div>
                  </div>
                </div>
                <div className="col-3 text-center">
                  <p className="mb-1 text-muted">Số lượng</p>
                  <div className="input-group input-group-sm justify-content-center">
                    <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                    <span className="px-2">{quantity}</span>
                    <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6" style={{ display: 'flex', justifyContent: 'left', marginTop: '10px', marginBottom: '10px' }}>
                    <ButtonComponent
                      textButton="Thêm vào giỏ hàng"
                    />
                  </div>

                  <div className="col-6" style={{ display: 'flex', justifyContent: 'right', marginTop: '10px', marginBottom: '10px' }}>
                    <ButtonComponent2
                      textButton="Mua ngay"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6" style={{ display: 'flex', justifyContent: 'left', marginTop: '10px', marginBottom: '10px' }}>
                    <a class="text-decoration-underline"
                      href="./comparison"
                      style={{
                        color: "#198754",
                        textDecoration: "none",
                        fontStyle: "italic",
                        fontSize: '14px'
                      }}
                    >
                      So sánh với sách khác
                    </a>
                  </div>

                  <div className="col-6" style={{ display: 'flex', justifyContent: 'right', marginTop: '10px', marginBottom: '10px' }}>
                    <i class="bi bi-heart" style={{ color: 'red', fontSize: '20px' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div class="card-detail">
              <div class="card-body-detail">
                <h5 class="card-title-detail">Muôn Kiếp Nhân Sinh - Many Times, Many Lives - Tập 2</h5>
                <p class="card-text-detail">Tác giả: Nguyên Phong</p>
                <p class="card-text-detail">Nhà xuất bản: NXB Tổng hợp</p>
                <p class="card-text-detail">Nhà cung cấp: First News</p>
                <p class="card-text-detail">Bộ: Muôn kiếp nhân sinh</p>
                <div className="row">
                  <div className="col-2">
                    <p style={{ color: 'red', fontSize: '25px' }}>150.000đ</p>
                  </div>
                  <div className="col-2">
                    <div class="badge text-wrap" style={{ width: 'fit-content', fontSize: '16px', backgroundColor: '#198754', marginTop: '5px' }}>
                      -25%
                    </div>
                  </div>
                  <div className="col" >
                    <div class="badge text-wrap" style={{ width: 'fit-content', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #198754', marginTop: '8px', color: '#198754' }}>
                      Còn 12 sản phẩm
                    </div>
                  </div>
                </div>
                <p class="text-decoration-line-through" style={{ fontSize: '16px', marginTop: '-20px' }}>200.000đ</p>

                <div className="row">
                  <div className="col">
                    <p style={{ fontSize: '16px' }}>
                      4,5
                    </p>
                  </div>

                  <div className="col">
                    <i class="bi bi-star-fill" style={{ color: '#F4D761', marginLeft: '-30px', fontSize: '16px' }}></i>
                  </div>

                  <div className="col">
                    <p>
                      (1000 đánh giá)
                    </p>
                  </div>

                  <div className="col">
                    <svg height="20">
                      <line x1="5" y1="0" x2="5" y2="100" style={{ stroke: '#666666', strokeWidth: 1 }} />
                    </svg>
                  </div>

                  <div className="col"><p class="score"> 3200 lượt bán</p></div>

                  <div className="col">
                    <svg height="20">
                      <line x1="5" y1="0" x2="5" y2="100" style={{ stroke: '#666666', strokeWidth: 1 }} />
                    </svg>
                  </div>

                  <div className="col"><p class="score"> 1200 điểm</p></div>
                </div>

              </div>
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

                  <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
                    <ButtonComponent icon={<i className="bi bi-truck" />} />
                    Thông tin vận chuyển</div>

                  <hr className="line" style={{ border: '1px solid #198754' }} />

                  <div className="card-body-detail" >
                    <p class="card-text-detail">Giao hàng đến: Bạch Đằng, Tân Uyên, Bình Dương</p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">

        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage