import React from 'react'
import Styles from '../../style'

const HeaderComponent = () => {
  return (
    <><nav className="navbar" style={{ backgroundColor: '#198754', height: '60px' }} >
      <div class="container">
        <a className="navbar-brand" href="#">
          <img src='Logo/Img'/>
        </a>

        <input class="form-control" type="text" placeholder="Search book" style={{ width: '500px', height: '35px', fontSize: '14px' }}></input>

        <div>
          <div className="btn">
            <i class="bi bi-person-circle" style={Styles.iconHeader}></i>
          </div>
          <div className="btn">
            <i class="bi bi-cart3" style={Styles.iconHeader}></i>
          </div>
          <div className="btn">
            <i class="bi bi-bell" style={Styles.iconHeader}></i>
          </div>
        </div>
      </div>
    </nav>

      <nav className="navbar" style={{  height: '60px' }}>
        <div class="container">
          <ul class="nav nav-underline">
            <li class="nav-item">
              <a class="nav-link" href="#" style={Styles.textHeader}>
                <i class="bi bi-house-door" style={Styles.iconHeader2}></i>
                Home
              </a>
            </li>
          </ul>
          <ul class="nav nav-underline">
            <li class="nav-item">
              <a class="nav-link" href="#" style={Styles.textHeader}>
                <i class="bi bi-ui-checks-grid" style={Styles.iconHeader2}></i>
                Catagory
              </a>
            </li>
          </ul>
          <ul class="nav nav-underline">
            <li class="nav-item">
              <a class="nav-link" href="#" style={Styles.textHeader}>
                <i class="bi bi-gift" style={Styles.iconHeader2}></i>
                Discount
              </a>
            </li>
          </ul>
          <ul class="nav nav-underline">
            <li class="nav-item">
              <a class="nav-link" href="#" style={Styles.textHeader}>
                <i class="bi bi-ui-radios" style={Styles.iconHeader2}></i>
                Comparison
              </a>
            </li>
          </ul>
        </div>
      </nav></>
  );
}

export default HeaderComponent;