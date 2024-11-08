import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'

const HomePage = () => {
  return (
    <div style={{padding:'0 120px', backgroundColor:'#F9F6F2'}}>
      <SliderComponent arrImages={[img1,img2]}/>
    </div>
  )
}

export default HomePage