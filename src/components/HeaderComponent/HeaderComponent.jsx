import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import * as UserService from '../../services/UserService';
import Styles from '../../style';
import { resetUser } from '../../redux/slides/UserSlide';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import './SearchButton.css';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false, isHiddenNoti = false }) => {
  const user = useSelector((state) => state.user);
  const shop = useSelector((state) => state.shop);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    localStorage.clear();
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "user_id=; path=/; max-age=0; SameSite=Lax";

    // Gửi thông báo đăng xuất tới chatbot
    const iframe = document.querySelector("iframe[src*='localhost:8000.onrender.com']");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "LOGOUT" },
        "*"
      );
    }

    setLoading(false);
    navigate('/login');
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setLoading(false);
  }, [user?.name]);

  const handleOnClickCart = () => {
    navigate('/shoppingcart');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <nav className="navbar sticky-header">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src={shop?.logo || logo}
              alt="Logo"
              style={{ height: '40px', width: 'auto' }}
            />
          </a>

          {!user?.isAdmin && (
            <>
              <input
                className="form-control"
                type="text"
                placeholder="Tìm"
                style={{ width: '500px', height: '35px', fontSize: '14px' }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch} style={{ marginLeft: '-100px' }}>
                <i className="bi bi-search"></i>
              </button>
            </>
          )}

          <div className="row">
            {!user?.isAdmin && (
              <div className="col-3">
                <button type="button" className="btn position-relative" style={{ width: '40px' }}
                  onClick={handleOnClickCart}>
                  <i className="bi bi-cart3" style={Styles.iconHeader}></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '10px' }}>
                    {order?.orderItems?.length || 0}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </button>
              </div>
            )}

            <div className="col-6">
              <LoadingComponent isLoading={loading}>
                {user?.name ? (
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ fontSize: '16px', color: '#fff' }}
                    >
                      Hello, {user.name}
                    </button>
                    <ul className="dropdown-menu" style={{ fontSize: '16px' }}>
                      {user?.isAdmin && (
                        <li>
                          <div className="row">
                            <div className="col-2" style={{ marginTop: '3px' }}>
                              <i className="bi bi-person-circle" style={{ marginLeft: '5px' }}></i>
                            </div>
                            <div className="col-10">
                              <a className="dropdown-item" href="/admin-profile">
                                Hồ sơ
                              </a>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-2" style={{ marginTop: '3px' }}>
                              <i className="bi bi-house-gear" style={{ marginLeft: '5px' }}></i>
                            </div>
                            <div className="col-10">
                              <a className="dropdown-item" href="/admin">
                                Hệ thống
                              </a>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-2" style={{ marginTop: '3px' }}>
                              <i className="bi bi-chat-dots" style={{ marginLeft: '5px' }}></i>
                            </div>
                            <div className="col-10">
                              <a className="dropdown-item" href="/admin/livechat">
                                Nhắn tin
                              </a>
                            </div>
                          </div>
                        </li>
                      )}

                      {!user?.isAdmin && (
                        <li>
                          <div className="row">
                            <div className="col-2" style={{ marginTop: '3px' }}>
                              <i className="bi bi-person-circle" style={{ marginLeft: '5px' }}></i>
                            </div>
                            <div className="col-10">
                              <a className="dropdown-item" href="/profile">
                                Hồ sơ
                              </a>
                            </div>
                          </div>
                        </li>
                      )}

                      <li>
                        <div className="row">
                          <div className="col-2" style={{ marginTop: '3px' }}>
                            <i className="bi bi-box-arrow-right" style={{ marginLeft: '5px' }}></i>
                          </div>
                          <div className="col-10">
                            <button className="dropdown-item" onClick={handleLogout}>
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <a className="nav-link" href="/login">
                    <p style={{ color: '#fff', fontSize: '16px' }}>Đăng nhập/Đăng ký</p>
                  </a>
                )}
              </LoadingComponent>
            </div>
          </div>
        </div>
      </nav>

      <nav className="navbar" style={{ height: '60px', position: 'sticky', top: '55px', zIndex: 999, backgroundColor: '#fff' }}>
        <div className="container">
          <ul className="nav nav-underline">
            <li className="nav-item">
              <a className="nav-link" href="/" style={Styles.textHeader}>
                <i className="bi bi-house-door" style={Styles.iconHeader2}></i>
                Trang chủ
              </a>
            </li>
          </ul>
          <ul className="nav nav-underline">
            <li className="nav-item">
              <a className="nav-link" href="/category" style={Styles.textHeader}>
                <i className="bi bi-ui-checks-grid" style={Styles.iconHeader2}></i>
                Danh mục
              </a>
            </li>
          </ul>
          <ul className="nav nav-underline">
            <li className="nav-item">
              <a className="nav-link" href="/discount" style={Styles.textHeader}>
                <i className="bi bi-gift" style={Styles.iconHeader2}></i>
                Khuyến mãi
              </a>
            </li>
          </ul>
          <ul className="nav nav-underline">
            <li className="nav-item">
              <a className="nav-link" href="/comparison" style={Styles.textHeader}>
                <i className="bi bi-ui-radios" style={Styles.iconHeader2}></i>
                So sánh
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default HeaderComponent;