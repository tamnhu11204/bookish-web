import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import * as HomePageConfigService from '../../services/HomepageConfigService';
import * as ProductService from '../../services/ProductService';
import * as PromotionService from '../../services/PromotionService';
import PromotionTab from '../AdminPage/PromotionTab';
import './DiscountPage.css';
import { useNavigate } from 'react-router-dom';

const DiscountCard = ({ promotion }) => {
  const { value = 0, condition = 0, finish, quantity = 100, used = 0, start } = promotion;
  const progress = quantity > 0 ? (used / quantity) * 100 : 0;

  const formatCurrency = (num) => `${num / 1000}K`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="discount-ticket">
      <div className="discount-ticket__icon-section">
        <div className="discount-ticket__icon">%</div>
        <span>Mã giảm</span>
      </div>

      <div className="discount-ticket__info-section">
        <div>
          <div className="info-header">
            <h5>Giảm {formatCurrency(value)}</h5>
          </div>
          <p className="info-conditions">Đơn hàng từ {formatCurrency(condition)}</p>
          <p className="info-conditions">Áp dụng từ ngày {formatDate(start)}</p>
        </div>
        <div className="info-footer">
          <div className="progress-info">
            <div className="expiry-date">Hạn sử dụng: {formatDate(finish)}</div>
            <div className="progress-bar">
              <div
                className="progress-bar__inner"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscountPage = () => {
  const navigate = useNavigate();
  const { data: promotions } =
    useQuery({
      queryKey: ['promotions'],
      queryFn: async () => (await PromotionService.getAllPromotion()).data
    });
  const { isLoading: isLoadingConfig, data: config } =
    useQuery({
      queryKey: ['homePageConfig'],
      queryFn: async () => (await HomePageConfigService.getConfig()).data
    });
  const { isLoading: isLoadingProducts, data: products } =
    useQuery({
      queryKey: ['products'],
      queryFn: async () => (await ProductService.getAllProduct()).data
    });

  const validPromotions = promotions?.filter((p) => new Date(p.finish) > new Date()).sort((a, b) => b.value - a.value);
  const discountedProducts = products?.filter((p) => p.discount > 0) || [];

  const user = useSelector(state => state.user);
  const isAdmin = user?.isAdmin === true;
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editBannerImage, setEditBannerImage] = useState(null);
  const queryClient = useQueryClient();

  const [isManagingPromotions, setIsManagingPromotions] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async ({ data, token }) => HomePageConfigService.updateConfig(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['homePageConfig']);
      setIsEditingBanner(false);
    },
    onError: (error) => console.error("Lỗi khi cập nhật banner:", error)
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditBannerImage(file);
      e.target.value = null;
    }
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (editBannerImage) {
      formData.append('bannerPromotion', editBannerImage);
    }
    updateMutation.mutate({ data: formData, token: user?.access_token });
  };

  const handleCancelEdit = () => {
    setEditBannerImage(null);
    setIsEditingBanner(false);
  };

  const handleOnClickProduct = (id) => {
    navigate(`/product-detail/${id}`);
  }

  return (
    <div className="discount-page">
      <header className="discount-header text-center">
        <div className="banner-container-bviury">
          {isLoadingConfig ? (<div className="banner-placeholder-rrtllx">Loading...</div>) : (
            <img src={editBannerImage ? URL.createObjectURL(editBannerImage) : (config?.bannerPromotion || '')} alt="Banner" className="banner-image-zdtotm" />
          )}
          {isEditingBanner && (
            <div className="image-upload-overlay">
              <label htmlFor="bannerPromotion-upload">Thay đổi ảnh <i className="bi bi-upload"></i></label>
              <input id="bannerPromotion-upload" type="file" onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
            </div>
          )}
        </div>
      </header>

      <div className='container'>
        {isAdmin && (
          <div className="admin-controls">
            {!isEditingBanner && <button className="edit-page-button" onClick={() => setIsEditingBanner(!isEditingBanner)}>
              <i className={isEditingBanner ? "bi bi-x-circle" : "bi bi-pencil"}></i>
              Chỉnh sửa Banner
            </button>}

            <button className="edit-promotion-button" onClick={() => setIsManagingPromotions(!isManagingPromotions)}>
              <i className={isManagingPromotions ? "bi bi-eye" : "bi bi-gear"}></i>
              {isManagingPromotions ? 'Xem trang ưu đãi' : 'Quản lý khuyến mãi'}
            </button>
          </div>
        )}
        {isManagingPromotions ? (
          <PromotionTab />
        ) : (
          <>
            <section className="discount-section mb-5">
              <h1 className="site-title">ƯU ĐÃI ĐẶC BIỆT ĐANG CHỜ BẠN</h1>
              <h4 className="section-title">ƯU ĐÃI</h4>
              <div className="row">
                {validPromotions && validPromotions.length > 0 ? (
                  validPromotions.map((promotion) => (
                    <div className="col-md-6" key={promotion._id}>
                      <DiscountCard promotion={promotion} />
                    </div>
                  ))
                ) : (<div className="no-offers text-center">Hiện tại chưa có ưu đãi nào.</div>)}
              </div>
            </section>

            <section className="discounted-products-section mb-5">
              <h4 className="section-title">SẢN PHẨM GIẢM GIÁ</h4>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {isLoadingProducts ? (<div>Loading...</div>) : discountedProducts.length > 0 ? (
                  discountedProducts.map((product) => (
                    <CardProductComponent
                      key={product._id}
                      id={product._id}
                      img={product.img[0]}
                      proName={product.name}
                      currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
                      originalPrice={product.price}
                      sold={product.sold}
                      star={product.star}
                      feedbackCount={product.feedbackCount}
                      onClick={() => handleOnClickProduct(product._id)}
                      view={product.view}
                      stock={product.stock}
                      discount={product.discount}
                    />))
                ) : (<div className="text-center">Không có sản phẩm giảm giá nào.</div>)}
              </div>
            </section>
          </>
        )}
      </div>

      {isEditingBanner && (
        <div className="edit-actions-footer">
          <button className="save-button" onClick={handleSubmitEdit}><i className="bi bi-check-circle"></i> Lưu</button>
          <button className="cancel-button" onClick={handleCancelEdit}><i className="bi bi-x-circle"></i> Hủy</button>
        </div>
      )}
    </div>
  );
};


export default DiscountPage;