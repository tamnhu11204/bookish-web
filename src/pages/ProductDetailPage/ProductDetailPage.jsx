import React from 'react'
import './ProductDetailPage.css'
import img4 from '../../assets/img/img4.png'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2'
import CardComponent from '../../components/CardComponent/CardComponent'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'


const ProductDetailPage = () => {

  //body của card thông tin vận chuyển
  const shippingInfo = (
    <><div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p className="mb-1" style={{ fontSize: "16px" }}>
          <strong>Giao hàng đến:</strong>{" "}
          <span >Bạch Đằng, Tân Uyên, Bình Dương</span>
        </p>
        <p className="mb-0" style={{ fontSize: "16px" }}>
          <strong>Đơn vị giao hàng:</strong> GHTK
        </p>
      </div>

      <a class="text-decoration-underline"
        href="./"
        style={{
          color: "#198754",
          textDecoration: "none",
          fontStyle: "italic",
          fontSize: '14px'
        }}
      >
        Thay đổi địa chỉ
      </a>
    </div>

      <div className="mb-2" style={{ fontSize: "16px" }}>
        <h6 className="mb-2" style={{ fontSize: "16px", fontWeight: "bold" }}>
          Ưu đãi liên quan <a href="/" className="text-success text-decoration-none">Xem thêm</a>
        </h6><div className="d-flex gap-2">
          <span
            className="px-3 py-2"
            style={{
              backgroundColor: "#E4F7CB",
              color: "#2A7D46",
              borderRadius: "5px",
            }}
          >
            Mã giảm 25k
          </span>
          <span
            className="px-3 py-2"
            style={{
              backgroundColor: "#E4F7CB",
              color: "#2A7D46",
              borderRadius: "5px",
            }}
          >
            Free ship 25k
          </span>
        </div>
      </div></>
  )

  //chứa các thông tin của bảng thông tin chi tiết sản phẩm
  const detailData = [
    { criteria: 'Mã hàng', detail: '200.000đ -50%' },
    { criteria: 'Tác giả', detail: '100.000đ' },
    { criteria: 'Nhà xuất bản', detail: '2222 điểm' },
    { criteria: 'Năm xuất bản', detail: '11' },
    { criteria: 'Ngôn ngữ', detail: '4,5/5 ⭐ (2000 đánh giá)' },
    { criteria: 'Trọng lượng', detail: '5000' },
    { criteria: 'Kích thước', detail: '5000' },
    { criteria: 'Số trang', detail: '5000' },
    { criteria: 'Hình thức', detail: '5000' },
    { criteria: 'Nhà cung cấp', detail: '5000' },
    { criteria: 'Bộ', detail: '5000' },
  ];

  //body của card thông tin chi tiết sản phẩm
  const detailInfo = (
    <>
      <div className="container mt-5">
        <table className="table table-bordered table-striped custom-table">
          <tbody className="custom-body">
            {detailData.map((row, index) => (
              <tr key={index}>
                <td className="col-4">{row.criteria}</td>
                <td className="col-8">
                  <span className={row.detail}>
                    {row.detail}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  //body của card chứa các sản phẩm gợi ý cho khách hàng
  const relatedProductInfo = (
    <>
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            {[...Array(5)].map((_, index) => (
                <CardProductComponent
                    key={index}
                    img={img4}
                    proName="Ngàn mặt trời rực rỡ"
                    currentPrice="120000"
                    sold="12"
                    star="4.5"
                    score="210"
                />
            ))}
        </div>
    </>
)

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div class="container" >

        {/* row đầu tiên chứa các thông tin liên quan đến sản phẩm */}
        <div className="row">
          <div className="col-4">
            <div className="card p-3" style={{ maxWidth: "400px", margin: "auto" }}>
              {/* Hình ảnh chính */}
              <img
                src={img4} 
                className="custom-img"
                alt="Product"
                style={{ objectFit: "cover" }}
              />

              {/* Nội dung chi tiết */}
              <div className="card-body text-center">
                {/* Các hình ảnh nhỏ */}
                <div className="d-flex justify-content-center my-2">
                  <img
                    src={img4}
                    alt="Thumbnail 1"
                    className="img-thumbnail mx-1"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <img
                    src={img4}
                    alt="Thumbnail 2"
                    className="img-thumbnail mx-1"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <img
                    src={img4}
                    alt="Thumbnail 3"
                    className="img-thumbnail mx-1"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div
                    className="img-thumbnail d-flex align-items-center justify-content-center mx-1"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#d6c7c7",
                      color: "#fff",
                    }}
                  >
                    +2
                  </div>
                </div>

                {/* Chọn số lượng */}
                <div className="my-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-outline-secondary px-2">-</button>
                    <span className="mx-2">1</span>
                    <button className="btn btn-outline-secondary px-2">+</button>
                  </div>
                </div>

                {/* Nút thêm vào giỏ hàng và mua ngay */}
                <div className="d-flex justify-content-between mt-3">
                  <ButtonComponent
                    textButton="Thêm vào giỏ hàng"
                  />
                  <ButtonComponent2
                    textButton="Mua ngay"
                  />
                </div>

                {/* Nút so sánh */}
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
            </div>
          </div>

          <div className="col-8">
            <div className="card p-3 mb-4" style={{ maxWidth: "600px", margin: "auto", borderRadius: "10px" }}>
              {/* Tiêu đề và thông tin sản phẩm */}
              <div className="card-body">
                <h5 className="card-title-detail fw-bold">
                  Muôn Kiếp Nhân Sinh - Many Times, Many Lives - Tập 2
                </h5>
                <p className="card-text-detail mb-2">
                  <strong>Tác giả:</strong> Nguyên Phong
                </p>
                <p className="card-text-detail mb-2">
                  <strong>Nhà xuất bản:</strong> NXB Tổng hợp TPHCM
                </p>
                <p className="card-text-detail mb-2">
                  <strong>Nhà cung cấp:</strong> First News
                </p>
                <p className="card-text-detail mb-3">
                  <strong>Bộ:</strong> Muôn kiếp nhân sinh Many Times Lives
                </p>

                <div className="row">
                  <div className="col-4">
                    <p style={{ color: 'red', fontSize: '25px' }}>150.000đ</p>
                  </div>
                  <div className="col-2">
                    <div class="badge text-wrap" style={{ width: 'fit-content', fontSize: '16px', backgroundColor: '#E4F7CB', marginTop: '5px', color: '#198754' }}>
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

                {/* Đánh giá và lượt bán */}
                <div className="mt-3 text-muted" style={{ fontSize: "14px" }}>
                  <span>
                    <strong>4,5/5⭐</strong> (2000 đánh giá) | 3200 lượt bán | 1200 điểm
                  </span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <CardComponent
                  title="Thông tin vận chuyển"
                  bodyContent={shippingInfo}
                  icon="bi bi-truck"
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <CardComponent
                  title="Thông tin chi tiết"
                  bodyContent={detailInfo}
                  icon="bi bi-card-list"
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <CardComponent
                  title="Mô tả sản phẩm"
                  bodyContent={
                    <>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}> Muôn kiếp nhân sinh </p>
                      <p style={{ fontSize: '16px' }}> Hiếm có cuốn sách nào ngay từ khi ra mắt đã tạo nên hiện tượng văn hóa đọc và sau nửa năm đã trở thành cuốn sách bán chạy nhất năm 2020 tại Việt Nam như Muôn Kiếp Nhân Sinh. Cơn sốt của cuốn sách này tiếp tục được dấy lên vào dịp Tết Nguyên Đán 2021 khi công ty First News Trí Việt hé lộ đang “ngày đêm thực hiện Muôn Kiếp Nhân Sinh tập 2”. Đáp lại sự mong đợi của độc giả suốt hơn ba tháng, Muôn Kiếp Nhân Sinh tập 2 đã chính thức phát hành trên cả nước.
                        Muôn Kiếp Nhân Sinh tập 2 của tác giả Nguyên Phong tiếp tục là những câu chuyện tiền kiếp, nhân quả luân hồi hấp dẫn gắn liền với những kiến giải uyên bác về quá khứ, hiện tại, tương lai của nhân loại và thế giới thông qua góc nhìn của cả khoa học và tâm linh. Chúng ta là ai, chúng ta đến từ đâu và sẽ đi về đâu? Làm cách nào để chữa lành thế giới này, hành tinh này trước những biến cố lớn đang và sẽ diễn ra trong tương lai gần? </p>
                    </>
                  }
                  icon="bi bi-card-list"
                />
              </div>
            </div>

          </div>
        </div>

        {/* row tiếp theo là các sản phẩm gợi ý cho khách hàng */}
        <div className="row">
        <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <CardComponent
                  title="Có thể bạn sẽ quan tâm"
                  bodyContent={relatedProductInfo}
                  icon="bi bi-bag-heart"
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage