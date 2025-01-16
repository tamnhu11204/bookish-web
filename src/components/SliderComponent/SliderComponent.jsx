import React from 'react'
import Slider from 'react-slick';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };
    return (
        <Slider {...settings}>
            {arrImages.map((img)=>{
                return(
                    <img src={img} alt="slider" preview={false} width="100%" height="200px"/>
                )
            })}
        </Slider>
    )
}

export default SliderComponent