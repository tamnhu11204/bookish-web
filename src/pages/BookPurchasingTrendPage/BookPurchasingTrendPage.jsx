import React from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import img1 from '../../assets/img/img1.png';
import img2 from '../../assets/img/img2.png';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import './BookPurchasingTrendPage.css'; // Import the CSS file
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const BookPurchasingTrendPage = () => {
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
                    <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

                        <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
                        <ButtonComponent icon={<i className="bi bi-graph-up-arrow" />} />
                            Xu hướng mua sách
                        </div>

                        <hr className="line" style={{ border: '1px solid #198754' }} />
                        <div style={{ backgroundColor: '#198754', height: '40px' , marginTop:'-10px'}}>
                            <div class="btn-group" role="group" >
                                <ButtonComponent textButton="All"/>
                                <ButtonComponent textButton="Văn học"/>
                            </div>
                        </div>

                        <div className="card-body-1" style={{ marginLeft: '45px' , marginTop: '10px'}}>
                            {[...Array(10)].map((_, index) => (
                                <CardProductComponent key={index}
                                    img={img1}
                                    proName="Ngàn mặt trời rực rỡ"
                                    currentPrice="120000"
                                    sold="12"
                                    star="4.5"
                                    score="210" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookPurchasingTrendPage;
