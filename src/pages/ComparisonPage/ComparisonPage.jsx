import React from 'react'
import './ComparisonPage.css'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import img4 from '../../assets/img/img4.png'

const ComparisonPage = () => {
    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div class="container">
                <div class="card-comparison">
                    <div class="card-body-comparison">
                        <h5 class="card-title-comparison">So sánh sách</h5>

                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-3">
                                <CardProductComponent
                                    img={img4}
                                    proName="Ngàn mặt trời rực rỡ"
                                    currentPrice="120000"
                                    sold="12"
                                    star="4.5"
                                    score="210"
                                >
                                </CardProductComponent>
                            </div>

                            <div className="col-3">
                                <div className="card" style={{ width: '20rem', height: '39.2rem' }}>
                                    <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="btn">
                                            <i className="bi bi-plus-circle" style={{ fontSize: '30px', color: '#198754' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-3">
                                <div className="card" style={{ width: '20rem', height: '39.2rem' }}>
                                    <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="btn">
                                            <i className="bi bi-plus-circle" style={{ fontSize: '30px', color: '#198754' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

                    <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
                        So sánh điểm nổi bật
                    </div>

                    <hr className="line" style={{ border: '1px solid #198754' }} />

                    <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
                        <table class="table table-striped w-100">
                            <thead className="bg-success text-white text-center">
                                <tr>
                                    <th>Số sánh nổi bật</th>
                                    <th>Giá bìa</th>
                                    <th>Giảm giá</th>
                                    <th>Giá sau sale</th>
                                    <th>Điểm</th>
                                    <th>Lượt bán</th>
                                    <th>Đánh giá</th>
                                    <th>Lượt xem</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <td>Trên biển nhà đẹp khóc</td>
                                    <td>200.000₫</td>
                                    <td>-50%</td>
                                    <td>100.000₫</td>
                                    <td>2222 điểm</td>
                                    <td>11</td>
                                    <td>4,5/5 (2000 đánh giá)</td>
                                    <td>5000</td>
                                </tr>
                                <tr>
                                    <td>Đến nhớ và những đứa con của biển</td>
                                    <td>200.000₫</td>
                                    <td>-0%</td>
                                    <td>100.000₫</td>
                                    <td>2100 điểm</td>
                                    <td>11</td>
                                    <td>4,3/5 (1230 đánh giá)</td>
                                    <td>5100</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>

            <div class="container">
                <div className="card-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #198754', borderRadius: '10px' }}>

                    <div className="card-header" style={{ padding: '0 10px', fontSize: '25px', marginLeft: '10px', marginTop: '8px', color: '#198754' }}>
                        Thông tin chi tiết
                    </div>

                    <hr className="line" style={{ border: '1px solid #198754' }} />

                    <div className="card-body-1" style={{ marginLeft: '45px', marginTop: '10px' }}>
                        <table class="table table-striped w-100">
                            <thead className="bg-success text-white text-center">
                                <tr>
                                    <th>Số sánh nổi bật</th>
                                    <th>Giá bìa</th>
                                    <th>Giảm giá</th>
                                    <th>Giá sau sale</th>
                                    <th>Điểm</th>
                                    <th>Lượt bán</th>
                                    <th>Đánh giá</th>
                                    <th>Lượt xem</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <td>Trên biển nhà đẹp khóc</td>
                                    <td>200.000₫</td>
                                    <td>-50%</td>
                                    <td>100.000₫</td>
                                    <td>2222 điểm</td>
                                    <td>11</td>
                                    <td>4,5/5 (2000 đánh giá)</td>
                                    <td>5000</td>
                                </tr>
                                <tr>
                                    <td>Đến nhớ và những đứa con của biển</td>
                                    <td>200.000₫</td>
                                    <td>-0%</td>
                                    <td>100.000₫</td>
                                    <td>2100 điểm</td>
                                    <td>11</td>
                                    <td>4,3/5 (1230 đánh giá)</td>
                                    <td>5100</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComparisonPage