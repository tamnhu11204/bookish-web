import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ButtonComponent2 from "../../components/ButtonComponent/ButtonComponent2";
import CardComponent from "../../components/CardComponent/CardComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import * as message from "../../components/MessageComponent/MessageComponent";
import OrderProductComponent from "../../components/OrderProductComponent/OrderProductComponent";
import PromoItemComponent from "../../components/PromoItemComponent/PromoItemComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ListAddressService from '../../services/ListAddressService';
import * as OrderActiveListService from '../../services/OrderActiveListService';
import * as OrderService from '../../services/OrderService';
import * as ProductService from '../../services/ProductService';
import * as PromotionService from '../../services/PromotionService';
import * as ShopProfileService from '../../services/ShopProfileService';
import * as UserService from '../../services/UserService';
import "./OrderPage.css";
import { removeAllOrderProduct } from "../../redux/slides/OrderSlide";

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const shop2 = useSelector((state) => state.shop2)
  console.log('shop2', shop2)
  const [selectedOption, setSelectedOption] = useState("default");
  const [selectedOption2, setSelectedOption2] = useState("default");

  // Lấy dữ liệu address mặc định
  const getUser = useSelector((state) => state.user);
  const dispatch=useDispatch()

  const getAllListAddressIsDefault = async (user, token) => {
    const res = await UserService.getAllListAddressIsDefault(user, token);  // Gọi API với user và token
    return res.data;
  };

  const { isLoading: isLoadingListAddress, data: listAddressesData } = useQuery({
    queryKey: ["listAddressesData", getUser.id, getUser.access_token],
    queryFn: () => getAllListAddressIsDefault(getUser?.id, getUser?.access_token),
    enabled: !!getUser?.id && !!getUser?.access_token,
  });

  const [addressDetails, setAddressDetails] = useState();

  useEffect(() => {
    if (listAddressesData && listAddressesData.length > 0) {
      const fetchDetails = async () => {
        if (listAddressesData.length === 1) {
          const address = listAddressesData[0];
          const { province, district, commune } = address;

          if (!province || !district || !commune) {
            setAddressDetails(address);
            return;
          }

          try {
            const provinceDetail = await ListAddressService.getProvinceDetail(province);
            const districtDetail = await ListAddressService.getDistrictDetail(district);
            const communeDetail = await ListAddressService.getCommuneDetail(commune);
            setAddressDetails({
              ...address,
              provinceName: provinceDetail.data.data.name,
              districtName: districtDetail.data.data.name,
              communeName: communeDetail.data.data.name,
            });
          } catch (error) {
            console.error("Error fetching address details for:", address, error);
            setAddressDetails(address); // Lưu địa chỉ mặc định nếu có lỗi
          }
        } else {
          const updatedAddresses = await Promise.all(
            listAddressesData.map(async (address) => {
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
                  communeName: communeDetail.data.data.name,
                };
              } catch (error) {
                console.error("Error fetching address details for:", address, error);
                return address;
              }
            })
          );
          setAddressDetails(updatedAddresses);
        }
      };

      fetchDetails();
    }
  }, [listAddressesData]);

  const getDetailShop = async () => {
    const res = await ShopProfileService.getDetailShop();
    return res.data;
  };

  const { isLoading: isLoadingShop, data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: getDetailShop,
  });

  // Các state quản lý của nhập mới thông tin
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

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

  const handleOnChangePhone = (value) => setPhone(value);
  const handleOnChangeName = (value) => setName(value);
  const handleOnChangeNote = (value) => setNote(value);
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

  //
  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (order && order.orderItemSelected && order.orderItemSelected.length > 0) {
        try {
          const limitedOrderItems = order.orderItemSelected.slice(0, 20); // Giới hạn số lượng (ví dụ: 20 sản phẩm)
          const productData = await Promise.all(
            limitedOrderItems.map(async (item) => {
              const productDetail = await ProductService.getDetailProduct(item.product);
              return productDetail.data;
            })
          );
          setProductDetails(productData);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      } else {
        setProductDetails([]);
      }
    };

    fetchProductDetails();
  }, [JSON.stringify(order?.orderItems)]);

  ////////////------------các phần của ui----------///////////////
  //card thông tin giao hàng
  useEffect(() => {
    if (getUser, addressDetails) {
      setName(getUser.name || '');
      setPhone(addressDetails.phone || '');
    }
  }, [getUser, addressDetails]);

  const info = (
    <>
      <FormComponent
        id="recipientName"
        label="Họ và tên người nhận"
        type="text"
        value={name}
        placeholder="Nhập họ và tên người nhận"
        onChange={handleOnChangeName}
        enable={true}
      />
      <FormComponent
        id="phoneNumber"
        label="Số điện thoại"
        type="text"
        value={phone}
        placeholder="Nhập số điện thoại"
        onChange={handleOnChangePhone}
        enable={true}
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
          {addressDetails ? (
            <div>
              {addressDetails.specificAddress}, {addressDetails.communeName}, {addressDetails.districtName}, {addressDetails.provinceName}
            </div>
          ) : (
            "Chưa có địa chỉ mặc định"
          )}
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
            label="Tỉnh/Thành phố"
            placeholder="Chọn tỉnh/thành phố"
            options={allProvinces}
            value={selectedProvince}
            onChange={handleOnChangeProvince}
          />
          <FormSelectComponent
            id="districtInput"
            label="Quận/Huyện"
            placeholder="Chọn quận/huyện"
            options={allDistricts}
            value={selectedDistrict}
            onChange={handleOnChangeDistrict}
            disabled={!selectedProvince}
          />
          <FormSelectComponent
            id="wardInput"
            label="Xã/Phường"
            placeholder="Chọn xã/phường"
            options={allCommunes}
            value={selectedCommune}
            onChange={handleOnChangeCommune}
            disabled={!selectedDistrict}
          />
          <FormComponent
            id="specificAddress"
            label="Bổ sung địa chỉ"
            type="text"
            placeholder="Nhập địa chỉ cụ thể"
            value={specificAddress}
            onChange={handleOnChangeSpecificAddress}
            enable={true}
          />
        </div>
      )}

      <FormComponent
        id="shopNote"
        label="Ghi chú cho shop"
        type="text"
        placeholder="Nhập ghi chú cho shop"
        value={note}
        onChange={handleOnChangeNote}
        enable={true}
      />
    </>
  );

  //card phương thức thanh toán
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
          Mã thanh toán momo
          <img src={shop.momo} className="card-img-top" alt="QR Momo" />
          Mã thanh toán ngân hàng
          <img src={shop.bank} className="card-img-top" alt="QR Bank" />
        </div>
      )}
    </>
  );

  //card khuyến mãi
  const getAllPromotion = async () => {
    const res = await PromotionService.getAllPromotion();
    return res.data;
  };

  const { isLoading: isLoadingPromo, data: promotions } = useQuery({
    queryKey: ['promotions'],
    queryFn: getAllPromotion,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn mã khuyến mãi
  const totalPrice = order?.orderItemSelected?.reduce((total, item) => {
    return total + (item.price * item.amount);
  }, 0) || 0;

  const handlePromoSelection = (promotionId, condition) => {
    if (condition > totalPrice) {
      alert('Đơn hàng của bạn không đạt điều kiện để áp dụng khuyến mãi! Vui lòng chọn khuyến mãi khác.');
      return;
    }

    setSelectedPromotion((prev) => (prev === promotionId ? null : promotionId));
  };


  const PromoSelectionPage = ({ isOpen, closeModal }) => {
    if (!isOpen) return null;
    return (
      <div className="custom-modal">
        <div className="modal-content">
          <div className="promo">
            <div className="p-4 border rounded" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-success mb-0">
                  <i className="bi bi-percent me-2"></i>CHỌN MÃ KHUYẾN MÃI
                </h5>
                <button className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>

              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Nhập mã khuyến mãi" />
                <button className="btn btn-success">Áp dụng</button>
              </div>

              <div className="mb-4">
                <h6 className="mb-2">Mã giảm giá</h6>
                <small className="text-muted">Áp dụng tối đa: 1</small>

                {promotions && promotions.length > 0 ? (
                  promotions.map((promotion) => (
                    <PromoItemComponent
                      key={promotion._id}
                      value={promotion.value.toLocaleString()}
                      condition={promotion.condition.toLocaleString()}
                      start={new Date(promotion.start).toISOString().split('T')[0]}
                      finish={new Date(promotion.finish).toISOString().split('T')[0]}
                      isApplied={selectedPromotion === promotion._id}
                      onActionClick={() => handlePromoSelection(promotion._id, promotion.condition)}
                      actionLabel={selectedPromotion === promotion._id ? 'Bỏ chọn' : 'Chọn'}
                    />
                  ))
                ) : (
                  <p>Không có khuyến mãi. Mong bạn thông cảm!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getDetailPromotion = async (selectedPromotion) => {
    const res = await PromotionService.getDetailPromotion(selectedPromotion);
    return res.data; 
  };

  const { isLoading: isLoadingDetailPromo, data: detailPromo } = useQuery({
    queryKey: ['detailPromo', selectedPromotion], 
    queryFn: () => getDetailPromotion(selectedPromotion), 
    enabled: !!selectedPromotion, 
  });


  // Component hiển thị nút "Chọn mã khuyến mãi"
  const promotionInfo = (
    <div>
      <ButtonComponent2 textButton="Chọn mã khuyến mãi" onClick={openModal} />
      <p style={{fontSize:'16px'}}>
        Khuyến mãi bạn đã chọn: {detailPromo?.value ? `${detailPromo.value.toLocaleString()} ₫` : 'Chưa chọn mã nào'}
      </p>
      <PromoSelectionPage isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );

  ///////////---------xử lý order------------//////////
  const deliveryFee = shop?.deliveryFee || 0;
  const navigate = useNavigate()
  const mutation = useMutationHook(data => OrderService.createOrder(data));
  const { data, isLoading, isSuccess, isError } = mutation
  useEffect(() => {
    if (isSuccess && data?.status !== 'ERR') {
      const arrayOrdered = [];
      
      // Sử dụng trực tiếp orderItemSelected nếu nó là một mảng
      order?.orderItemSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
  
      console.log("Danh sách sản phẩm cần xóa:", arrayOrdered);
  
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
  
      message.success();
      alert('Đặt hàng thành công!');
      navigate("/shoppingcart");
    } else if (isError) {
      message.error();
    }
  }, [data?.status, isError, isSuccess, navigate]);
  
  
  
  
  
  const handleOnOrderClick = async() => {
    let a, b, c, d, e;

    if (selectedOption === "default") {
      // Nếu chọn địa chỉ mặc định
      a = addressDetails.province;
      b = addressDetails.district;
      c = addressDetails.commune;
      d = addressDetails.specificAddress;
    } else if (selectedOption === "other") {
      // Nếu chọn địa chỉ khác
      a = selectedProvince;
      b = selectedDistrict;
      c = selectedCommune;
      d = specificAddress;
    }

    if (selectedOption2 === "default") {
      e = true;
    } else if (selectedOption2 === "other") {
      e = false;
    }

    // Tạo đơn hàng
    const newOrder = {
      orderItems: order?.orderItemSelected,
      phone: phone,
      name: name,
      specificAddress: d,
      commune: c,
      district: b,
      province: a,
      paymentMethod: e,
      itemsPrice: totalPrice,
      shippingPrice: shop?.deliveryFee,
      discount: detailPromo?.value || 0,
      totalMoney: totalPrice + shop?.deliveryFee - (detailPromo?.value || 0),
      note: note,
      user: getUser?.id,
      activeNow: 'Chờ xác nhận',
    };

    try {
      if (detailPromo && detailPromo._id) { // Kiểm tra null và _id
        const response = await PromotionService.updateUsedPromotion(detailPromo._id);
        console.log('Promotion updated successfully:', response);
      } else {
        console.log('No valid promotion to update.');
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
    
    mutation.mutate(newOrder, {
      onSuccess: async (data) => {
        if (data?.status === 'OK' && data?.data?._id) {
          // Gọi API cập nhật trạng thái đơn hàng
          const orderId = data.data._id; // Lấy ID đơn hàng từ response
          const orderActiveData = {
            order: orderId,
            activeList: [
              {
                active: 'Chờ xác nhận',
                date: new Date(),
              },
            ],
          };
  
          try {
            const response = await OrderActiveListService.createOrderActive(orderActiveData);
            if (response?.status === 'OK') {
              console.log('Order status updated successfully:', response);
            } else {
              console.error('Failed to update order status:', response?.message);
            }
          } catch (error) {
            console.error('Error updating order status:', error);
          }
        }
      },
    });
  };

console.log('order?.orderItemSelected.data.array', order?.orderItemSelected)
  //card thông tin đơn hàng

  const orderInfo = (
    <>
      {productDetails && productDetails.length > 0 ? (
        productDetails.map((item, index) => (
          order?.orderItemSelected[index] ? (
            <OrderProductComponent
              imageSrc={item?.img}
              name={item?.name}
              price={order?.orderItemSelected[index].price}
              initialQuantity={order?.orderItemSelected[index].amount}
            />
          ) : null
        ))
      ) : (
        <p>Không có sản phẩm.</p>
      )}

      <svg height="20" width="100%">
        <line
          x1="0"
          y1="10"
          x2="100%"
          y2="10"
          style={{ stroke: "#666666", strokeWidth: 1 }}
        />
      </svg>
      <div className="card p-3" style={{fontSize:'16px'}}>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Tạm tính:</span>
            <span>{totalPrice.toLocaleString()} ₫</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Phí vận chuyển</span>
            <span>{shop.deliveryFee.toLocaleString()} ₫</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Giảm giá</span>
            <span>{detailPromo?.value ? detailPromo.value.toLocaleString() : 0} ₫</span>
          </div>

        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Tổng số tiền</span>
          <span className="text-danger">{(totalPrice + deliveryFee - (detailPromo?.value || 0)).toLocaleString()} ₫</span>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <ButtonComponent textButton="Đặt hàng"
            onClick={handleOnOrderClick} />
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
