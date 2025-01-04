import React, { useEffect, useState } from "react";
import FormComponent from "../../components/FormComponent/FormComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import qr from "../../assets/img/qr.png";
import OrderProductComponent from "../../components/OrderProductComponent/OrderProductComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import "./OrderPage.css";
import { useSelector } from "react-redux";
import * as UserService from '../../services/UserService';
import { useQuery } from "@tanstack/react-query";
import * as ListAddressService from '../../services/ListAddressService';

const OrderPage = () => {
  const user=useSelector((state)=>state.user)
  const order=useSelector((state)=>state.order)
   // Lấy dữ liệu user từ Redux
    const getUser = useSelector((state) => state.user);
  
    const getAllListAddressIsDefault = async (user, token) => {
      const res = await UserService.getAllListAddressIsDefault(user, token);  // Gọi API với user và token
      return res.data;
    };
  
    const { isLoading: isLoadingListAddress, data: listAddressesData } = useQuery({
      queryKey: ["listAddressesData", getUser.id, getUser.access_token],
      queryFn: () => getAllListAddressIsDefault(getUser?.id, getUser?.access_token),
      enabled: !!getUser?.id && !!getUser?.access_token,
    });
  
    const [addressDetails, setAddressDetails] = useState([]);
  
    useEffect(() => {
      if (listAddressesData) {
        const fetchDetails = async () => {
          const updatedAddresses = await Promise.all(listAddressesData.map(async (address) => {
            const { province, district, commune } = address;
  
            if (!province || !district || !commune) {
              return address;
            }
  
            try {
              const provinceDetail = await ListAddressService.getProvinceDetail(province);
              const districtDetail = await ListAddressService.getDistrictDetail(district);
              const communeDetail = await ListAddressService.getCommuneDetail(commune);
              return {
                ...address,
                provinceName: provinceDetail.data.data.name,
                districtName: districtDetail.data.data.name,
                communeName: communeDetail.data.data.name
              };
            } catch (error) {
              console.error("Error fetching address details for:", address, error);
              return address;
            }
          }));
  
          setAddressDetails(updatedAddresses); // Update state with the detailed addresses
        };
  
        fetchDetails();
      }
    }, [listAddressesData]);
  const [selectedOption1, setSelectedOption1] = useState("default");
  const [selectedOption2, setSelectedOption2] = useState("default");

 // Các state quản lý form
   const [phone, setPhone] = useState("");
   const [specificAddress, setSpecificAddress] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [selectedProvince, setSelectedProvince] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState("");
   const [selectedCommune, setSelectedCommune] = useState("");
   const [isDefault, setIsDefault] = useState(false);
   const [province, setProvince] = useState("");
   const [district, setDistrict] = useState("");
   const [commune, setCommune] = useState("");
 
   const resetForm = () => {
     setPhone("");
     setSpecificAddress("");
     setSelectedProvince("");
     setSelectedDistrict("");
     setSelectedCommune("");
     setIsDefault(false);
   };

   useEffect(() => {
    if (listAddressesData) {
      const defaultAddress = listAddressesData.find(address => address.isDefault); // Tìm địa chỉ mặc định
      
      if (defaultAddress) {
        // Set các giá trị mặc định vào form
        setPhone(defaultAddress.phone || "");
        setSpecificAddress(defaultAddress.specificAddress || "");
        setProvince(defaultAddress.provinceName || "");
        setDistrict(defaultAddress.districtName || "");
        setCommune(defaultAddress.communeName || "");
      }
    }
  }, [listAddressesData]);  // Chạy khi dữ liệu địa chỉ được trả về
  
 
   const getProvinces = async () => {
     const res = await ListAddressService.getProvinces();
     return res?.data || [];
   };
 
   const { isLoading: isLoadingProvince, data: provinces } = useQuery({
     queryKey: ["provinces"],
     queryFn: getProvinces,
   });
 
   const getDistricts = async (province) => {
     if (!province) return [];
     const res = await ListAddressService.getDistricts(province);
     return res?.data || [];
   };
 
   const { isLoading: isLoadingDistrict, data: districts, refetch: refetchDistricts } = useQuery(
     ["districts", selectedProvince],
     () => getDistricts(selectedProvince),
     { enabled: !!selectedProvince }
   );
 
   const getCommunes = async (district) => {
     if (!district) return [];
     const res = await ListAddressService.getCommunes(district);
     return res?.data || [];
   };
 
   const { isLoading: isLoadingCommune, data: communes, refetch: refetchCommunes } = useQuery(
     ["communes", selectedDistrict],
     () => getCommunes(selectedDistrict),
     { enabled: !!selectedDistrict }
   );
 
   useEffect(() => {
     if (selectedProvince) {
       refetchDistricts();
     }
   }, [selectedProvince, refetchDistricts]);
 
   useEffect(() => {
     if (selectedDistrict) {
       refetchCommunes();
     }
   }, [selectedDistrict, refetchCommunes]);
 
   const allProvinces = Array.isArray(provinces?.data)
     ? provinces.data.map((province) => ({
       value: province._id,
       label: province.name,
     }))
     : [];
 
   const allDistricts = Array.isArray(districts?.data)
     ? districts.data.map((district) => ({
       value: district._id,
       label: district.name,
     }))
     : [];
 
   const allCommunes = Array.isArray(communes?.data)
     ? communes.data.map((commune) => ({
       value: commune._id,
       label: commune.name,
     }))
     : [];
 
   const handleOnChangeIsDefault = (event) => setIsDefault(event.target.checked);
   const handleOnChangePhone = (value) => setPhone(value);
   const handleOnChangeCommune = (e) => setSelectedCommune(e.target.value);
   const handleOnChangeDistrict = (e) => {
     setSelectedDistrict(e.target.value);
     setSelectedCommune(""); 
   };
   const handleOnChangeProvince = (e) => {
     setSelectedProvince(e.target.value);
     setSelectedDistrict(""); 
     setSelectedCommune(""); 
   };
   const handleOnChangeSpecificAddress = (value) => setSpecificAddress(value);
  const info = (
    <>
                    <FormComponent
                      id="phoneNumber"
                      label="Số điện thoại"
                      type="text"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                    />
                    <FormSelectComponent
                      label="Tỉnh/Thành phố"
                      placeholder={isLoadingProvince ? "Đang tải..." : "Chọn tỉnh/Thành phố"}
                      options={addressDetails.map((address) => ({ value: address.provinceName, label: address.provinceName }))}
                      selectedValue={selectedProvince}
                      onChange={handleOnChangeProvince}
                      required={true}
                      value={province}
                    />
                    <FormSelectComponent
                      label="Quận/Huyện"
                      placeholder={isLoadingDistrict ? "Đang tải..." : "Chọn quận/Huyện"}
                      options={addressDetails.map((address) => ({ value: address.districtName, label: address.districtName }))}
                      selectedValue={selectedDistrict}
                      onChange={handleOnChangeDistrict}
                      required={true}
                      value={district}
                    />
                    <FormSelectComponent
                      label="Xã/Phường"
                      placeholder={isLoadingCommune ? "Đang tải..." : "Chọn xã/Phường"}
                      options={addressDetails.map((address) => ({ value: address.communeName, label: address.communeName }))}
                      selectedValue={selectedCommune}
                      onChange={handleOnChangeCommune}
                      required={true}
                      value={commune}
                    />
                    <FormComponent
                      id="specificAddressInput"
                      label="Địa chỉ cụ thể"
                      type="text"
                      placeholder="Nhập địa chỉ cụ thể"
                      value={specificAddress}
                      onChange={handleOnChangeSpecificAddress}
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

            {/* <div style={{ marginTop: "30px" }}>
              <CardComponent
                title="Phương thức vận chuyển"
                bodyContent={shippingMethodInfo}
                icon="bi bi-truck"
              />
            </div> */}

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
