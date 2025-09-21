/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { resetUser } from '../../redux/slides/UserSlide';
import * as UserService from '../../services/UserService';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import './HeaderComponent.css';
import CategoryDropdown from '../CategoryDropdownComponent/CategoryDropdown';
import * as FavoriteProductService from '../../services/FavoriteProductService';
import * as ProductService from '../../services/ProductService';

const HeaderComponent = () => {
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const order = useSelector((state) => state.order);
  const [productFavorite, setProductFavorite] = useState([]);

  const fetchFavoriteProducts = async () => {
    if (user?.id) {
      try {
        const favoriteData = await FavoriteProductService.getAllFavoriteProductByUser(user.id);
        console.log('favoriteData', favoriteData);

        if (favoriteData?.data && Array.isArray(favoriteData.data)) {
          const productDetailsPromises = favoriteData.data.map(async (favoriteItem) => {
            const product = await ProductService.getDetailProduct(favoriteItem.product);
            return product;
          });
          const productDetails = await Promise.all(productDetailsPromises);
          setProductFavorite(productDetails);
        } else {
          console.error('Product data is not available or not in expected format');
        }
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFavoriteProducts();
  }, [user?.id]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    localStorage.clear();
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLoading(false);
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      console.log('Sticky-header height:', headerHeight);
      const navbarElement = document.querySelector('.navbar:nth-child(2)');
      if (navbarElement) {
        navbarElement.style.top = `${headerHeight}px`;
      }
    }
    return () => {
      document.body.style.paddingTop = '';
    };
  }, [user?.name]);

  return (
    <>
      <div className="top-header sticky-header">
        <div className="container top-header-container">
          <p className="text-welcome">
            <i className="bi bi-stars"></i>
            <span>Chào mừng bạn đến với Bookish!</span>
          </p>

          <div className="user-actions">
            <LoadingComponent isLoading={loading}>
              {user?.name ? (
                <div className="user-actions-inner">
                  <button type="button" className="icon-button" onClick={() => navigate('/favorite-products')} title="Sản phẩm yêu thích">
                    <i className="bi bi-heart"></i>
                    <span className="badge-count">{productFavorite?.length || 0}</span>
                  </button>

                  <button type="button" className="icon-button" onClick={() => navigate('/shoppingcart')} title="Giỏ hàng">
                    <i className="bi bi-cart3"></i>
                    <span className="badge-count">{order?.orderItems?.length || 0}</span>
                  </button>

                  <div className="user-menu btn-group" role="group">
                    <button type="button" className="btn dropdown-toggle user-dropdown-button" data-bs-toggle="dropdown" aria-expanded="false">
                      Chào, {user.name}
                    </button>
                    <ul className="dropdown-menu">
                      {user?.isAdmin && (
                        <>
                          <li><NavLink className="dropdown-item" to="/admin-profile"><i className="bi bi-person-circle"></i> Hồ sơ</NavLink></li>
                          <li><NavLink className="dropdown-item" to="/admin/shopManagement"><i className="bi bi-house-gear"></i> Hệ thống</NavLink></li>
                          {/* <li><NavLink className="dropdown-item" to="/admin/livechat"><i className="bi bi-chat-dots"></i> Nhắn tin</NavLink></li> */}
                        </>
                      )}
                      {!user?.isAdmin && (
                        <li><NavLink className="dropdown-item" to="/profile"><i className="bi bi-person-circle"></i> Hồ sơ</NavLink></li>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right"></i> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <NavLink className="nav-link login-link" to="/login">
                  Tài khoản
                </NavLink>
              )}
            </LoadingComponent>
          </div>
        </div>
      </div>

      {/* Thanh điều hướng chính không thay đổi */}
      <nav className="navbar main-nav ">
        <div className="container main-nav-container">
          <NavLink className="navbar-brand" to="/">
            <img src={shop?.logo || logo} alt="Logo" className="logo-img" />
          </NavLink>
          <ul className="nav nav-links">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Trang chủ</NavLink></li>
            <li className="nav-item has-dropdown" style={{ position: 'relative' }}>
              <NavLink className="nav-link" to="/category">Danh mục</NavLink>
              <CategoryDropdown />
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/discount">Khuyến mãi</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about-us">Giới thiệu</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/news">Tin tức</NavLink></li>
          </ul>
          <div className="search-container">
            <input
              className="form-control search-input"
              type="text"
              placeholder="Tìm"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default HeaderComponent;