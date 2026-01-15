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
import * as AIService from '../../services/AIService';

const HeaderComponent = () => {
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const order = useSelector((state) => state.order);
  const [productFavorite, setProductFavorite] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchInputRef = useRef(null);
  const historyDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Tính toán khi nào hiện prompt guide
  const showPromptGuide = (isHovering || isFocused) && searchTerm.trim() === '';

  // Fetch favorite products
  const fetchFavoriteProducts = async () => {
    if (user?.id) {
      try {
        const favoriteData = await FavoriteProductService.getAllFavoriteProductByUser(user.id);

        if (favoriteData?.data && Array.isArray(favoriteData.data)) {
          const productDetailsPromises = favoriteData.data.map(async (favoriteItem) => {
            const product = await ProductService.getDetailProduct(favoriteItem.product);
            return product;
          });
          const productDetails = await Promise.all(productDetailsPromises);
          setProductFavorite(productDetails);
        }
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      }
    }
  };

  useEffect(() => {
    fetchFavoriteProducts();
  }, [user?.id]);

  // Handle logout
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

  // Adjust navbar position based on header height
  const headerRef = useRef(null);
  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const navbarElement = document.querySelector('.navbar:nth-child(2)');
      if (navbarElement) {
        navbarElement.style.top = `${headerHeight}px`;
      }
    }
    return () => {
      document.body.style.paddingTop = '';
    };
  }, [user?.name]);

  // Load search history
  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      } catch (e) {
        console.error('Error parsing search history', e);
        localStorage.removeItem('search_history');
      }
    }
  }, []);

  // Handle search
  const handleSearch = async (customQuery = null) => {
    const query = (customQuery || searchTerm).trim();
    if (!query) {
      alert('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    // Update search history
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));

    setLoading(true);
    try {
      const results = await AIService.searchBooks(query);
      navigate(`/category`, {
        state: {
          searchResults: results,
          searchQuery: query
        }
      });
    } catch (error) {
      alert(error.message || 'Đã có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
      setShowHistory(false);
      searchInputRef.current?.focus();
    }
  };

  // Delete single history item
  const handleDeleteHistoryItem = (e, index) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  // Clear all history
  const handleClearAllHistory = (e) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('search_history');
  };

  // Click outside to hide history dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="top-header sticky-header" ref={headerRef}>
        <div className="container top-header-container">
          <p className="text-welcome">
            <i className="bi bi-stars"></i>
            <span>Chào mừng bạn đến với Bookish!</span>
          </p>

          <div
            className="search-container position-relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <input
              ref={searchInputRef}
              className="form-control search-input pe-5"
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowHistory(true);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 180)}
            />

            {/* Prompt hướng dẫn */}
            {showPromptGuide && (
              <div
                className="position-absolute w-100 bg-white border shadow rounded p-3"
                style={{
                  top: 'calc(100% + 6px)',
                  zIndex: 1000,
                  borderColor: '#0d6efd40',
                  boxShadow: '0 6px 16px rgba(13,110,253,0.15)',
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold text-primary " style={{ fontSize: "14px" }}>💡 Tìm kiếm thông minh</span>
                </div>
                <div className="text-muted" style={{ fontSize: "14px" }}>
                  Mô tả theo cấu trúc này để có trải nghiệm tốt:
                </div>
                <div className="text-muted" style={{ fontSize: "14px" }}>
                  Chủ đề + mục đích + đối tượng đọc
                </div>
                <div className="text-primary" style={{ fontSize: "14px" }}>
                  Ví dụ: "Sách phát triển bản thân về quản lý thời gian cho sinh viên"
                </div>
              </div>
            )}

            <button className="search-button" onClick={() => handleSearch()}>
              <i className="bi bi-search"></i>
            </button>

            {/* Search history dropdown */}
            {showHistory && searchHistory.length > 0 && (
              <div
                ref={historyDropdownRef}
                className="position-absolute w-100 bg-white shadow-lg border mt-1 rounded-bottom"
                style={{
                  top: '100%',
                  zIndex: 9999,
                  maxHeight: '320px',
                  overflowY: 'auto',
                }}
              >
                <div className="p-2 border-bottom d-flex justify-content-between align-items-center bg-light">
                  <small className="text-muted fw-bold">Lịch sử tìm kiếm</small>
                  <button
                    onClick={handleClearAllHistory}
                    className="btn btn-sm text-danger p-0"
                    style={{ fontSize: '11px' }}
                  >
                    Xóa hết
                  </button>
                </div>

                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover-bg-light cursor-pointer d-flex justify-content-between align-items-center"
                    style={{ fontSize: '14px' }}
                    onClick={() => {
                      setSearchTerm(item);
                      handleSearch(item);
                    }}
                  >
                    <span className="d-flex align-items-center text-dark">
                      <i className="bi bi-clock-history me-2 text-muted"></i>
                      {item}
                    </span>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(e, index)}
                      className="btn btn-sm p-0 text-muted"
                      title="Xóa mục này"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="user-actions">
            <LoadingComponent isLoading={loading}>
              {user?.name ? (
                <div className="user-actions-inner">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => navigate('/favorite-products')}
                    title="Sản phẩm yêu thích"
                  >
                    <i className="bi bi-heart"></i>
                    <span className="badge-count">{productFavorite?.length || 0}</span>
                  </button>

                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => navigate('/shoppingcart')}
                    title="Giỏ hàng"
                  >
                    <i className="bi bi-cart3"></i>
                    <span className="badge-count">{order?.orderItems?.length || 0}</span>
                  </button>

                  <div className="user-menu btn-group" role="group">
                    <button
                      type="button"
                      className="btn dropdown-toggle user-dropdown-button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Chào, {user.name}
                    </button>
                    <ul className="dropdown-menu">
                      {user?.isAdmin && (
                        <>
                          <li>
                            <NavLink className="dropdown-item" to="/admin-profile">
                              <i className="bi bi-person-circle"></i> Hồ sơ
                            </NavLink>
                          </li>
                          <li>
                            <NavLink className="dropdown-item" to="/admin/shopManagement">
                              <i className="bi bi-house-gear"></i> Hệ thống
                            </NavLink>
                          </li>
                        </>
                      )}
                      {!user?.isAdmin && (
                        <li>
                          <NavLink className="dropdown-item" to="/profile">
                            <i className="bi bi-person-circle"></i> Hồ sơ
                          </NavLink>
                        </li>
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

      <nav className="navbar main-nav">
        <div className="container main-nav-container">
          <NavLink className="navbar-brand" to="/">
            <img src={shop?.logo || logo} alt="Logo" className="logo-img" />
          </NavLink>
          <ul className="nav nav-links">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item has-dropdown" style={{ position: 'relative' }}>
              <NavLink className="nav-link" to="/category">
                Danh mục
              </NavLink>
              <CategoryDropdown />
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/discount">
                Khuyến mãi
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about-us">
                Giới thiệu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/news">
                Tin tức
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default HeaderComponent;