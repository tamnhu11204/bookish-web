import { useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import img4 from '../../assets/img/img4.png';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import { addOrderProduct } from '../../redux/slides/OrderSlide';
import * as FormatService from '../../services/OptionService/FormatService';
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as SupplierService from '../../services/OptionService/SupplierService';
import * as UnitService from '../../services/OptionService/UnitService';
import * as ProductService from '../../services/ProductService';
import * as UserService from '../../services/UserService';
import './ProductDetailPage.css';
import * as FeedbackService from '../../services/FeedbackService';


const ProductDetailPage = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch()
  const [amount, setAmount] = useState(1);
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await ProductService.getDetailProduct(id);
      setProduct(data.data);
    };
    fetchProduct();
  }, [id]);

  const { data: publisher } = useQuery({
    queryKey: ['publisher', product?.publisher],
    queryFn: () =>
      product?.publisher
        ? PublisherService.getDetailPublisher(product.publisher).then((res) => res.data)
        : null,
    enabled: !!product?.publisher,
  });

  const { data: language } = useQuery({
    queryKey: ['language', product?.language],
    queryFn: () =>
      product?.language
        ? LanguageService.getDetailLanguage(product.language).then((res) => res.data)
        : null,
    enabled: !!product?.language,
  });

  const { data: supplier } = useQuery({
    queryKey: ['supplier', product?.supplier],
    queryFn: () =>
      product?.supplier
        ? SupplierService.getDetailSupplier(product.supplier).then((res) => res.data)
        : null,
    enabled: !!product?.supplier,
  });

  const { data: format } = useQuery({
    queryKey: ['format', product?.format],
    queryFn: () =>
      product?.format
        ? FormatService.getDetailFormat(product.format).then((res) => res.data)
        : null,
    enabled: !!product?.format,
  });

  const { data: unit } = useQuery({
    queryKey: ['unit', product?.unit],
    queryFn: () =>
      product?.unit ? UnitService.getDetailUnit(product.unit).then((res) => res.data) : null,
    enabled: !!product?.unit,
  });

  useEffect(() => {
    const fetchFeedbackAndUserDetails = async () => {
      const feedbackData = await FeedbackService.getAllFeedbackByPro(id);
      const feedbackWithUserDetails = await Promise.all(
        feedbackData.data.map(async (feedback) => {
          const user = await UserService.getDetailUser(feedback.user);
          return { ...feedback, user };
        })
      );
      setFeedbacks(feedbackWithUserDetails);
    };

    fetchFeedbackAndUserDetails();
  }, [id]);



  if (!product) {
    return <div>Loading...</div>;
  }

  const detailData = [
    { criteria: 'Mã hàng', detail: product?._id || 'N/A' },
    { criteria: 'Tác giả', detail: product?.author || 'N/A' },
    { criteria: 'Nhà xuất bản', detail: publisher?.name || 'N/A' },
    { criteria: 'Năm xuất bản', detail: product?.publishDate || 'N/A' },
    { criteria: 'Ngôn ngữ', detail: language?.name || 'N/A' },
    { criteria: 'Trọng lượng', detail: product?.weight || 'N/A' },
    { criteria: 'Kích thước', detail: `${product?.length}x${product?.width}x${product?.height}` || 'N/A' },
    { criteria: 'Số trang', detail: product?.page || 'N/A' },
    { criteria: 'Hình thức', detail: format?.name || 'N/A' },
    { criteria: 'Nhà cung cấp', detail: supplier?.name || 'N/A' },
    { criteria: 'Đơn vị', detail: unit?.name || 'N/A' },
  ];

  const priceCurrent = (product.price * (100 - product.discount)) / 100;

  const detailInfo = (
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
  );

  const relatedProductInfo = (
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
  );
  const images = product.img || []; // Mảng hình ảnh từ sản phẩm
  const mainImage = images[0]; // Ảnh bìa
  const secondaryImages = images.slice(1); // Ảnh phụ

  const handleOnAddToCart = () => {
    if (!user?.id) {
      alert('Hãy đăng nhập để tiếp tục mua sắm!')
      navigate('/login', { state: location?.pathname })
    } else {
      dispatch(addOrderProduct({
        orderItem: {
          product: product._id,
          price: priceCurrent,
          amount: amount
        }
      }))
    }
  }

  const feedbackProduct = (
    <div>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={feedback.user?.data.img || ''}
                  alt={`${feedback.user?.data.name}'s avatar`}
                  className="rounded-circle"
                  style={{ width: '50px', height: '50px', marginRight: '15px' }}
                />
                <h5 className="card-title mb-0">{feedback.user?.data.name || 'Người dùng ẩn danh'}</h5>
              </div>
              <p style={{fontSize:'16px'}}>{feedback.content}</p>
              <small style={{fontSize:'16px'}} className="text-muted">Đánh giá: {feedback.star}/5⭐</small>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={feedback.img || ''}
                  alt={'new img'}
                  style={{ width: '300px', height: '300px' }}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
      )}
    </div>
  );



  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div className="container" >
        <div className="row" >
          <div className="col-4">
            <div className="sticky-card" style={{ marginTop: '20px' }}>
              <div className="card p-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                <img
                  src={mainImage || img4} // Hiển thị ảnh bìa hoặc ảnh mặc định nếu không có
                  className="custom-img"
                  alt="Product"
                  style={{ objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  {secondaryImages.length > 0 && (
                    <div className="d-flex justify-content-center my-2">
                      {secondaryImages.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="img-thumbnail mx-1"
                          style={{ width: '50px', height: '50px' }}
                        />
                      ))}
                      {secondaryImages.length > 3 && (
                        <div
                          className="img-thumbnail d-flex align-items-center justify-content-center mx-1"
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#d6c7c7',
                            color: '#fff',
                          }}
                        >
                          +{secondaryImages.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="col-6">
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      Số lượng:
                      <input
                        id="quantity"
                        className="form-control"
                        type="number"
                        style={{ width: '60px', fontSize: '16px' }}
                        value={amount}
                        min="1"
                        max="10"
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(10, Number(e.target.value)));
                          setAmount(value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <ButtonComponent textButton="Thêm vào giỏ hàng"
                      onClick={handleOnAddToCart} />
                    {/* <ButtonComponent2 textButton="Mua ngay"
                      onClick={handleOnBuyNow} /> */}
                  </div>

                  <a
                    className="text-decoration-underline"
                    href="./comparison"
                    style={{ color: '#198754', textDecoration: 'none', fontStyle: 'italic', fontSize: '14px' }}
                  >
                    So sánh với sách khác
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="card p-3 mb-4" style={{ maxWidth: "600px", marginTop: "20px", borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="card-title-detail fw-bold">{product.name}</h5>
                <p className="card-text-detail mb-2">
                  <strong>Tác giả:</strong> {product.author}
                </p>
                <p className="card-text-detail mb-2">
                  <strong>Nhà xuất bản:</strong> {publisher?.name || 'N/A'}
                </p>
                <p className="card-text-detail mb-2">
                  <strong>Nhà cung cấp:</strong> {supplier?.name || 'N/A'}
                </p>
                <div className="row">
                  <div className="col-4">
                    <p style={{ color: 'red', fontSize: '25px' }}>{priceCurrent}đ</p>
                  </div>
                  <div className="col-2">
                    <div className="badge text-wrap" style={{ width: 'fit-content', fontSize: '16px', backgroundColor: '#E4F7CB', marginTop: '5px', color: '#198754' }}>
                      -{product.discount}%
                    </div>
                  </div>
                  <div className="col">
                    <div className="badge text-wrap" style={{ width: 'fit-content', fontSize: '12px', backgroundColor: '#FFFFFF', border: '1px solid #198754', marginTop: '8px', color: '#198754' }}>
                      Còn {product.stock} sản phẩm
                    </div>
                  </div>
                </div>
                <p className="text-decoration-line-through" style={{ fontSize: '16px', marginTop: '-20px' }}>{product.price}đ</p>
                <div className="mt-3 text-muted" style={{ fontSize: "14px" }}>
                  <span>
                    <strong>{product.star}/5⭐</strong> ({product.feedbackCount} đánh giá) | {product.sold} lượt bán
                  </span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <CardComponent title="Thông tin chi tiết" bodyContent={detailInfo} icon="bi bi-card-list" />
              </div>
            </div>
            <div style={{ backgroundColor: '#F9F6F2' }}>
              <div className="container" style={{ marginTop: '30px' }}>
                <CardComponent title="Mô tả sản phẩm" bodyContent={<><p style={{ fontSize: '20px', fontWeight: 'bold' }}>{product.name}</p><div style={{ fontSize: '16px' }}>{product.description ? parse(product.description) : 'Không có mô tả.'}</div></>} icon="bi bi-card-list" />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div style={{ backgroundColor: '#F9F6F2' }}>
            <div className="container" style={{ marginTop: '30px' }}>
              <CardComponent title="Có thể bạn sẽ quan tâm" bodyContent={relatedProductInfo} icon="bi bi-bag-heart" />
            </div>
          </div>
        </div>

        <div className="row">
          <div style={{ backgroundColor: '#F9F6F2' }}>
            <div className="container" style={{ marginTop: '30px' }}>
              <CardComponent title="Đánh giá"
                bodyContent={feedbackProduct}
                icon="bi bi-bookmark-star" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProductDetailPage