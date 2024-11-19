import React, { useState } from 'react'
import FormComponent from '../../components/FormComponent/FormComponent'
import CardComponent from '../../components/CardComponent/CardComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import qr from '../../assets/img/qr.png'
import OrderProductComponent from '../../components/OrderProductComponent/OrderProductComponent';

const OrderPage = () => {

    const [selectedOption, setSelectedOption] = useState('default');
    const [selectedOption1, setSelectedOption1] = useState('default');
    const [selectedOption2, setSelectedOption2] = useState('default');

    const info = (
        <>
            <FormComponent
                id="birthInput"
                label="Họ và tên người nhận"
                type="text"
                placeholder="Nhập họ và tên người nhận"
            ></FormComponent>

            <FormComponent
                id="birthInput"
                label="Số điện thoại"
                type="text"
                placeholder="Nhập số điện thoại"
            ></FormComponent>

            <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="radio"
                    name="addressOption"
                    id="defaultAddress"
                    checked={selectedOption === 'default'}
                    onChange={() => setSelectedOption('default')}
                />
                <label className="form-check-label" style={{ fontSize: '16px' }}>
                    Bạch Đằng, Tân Uyên, Bình Dương
                </label>
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="radio"
                    name="addressOption"
                    id="otherAddress"
                    checked={selectedOption === 'other'}
                    onChange={() => setSelectedOption('other')}
                />
                <label className="form-check-label" style={{ fontSize: '16px' }}>
                    Chọn địa điểm khác
                </label>
            </div>

            {selectedOption === 'other' && (
                <div className="mb-3">
                    <FormSelectComponent
                        id="wardInput"
                        label="Tỉnh"
                        type="text"
                        placeholder="Nhập tỉnh"
                    ></FormSelectComponent>

                    <FormSelectComponent
                        id="wardInput"
                        label="Quận/Huyện"
                        type="text"
                        placeholder="Nhập quận/huyện"
                    ></FormSelectComponent>

                    <FormSelectComponent
                        id="wardInput"
                        label="Xã/Phường"
                        type="text"
                        placeholder="Nhập xã/phường"
                    ></FormSelectComponent>

                    <FormComponent
                        id="birthInput"
                        label="Bổ sung"
                        type="text"
                        placeholder="Nhập địa chỉ cụ thể"
                    ></FormComponent>
                </div>
            )}

            <FormComponent
                id="birthInput"
                label="Ghi chú cho shop"
                type="text"
                placeholder="Nhập ghi chú cho shop"
            ></FormComponent>
        </>
    )

    const shippingMethodInfo = (
        <>
            <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="radio"
                    name="shippingOption"
                    id="otherShipping"
                    checked={selectedOption1 === 'default'}
                    onChange={() => setSelectedOption1('default')}
                />
                <label className="form-check-label" style={{ fontSize: '16px' }}>
                    Giao hàng nhanh: 20.000đ
                </label>
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="radio"
                    name="shippingOption"
                    id="otherShipping"
                    checked={selectedOption1 === 'other'}
                    onChange={() => setSelectedOption1('other')}
                />
                <label className="form-check-label" style={{ fontSize: '16px' }}>
                    Giao hàng tiêu chuẩn: 20.000đ
                </label>
            </div>
        </>
    )

    const paymentMethodInfo = (
        <>
            <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="radio"
                    name="paymentOption"
                    id="cashOnDelivery"
                    checked={selectedOption2 === 'default'}
                    onChange={() => setSelectedOption2('default')}
                />
                <label className="form-check-label" style={{ fontSize: '16px' }}>
                    Thanh toán khi nhận hàng
                </label>
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="radio"
                    name="paymentOption"
                    id="bankPayment"
                    checked={selectedOption2 === 'other'}
                    onChange={() => setSelectedOption2('other')}
                />
                <label className="form-check-label" style={{ fontSize: '16px' }}>
                    Thanh toán bằng ngân hàng
                </label>
            </div>

            {/* Hiển thị ảnh nếu tùy chọn "other" được chọn */}
            {selectedOption2 === 'other' && (
                <div className="mb-3">
                    <img src={qr} className="card-img-top" alt="QR Code" />
                </div>
            )}
        </>
    );

    const promotionInfo = (
        <>
            <FormComponent
                id="birthInput"
                label="Mã khuyến mãi"
                type="text"
                placeholder="Nhập mã khuyến mãi"
            ></FormComponent>
        </>
    );

    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div class="container" >
                <div className="row">
                <div className="col-6">
                    <div style={{ marginTop: '30px' }}>
                        <CardComponent
                            title="Sách bán chạy trong tháng"
                            bodyContent={info}
                            icon="bi bi-info-circle"
                        />
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <CardComponent
                            title="Phương thức vận chuyển"
                            bodyContent={shippingMethodInfo}
                            icon="bi bi-truck"
                        />
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <CardComponent
                            title="Phương thức thanh toán"
                            bodyContent={paymentMethodInfo}
                            icon="bi bi-credit-card-2-back"
                        />
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <CardComponent
                            title="Mã khuyến mãi"
                            bodyContent={promotionInfo}
                            icon="bi bi-gift"
                        />
                    </div>
                </div>

                <div className="col-6"  style={{ marginTop: '30px' }}>
                <OrderProductComponent></OrderProductComponent>
                </div>
                </div>
            </div>
        </div>
    )
}

export default OrderPage