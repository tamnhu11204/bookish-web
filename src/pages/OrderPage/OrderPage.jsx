import React, { useState } from "react";
import FormComponent from "../../components/FormComponent/FormComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import qr from "../../assets/img/qr.png";
import OrderProductComponent from "../../components/OrderProductComponent/OrderProductComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import "./OrderPage.css";

const OrderPage = () => {
  const [selectedOption, setSelectedOption] = useState("default");
  const [selectedOption1, setSelectedOption1] = useState("default");
  const [selectedOption2, setSelectedOption2] = useState("default");

  const info = (
    <>
      <FormComponent
        id="recipientName"
        label="Họ và tên người nhận"
        type="text"
        placeholder="Nhập họ và tên người nhận"
      />

      <FormComponent
        id="phoneNumber"
        label="Số điện thoại"
        type="text"
        placeholder="Nhập số điện thoại"
      />

      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="radio"
          name="addressOption"
          id="defaultAddress"
          checked={selectedOption === "default"}
          onChange={() => setSelectedOption("default")}
        />
        <label className="form-check-label" style={{ fontSize: "16px" }}>
          Bạch Đằng, Tân Uyên, Bình Dương
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="radio"
          name="addressOption"
          id="otherAddress"
          checked={selectedOption === "other"}
          onChange={() => setSelectedOption("other")}
        />
        <label className="form-check-label" style={{ fontSize: "16px" }}>
          Chọn địa điểm khác
        </label>
      </div>

      {selectedOption === "other" && (
        <div className="mb-3">
          <FormSelectComponent
            id="provinceInput"
            label="Tỉnh"
            placeholder="Nhập tỉnh"
          />
          <FormSelectComponent
            id="districtInput"
            label="Quận/Huyện"
            placeholder="Nhập quận/huyện"
          />
          <FormSelectComponent
            id="wardInput"
            label="Xã/Phường"
            placeholder="Nhập xã/phường"
          />
          <FormComponent
            id="specificAddress"
            label="Bổ sung"
            type="text"
            placeholder="Nhập địa chỉ cụ thể"
          />
        </div>
      )}

      <FormComponent
        id="shopNote"
        label="Ghi chú cho shop"
        type="text"
        placeholder="Nhập ghi chú cho shop"
      />
    </>
  );

  const shippingMethodInfo = (
    <>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="radio"
          name="shippingOption"
          id="fastShipping"
          checked={selectedOption1 === "default"}
          onChange={() => setSelectedOption1("default")}
        />
        <label className="form-check-label" style={{ fontSize: "16px" }}>
          Giao hàng nhanh: 20.000đ
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="radio"
          name="shippingOption"
          id="standardShipping"
          checked={selectedOption1 === "other"}
          onChange={() => setSelectedOption1("other")}
        />
        <label className="form-check-label" style={{ fontSize: "16px" }}>
          Giao hàng tiêu chuẩn: 20.000đ
        </label>
      </div>
    </>
  );

  const paymentMethodInfo = (
    <>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="radio"
          name="paymentOption"
          id="cashOnDelivery"
          checked={selectedOption2 === "default"}
          onChange={() => setSelectedOption2("default")}
        />
        <label className="form-check-label" style={{ fontSize: "16px" }}>
          Thanh toán khi nhận hàng
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="radio"
          name="paymentOption"
          id="bankPayment"
          checked={selectedOption2 === "other"}
          onChange={() => setSelectedOption2("other")}
        />
        <label className="form-check-label" style={{ fontSize: "16px" }}>
          Thanh toán bằng ngân hàng
        </label>
      </div>

      {selectedOption2 === "other" && (
        <div className="mb-3">
          <img src={qr} className="card-img-top" alt="QR Code" />
        </div>
      )}
    </>
  );

  const promotionInfo = (
    <>
      <FormComponent
        id="promoCode"
        label="Mã khuyến mãi"
        type="text"
        placeholder="Nhập mã khuyến mãi"
      />
    </>
  );

  const totalPrice = 100000;
  const shippingFee = 20000;
  const discount = -25000;
  const finalTotal = totalPrice + shippingFee + discount;

  const orderInfo = (
    <>
      <OrderProductComponent
        imageSrc="https://via.placeholder.com/150"
        name="Thư gửi quý nhà giàu Việt Nam"
        price={100000}
        initialQuantity={2}
      />
      <OrderProductComponent
        imageSrc="https://via.placeholder.com/150"
        name="Thư gửi quý nhà giàu Việt Nam"
        price={100000}
        initialQuantity={2}
      />
      <svg height="20" width="100%">
        <line
          x1="0"
          y1="10"
          x2="100%"
          y2="10"
          style={{ stroke: "#666666", strokeWidth: 1 }}
        />
      </svg>
      <div className="card p-3">
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Thành tiền</span>
            <span>{totalPrice.toLocaleString()} ₫</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString()} ₫</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Giảm giá</span>
            <span>{discount.toLocaleString()} ₫</span>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Tổng số tiền</span>
          <span className="text-danger">{finalTotal.toLocaleString()} ₫</span>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <ButtonComponent textButton="Đặt hàng" />
        </div>
      </div>
    </>
  );

  return (
    <div style={{ backgroundColor: "#F9F6F2" }}>
      <div className="container">
        <div className="row">
          <div className="col-5">
            <div style={{ marginTop: "30px" }}>
              <CardComponent
                title="Thông tin giao hàng"
                bodyContent={info}
                icon="bi bi-info-circle"
              />
            </div>

            <div style={{ marginTop: "30px" }}>
              <CardComponent
                title="Phương thức vận chuyển"
                bodyContent={shippingMethodInfo}
                icon="bi bi-truck"
              />
            </div>

            <div style={{ marginTop: "30px" }}>
              <CardComponent
                title="Phương thức thanh toán"
                bodyContent={paymentMethodInfo}
                icon="bi bi-credit-card-2-back"
              />
            </div>

            <div style={{ marginTop: "30px" }}>
              <CardComponent
                title="Mã khuyến mãi"
                bodyContent={promotionInfo}
                icon="bi bi-gift"
              />
            </div>
          </div>

          <div className="col-7" style={{ marginTop: "30px" }}>
            <div className="sticky-card" >
              <CardComponent
                title="Xem lại đơn hàng"
                bodyContent={orderInfo}
                icon="bi bi-box2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
