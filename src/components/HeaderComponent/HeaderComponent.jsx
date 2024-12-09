import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import * as UserService from '../../services/UserService';
import Styles from '../../style';
import { resetUser } from '../../redux/slides/UserSlide';
import LoadingComponent from '../LoadingComponent/LoadingComponent';


const HeaderComponent = () => {
  const user = useSelector((state) => state.user)
  console.log('user', user)

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }
  return (
    <>
      <nav className="navbar" style={{ backgroundColor: '#198754', height: '60px' }} >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto' }} />
          </a>

          <input className="form-control" type="text" placeholder="Tìm" style={{ width: '500px', height: '35px', fontSize: '14px' }}></input>

          <div className="row" >
            <div className="col-3" >
              <a className="nav-link" href="/shoppingcart">
                <i className="bi bi-cart3" style={Styles.iconHeader}></i>
              </a>
            </div>

            <div className="col-3">
              <i className="bi bi-bell" style={Styles.iconHeader}></i>
            </div>

            <div className="col-6" >
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
                      <li>
                        <div className="row">
                          <div className="col-2" style={{ marginTop: '3px' }}><i className="bi bi-person-circle" style={{ marginLeft: '5px' }}></i></div>
                          <div className="col-10">
                            <a className="dropdown-item" href="/profile" >
                              Hồ sơ
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="row">
                          <div className="col-2" style={{ marginTop: '3px' }}><i className="bi bi-box-arrow-right" style={{ marginLeft: '5px' }}></i></div>
                          <div className="col-10">
                            <btn className="dropdown-item" onClick={handleLogout} >
                              Đăng xuất
                            </btn>
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

      <nav className="navbar" style={{ height: '60px' }}>
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
              <a className="nav-link" href="/catagory" style={Styles.textHeader}>
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
}

export default HeaderComponent;
