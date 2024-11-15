import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import img3 from '../../assets/img/img3.jpg'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import './HomePage.css'

const HomePage = () => {
  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container">
          <div style={{ marginTop: '30px' }}>
            <SliderComponent arrImages={[img1, img2]} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '30px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
        <div class="container" >
          <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

            <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
              <a class="text-decoration-underline"
                        href="./catagory">
              <ButtonComponent icon={<i className="bi bi-ui-checks-grid" />} />
              </a>
              Danh mục
            </div>

            <hr className="line" style={{ border: '1px solid #198754' }} />

            <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
              {[...Array(5)].map((_, index) => (
                <MiniCardComponent key={index}
                  img={img3}
                  content="Văn học" />
              ))}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container" style={{ marginTop: '30px' }}>
          <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

            <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
              <ButtonComponent icon={<i className="bi bi-graph-up-arrow" />} />
              Xu hướng mua sách
            </div>

            <hr className="line" style={{ border: '1px solid #198754' }} />

            <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
              {[...Array(10)].map((_, index) => (
                <CardProductComponent key={index}
                  img={img3}
                  proName="Ngàn mặt trời rực rỡ"
                  currentPrice="120000"
                  sold="12"
                  star="4,5"
                  score="210" />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <ButtonComponent
                    textButton="Xem thêm"
                    icon={<i className="bi bi-chevron-right" />}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container" style={{ marginTop: '30px' }}>
          <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

            <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
              <ButtonComponent icon={<i className="bi bi-book" />} />
              Sách mới
            </div>

            <hr className="line" style={{ border: '1px solid #198754' }} />

            <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
              {[...Array(10)].map((_, index) => (
                <CardProductComponent key={index}
                  img={img3}
                  proName="Ngàn mặt trời rực rỡ"
                  currentPrice="120000"
                  sold="12"
                  star="4,5"
                  score="210" />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <ButtonComponent
                    textButton="Xem thêm"
                    icon={<i className="bi bi-chevron-right" />}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '30px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
        <div class="container" >
          <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

            <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
              <ButtonComponent icon={<i className="bi bi-pen" />} />
              Nhà xuất bản
            </div>

            <hr className="line" style={{ border: '1px solid #198754' }} />

            <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
              {[...Array(5)].map((_, index) => (
                <MiniCardComponent key={index}
                  img={img3}
                  content="NXB Trẻ" />
              ))}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container" style={{ marginTop: '30px' }}>
          <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

            <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
              <ButtonComponent icon={<i className="bi bi-arrow-up-right-square" />} />
              Sách bán chạy theo tháng
            </div>

            <hr className="line" style={{ border: '1px solid #198754' }} />

            <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
              {[...Array(10)].map((_, index) => (
                <CardProductComponent key={index}
                  img={img3}
                  proName="Ngàn mặt trời rực rỡ"
                  currentPrice="120000"
                  sold="12"
                  star="4,5"
                  score="210" />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <ButtonComponent
                    textButton="Xem thêm"
                    icon={<i className="bi bi-chevron-right" />}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage