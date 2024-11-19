import React from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import img1 from '../../assets/img/img1.png';
import img2 from '../../assets/img/img2.png';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import CardComponent from '../../components/CardComponent/CardComponent';

const BookPurchasingTrendPage = () => {

    //Chứa body của card
    const bookPurchasingTrendInfo = (
        <>
            <div style={{ backgroundColor: '#198754', height: '40px', marginTop: '-10px' }}>
                <div class="btn-group" role="group" >
                    <ButtonComponent textButton="All" />
                    <ButtonComponent textButton="Văn học" />
                </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
                {[...Array(10)].map((_, index) => (
                    <CardProductComponent
                        key={index}
                        img={img1}
                        proName="Ngàn mặt trời rực rỡ"
                        currentPrice="120000"
                        sold="12"
                        star="4.5"
                        score="210"
                    />
                ))}
            </div>
        </>
    )
    
    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div style={{ backgroundColor: '#F9F6F2' }}>
                <div className="container">
                    <div style={{ marginTop: '30px' }}>
                        <SliderComponent arrImages={[img1, img2]} />
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
                <div className="container" style={{ marginTop: '30px' }}>
                    <CardComponent
                        title="Xu hướng mua sách"
                        bodyContent={bookPurchasingTrendInfo}
                        icon="bi bi-graph-up-arrow"
                    />
                </div>
            </div>
        </div>
    );
}

export default BookPurchasingTrendPage;
