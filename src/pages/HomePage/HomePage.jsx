import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'

const HomePage = () => {
  return (
    <div class="container">
      <div style={{ marginTop: '30px' }}>
        <SliderComponent arrImages={[img1, img2]} />
      </div>

      <div style={{ marginTop: '30px' }}>
        <CardComponent 
        textHeader="Danh mục sản phẩm"/>
      </div>

      <div style={{ marginTop: "30px", display: "flex", alignItems: 'center', gap: '20px' }}>
        <CardProductComponent />
      </div>
    </div>
  )
}

export default HomePage