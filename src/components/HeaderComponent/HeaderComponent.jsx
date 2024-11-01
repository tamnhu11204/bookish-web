import React from 'react'
import Styles from '../../style';

const HeaderComponent = () => {
  return (
    <><nav className="navbar" style={{ backgroundColor: '#005D13' }}>
      <div class="container">
        <a className="navbar-brand" href="#">
          <img
            src="logobookish.jpeg"
            alt="logo" width="30" height="24" />
        </a>


        <div>
          <div className="btn">
            <i class="bi bi-person-circle" style={Styles.iconStyles}> Tài khoản </i>
          </div>

        </div>
      </div>
    </nav>
    <nav class="navbar" style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container-fluid">

          <a class="navbar-brand" href="#"></a>

          <div className="btn">
          <i class="bi bi-house-door" style={Styles.iconStyles2}></i>
          </div>
          <div className="btn">
          <i class="bi bi-list" style={Styles.iconStyles2}></i>
          </div>
          <input class="form-control" type="text" placeholder="Tìm kiếm" style={{backgroundColor: '#E4F7CB', width: '400px', height: '35px' }}></input>
          <div className="btn">
          <i class="bi bi-bell" style={Styles.iconStyles2}></i>
          </div>
          <div className="btn">
          <i class="bi bi-cart" style={Styles.iconStyles2}></i>
          </div>
        </div>
      </nav></>
    
  );
}

export default HeaderComponent;