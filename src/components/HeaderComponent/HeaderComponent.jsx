import React from 'react';
import Styles from '../../style';
import logo from '../../assets/img/logo.png';

const HeaderComponent = () => {
  return (
    <>
      <nav className="navbar" style={{ backgroundColor: '#198754', height: '60px' }} >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{height:'40px', width:'auto'}}/>
          </a>

          <input className="form-control" type="text" placeholder="Tìm" style={{ width: '500px', height: '35px', fontSize: '14px' }}></input>

          <div>
            <div className="btn">
              <i className="bi bi-person-circle" style={Styles.iconHeader}></i>
            </div>
            <div className="btn">
              <i className="bi bi-cart3" style={Styles.iconHeader}></i>
            </div>
            <div className="btn">
              <i className="bi bi-bell" style={Styles.iconHeader}></i>
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
