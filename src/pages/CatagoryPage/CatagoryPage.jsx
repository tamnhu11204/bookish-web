import React from 'react'
import './CatagoryPage.css'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

const CatagoryPage = () => {
    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div class="container" >
                <div className="row">
                <div className="col-2">
                    <div className="card-catagory" >
                        <div className="card-header-catagory">
                            DANH MỤC SẢN PHẨM
                        </div>
                        <div className="list-check" >
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    All
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    Văn học
                                </label>
                            </div>
                        </div>
                        <hr className="line" />

                        <div className="card-header-catagory">
                            GIÁ
                        </div>
                        <div className="list-check">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    0đ - 100.000đ
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    100.000đ - 200.000đ
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    200.000đ - 300.000đ
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    300.000đ - 400.000đ
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    400.000đ - 500.000đ
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    500.000đ - trở lên
                                </label>
                            </div>
                        </div>
                        <hr className="line" />

                        <div className="card-header-catagory">
                            NHÀ XUẤT BẢN
                        </div>
                        <div className="list-check">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    NXB Trẻ
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    Tao Đàn
                                </label>
                            </div>
                        </div>
                        <hr className="line" />

                        <div className="card-header-catagory">
                            HÌNH THỨC
                        </div>
                        <div className="list-check">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    Bìa cứng
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    Bìa mềm
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-10" >
                    <div style={{ marginTop: '30px' }}>
                        <SliderComponent arrImages={[img1, img2]} />
                    </div>

                    <div style={{ backgroundColor: '#F9F6F2' }}>
                        
                <div className="container" style={{ marginTop: '30px' }}>
                    <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

                        <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>Catagory</div>

                        <hr className="line" style={{ border: '1px solid #198754' }} />

                        <div className="card-body-1" style={{ marginLeft: '5px' , marginTop: '10px'}}>
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
            </div>
            </div>
        </div>
    )
}

export default CatagoryPage