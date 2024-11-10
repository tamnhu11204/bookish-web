import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

const HomePage = () => {
  return (
    <><div class="container">
      <div style={{ marginTop: '30px' }}>
        <SliderComponent arrImages={[img1, img2]} />
      </div>
    </div>

      <div style={{ backgroundColor: '#198754', marginTop: '30px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px'}}></div>
        <div class="container" >
          <CardComponent 
          textHeader="Catagory"
          headerButton={
            <ButtonComponent
                icon={<i className="bi bi-ui-checks-grid" />}
            />
        }>
            <div className="d-flex justify-content-between">
              {[...Array(5)].map((_, index) => (
                <MiniCardComponent key={index}
                  img={img1}
                  content="Sách giáo khoa" />
              ))}
            </div>
          </CardComponent>
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px'}}></div>
      </div>

      <div class="container" style={{ marginTop: "30px", display: "flex", alignItems: 'center', gap: '20px' }}>
        <CardComponent textHeader="Book purchasing trends">
          <div className="d-flex justify-content-between">
            {[...Array(5)].map((_, index) => (
              <CardProductComponent key={index}
                img={img1}
                proName="Ngàn mặt trời rực rỡ"
                currentPrice="120000"
                sold="12"
                star="4,5"
                score="210" />
            ))}
          </div>
        </CardComponent>
      </div>

      <div class="container" style={{ marginTop: "30px", display: "flex", alignItems: 'center', gap: '20px' }}>
        <CardComponent textHeader="New books">
          <div className="d-flex justify-content-between">
            {[...Array(5)].map((_, index) => (
              <CardProductComponent key={index}
                img={img1}
                proName="Ngàn mặt trời rực rỡ"
                currentPrice="120000"
                sold="12"
                star="4,5"
                score="210" />
            ))}
          </div>
        </CardComponent>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '30px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px'}}></div>
        <div class="container" >
          <CardComponent 
          textHeader="Publisher"
          headerButton={
            <ButtonComponent
                icon={<i className="bi bi-ui-checks-grid" />}
            />
        }>
            <div className="d-flex justify-content-between">
              {[...Array(5)].map((_, index) => (
                <MiniCardComponent key={index}
                  img={img1}
                  content="NXB Trẻ" />
              ))}
            </div>
          </CardComponent>
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px'}}></div>
      </div>
    </>
  )
}

export default HomePage