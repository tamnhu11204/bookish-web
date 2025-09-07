/* eslint-disable react-hooks/exhaustive-deps */
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
import * as FavoriteProductService from '../../services/FavoriteProductService';
import * as FeedbackService from '../../services/FeedbackService';
import * as FormatService from '../../services/OptionService/FormatService';
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as SupplierService from '../../services/OptionService/SupplierService';
import * as UnitService from '../../services/OptionService/UnitService';
import * as ProductService from '../../services/ProductService';
import * as UserService from '../../services/UserService';
import './ProductDetailPage.css';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';

const ProductDetailPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [productFavorite, setProductFavorite] = useState('');
  const [proCategory, setProCategory] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await ProductService.getDetailProduct(id);
        setProduct(data?.data || null);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchFavoriteProducts = async () => {
    if (user?.id) {
      const favoriteData = await FavoriteProductService.getAllFavoriteProductByUser(user.id);
      if (favoriteData?.data) {
        const favoriteProduct = favoriteData.data.find(fav => fav.product === id);
        setProductFavorite(favoriteProduct?._id || '');
        setIsFavorite(favoriteProduct ? true : false);
      }
    }
  };

  useEffect(() => {
    fetchFavoriteProducts();
  }, [id, user?.id]);

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

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (product?.category) {
        try {
          const params = {
            limit: 10,
            page: 0,
            filter: ["category", product.category],
          };
          const products = await ProductService.getAllProduct(params);
          const filteredProducts = products.data.filter(
            (item) => item._id !== product._id
          );
          setProCategory(filteredProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };
    fetchProductsByCategory();
  }, [product?.category, product?._id]);

  const handleOnClickProduct = async (id) => {
    await ProductService.updateView(id);
    navigate(`/product-detail/${id}`);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const detailData = [
    { criteria: 'Mã hàng', detail: product?.code || 'N/A' },
    { criteria: 'Tác giả', detail: product?.author || 'N/A' },
    { criteria: 'Nhà xuất bản', detail: publisher?.name || 'N/A' },
    {
      criteria: 'Năm xuất bản',
      detail: product?.publishDate
        ? new Date(product.publishDate).toLocaleDateString('vi-VN')
        : 'N/A'
    },
    { criteria: 'Ngôn ngữ', detail: language?.name || 'N/A' },
    { criteria: 'Trọng lượng', detail: product?.weight || 'N/A' },
    { criteria: 'Kích thước', detail: `${product?.length} x ${product?.width} x ${product?.height}` || 'N/A' },
    { criteria: 'Số trang', detail: product?.page || 'N/A' },
    { criteria: 'Hình thức', detail: format?.name || 'N/A' },
    { criteria: 'Nhà cung cấp', detail: supplier?.name || 'N/A' },
    { criteria: 'Đơn vị', detail: unit?.name || 'N/A' },
  ];

  const priceCurrent = (product.price * (100 - (product.discount || 0))) / 100;

  const detailInfo = (
    <div className="container mt-5">
      <table className="table table-bordered table-striped custom-table">
        <tbody className="custom-body">
          {detailData.map((row, index) => (
            <tr key={index}>
              <td className="col-4">{row.criteria}</td>
              <td className="col-8">
                <span className={row.detail}>{row.detail}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const relatedProductInfo = (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
      {proCategory && proCategory.length > 0 ? (
        proCategory.map((product) => (
          <CardProductComponent
            key={product._id}
            img={product.img[0]}
            proName={product.name}
            currentPrice={(product.price * (100 - (product.discount || 0)) / 100).toLocaleString()}
            sold={product.sold}
            star={product.star}
            feedbackCount={product.feedbackCount}
            onClick={() => handleOnClickProduct(product._id)}
            view={product.view}
          />
        ))
      ) : (
        <tr>
          <td colSpan="4" className="text-center">
            Không có dữ liệu để hiển thị.
          </td>
        </tr>
      )}
    </div>
  );

  const images = product.img || [];
  const mainImage = images[currentImageIndex] || img4;

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleOnAddToCart = () => {
    if (!user?.id) {
      alert('Hãy đăng nhập để tiếp tục mua sắm!');
      navigate('/login', { state: location?.pathname });
    } else if (amount > product.stock) {
      alert(`Số lượng sản phẩm trong kho chỉ còn ${product.stock}. Vui lòng chọn số lượng nhỏ hơn hoặc bằng số lượng tồn kho!`);
    } else {
      dispatch(addOrderProduct({
        orderItem: {
          product: product._id,
          price: priceCurrent,
          amount: amount
        }
      }));
      alert('Sản phẩm đã được thêm vào giỏ hàng thành công!');
    }
  };

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
              <p style={{ fontSize: '16px' }}>{feedback.content}</p>
              <small style={{ fontSize: '16px' }} className="text-muted">Đánh giá: {feedback.star}/5⭐</small>
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

  const handleAddToFavorite = async () => {
    if (!user?.id) {
      alert('Hãy đăng nhập để tiếp tục sử dụng tính năng này!');
      navigate('/login', { state: location?.pathname });
      return;
    }

    try {
      const favoriteData = { user: user.id, product: id };

      if (isFavorite) {
        const response = await FavoriteProductService.deleteFavoriteProduct(productFavorite);
        if (response?.status !== 'ERR') {
          alert('Xóa sản phẩm khỏi danh sách yêu thích!');
          setIsFavorite(false);
          setProductFavorite('');
          fetchFavoriteProducts();
        }
      } else {
        const response = await FavoriteProductService.addFavoriteProduct(favoriteData);
        if (response?.status !== 'ERR') {
          alert('Thêm sản phẩm vào danh sách yêu thích!');
          setIsFavorite(true);
          setProductFavorite(response?.data?._id);
          fetchFavoriteProducts();
        }
      }
    } catch (error) {
      console.error('Error in handleAddToFavorite:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại sau!');
    }
  };

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="sticky-card" style={{ marginTop: '20px' }}>
              <div className="card p-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                <div className="custom-img-container position-relative">
                  <img
                    src={mainImage}
                    className="custom-img"
                    alt="Product"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        className="btn btn-outline-secondary position-absolute"
                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                        onClick={handlePrevImage}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <button
                        className="btn btn-outline-secondary position-absolute"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                        onClick={handleNextImage}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>
                <div className="card-body text-center">
                  {images.length > 0 && (
                    <div className="d-flex justify-content-center my-2 flex-wrap">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={`img-thumbnail mx-1 ${index === currentImageIndex ? 'border border-primary' : ''}`}
                          style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
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
                    <ButtonComponent textButton="Thêm vào giỏ hàng" onClick={handleOnAddToCart} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="card p-3 mb-4" style={{ marginLeft: "10px", marginRight: "10px", marginTop: "20px", borderRadius: "10px" }}>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h5 className="card-title-detail fw-bold">{product.name}</h5>
                  </div>
                  <div className="col d-flex justify-content-end">
                    <button
                      className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={handleAddToFavorite}
                    >
                      <i
                        className="bi bi-heart"
                        style={{ fontSize: '20px', color: isFavorite ? 'white' : 'red' }}
                      ></i>
                    </button>
                  </div>
                </div>
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
                    <p style={{ color: 'red', fontSize: '25px' }}>{priceCurrent.toLocaleString()}đ</p>
                  </div>
                  {product.discount > 0 && (
                    <>
                      <div className="col-2">
                        <div className="badge text-wrap" style={{ width: 'fit-content', fontSize: '16px', backgroundColor: '#E4F7CB', marginTop: '5px', color: '#198754' }}>
                          -{product.discount}%
                        </div>
                      </div>

                    </>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-decoration-line-through" style={{ fontSize: '16px', marginTop: '-20px' }}>
                    {product.price.toLocaleString()}đ
                  </p>
                )}
                <div className="mt-3 text-muted row" style={{ fontSize: "14px" }}>
                  <div className="col">
                    <strong>{product.star}/5⭐</strong> ({product.feedbackCount} đánh giá) | {product.sold} lượt bán | {product.view} lượt xem
                  </div>
                  <div className="col d-flex justify-content-end">
                    <div
                      className="badge text-wrap"
                      style={{
                        width: 'fit-content',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #198754',
                        color: '#198754'
                      }}
                    >
                      Còn {product.stock} sản phẩm
                    </div>
                  </div>
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
                <CardComponent
                  title="Mô tả sản phẩm"
                  icon="bi bi-blockquote-left"
                  bodyContent={
                    <>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{product.name}</p>
                      <div
                        style={{ fontSize: '16px' }}
                        className={!expanded ? "truncate-5" : ""}
                      >
                        {product.description ? parse(product.description) : 'Không có mô tả.'}
                      </div>

                      {product.description && (
                        <div className="w-100 text-center mt-4">
                          <ButtonComponent2
                            textButton={expanded ? "Thu gọn" : "Xem thêm"}
                            onClick={() => setExpanded(!expanded)}
                          />
                        </div>
                      )}
                    </>
                  }
                />
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
            <div className="container" style={{ marginTop: '30px', marginBottom: '30px' }}>
              <CardComponent title="Đánh giá" bodyContent={feedbackProduct} icon="bi bi-bookmark-star" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;