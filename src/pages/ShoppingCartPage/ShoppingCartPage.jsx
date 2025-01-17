import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, seletedOrder } from '../../redux/slides/OrderSlide';
import * as ProductService from '../../services/ProductService';
import "../ShoppingCartPage/ShoppingCartPage.css";

export const ShoppingCartPage = () => {
  const order = useSelector((state) => state.order);
  //const user = useSelector((state) => state.user);
  const [productDetails, setProductDetails] = useState([]);
  const dispatch = useDispatch();
  const [listChecked, setListChecked] = useState([]);
  const navigate=useNavigate()
  const user = useSelector((state) => state.user);


  useEffect(() => {
    const fetchProductDetails = async () => {
      if (order && order.orderItems && order.orderItems.length > 0) {
        try {
          const limitedOrderItems = order.orderItems.slice(0, 20); // Giới hạn số lượng (ví dụ: 20 sản phẩm)
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

  const handleOnClickCount = ({ type, idProduct }) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }));
    } else {
      dispatch(decreaseAmount({ idProduct }));
    }
  };

  const handleOnClickDelete = ({ idProduct }) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleClickCheckBox = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value);
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleOnClickAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(seletedOrder({listChecked}))
  }, [listChecked])

  const handleOnClickDeleteAll = () => {
    if (listChecked && listChecked.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  }

  const priceMemo = useMemo(() => {
    if (!order?.orderItemSelected) return 0; // Early return if orderItemSelected is undefined
    
    const result = order?.orderItemSelected.reduce((totalMoney, cur) => {
      return totalMoney + ((cur.price * cur.amount) || 0); // Ensure price or amount is not undefined
    }, 0);
  
    return result;
  }, [order]);

const handleOrder = () => {
  if (user?.active) {
    alert('Bạn bị admin chặn mua hàng! Hãy liên hệ với shop để biết thêm thông tin.');
  } else if (!order?.orderItemSelected?.length) {
    // Kiểm tra nếu user.active là false hoặc không có, hiển thị thông báo lỗi
    alert('Vui lòng chọn sản phẩm');
  } else {
    // Nếu user.active là true và có sản phẩm được chọn, điều hướng đến trang đặt hàng
    navigate('/order');
  }
};

  

  return (
    <div className="container">
      <div className="cart-page">
        <h3 className="cart-title mb-4">Giỏ Hàng sản phẩm</h3>
        <div className="row">
          {/* Cột Checkbox */}
          <div className="col-3">
            <input
              type="checkbox"
              className="me-3 mt-2"
              onChange={handleOnClickAll}
              checked={listChecked?.length === order?.orderItems?.length}
            />
            <span className="header-label flex-grow-1">Chọn tất cả</span>
          </div>

          {/* Cột sản phẩm */}
          <div className="col-3">
            <span className="header-quantity text-end">Sản phẩm</span>
          </div>

          {/* Cột Giá tiền */}
          <div className="col-2">
            <span className="header-quantity text-center">Giá tiền</span>
          </div>

          {/* Cột Số lượng */}
          <div className="col-2 ">
            <span className="header-quantity text-center">Số lượng</span>
          </div>

          {/* Cột Thành tiền */}
          <div className="col-1">
            <span className="header-quantity text-center">Thành tiền</span>
          </div>

          <div className="col-1">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleOnClickDeleteAll()}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>

          {/* Hiển thị danh sách sản phẩm */}
          <div className="cart-items">
            {productDetails && productDetails.length > 0 ? (
              productDetails.map((item, index) => (
                order?.orderItems[index] ? (
                  <div className="cart-item d-flex align-items-center border-bottom py-3" key={index}>
                    <div className="col-1">
                      <input
                        type="checkbox"
                        className="me-3 mt-2"
                        onChange={handleClickCheckBox}
                        value={order.orderItems[index].product}
                        checked={listChecked.includes(order.orderItems[index].product)}
                      />
                    </div>

                    <div className="col-2">
                      <img
                        src={item.img[0]}
                        alt={item.name}
                        className="item-image"
                        style={{ width: '80px', height: '100px' }}
                      />
                    </div>

                    <div className="col-3">
                      <h5 className="mb-2">{item.name}</h5>
                    </div>

                    <div className="col-2">
                      <p className="mb-0">{order.orderItems[index]?.price.toLocaleString()}đ</p>
                    </div>

                    <div className="col-2 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => handleOnClickCount({ type: 'decrease', idProduct: order.orderItems[index]?.product })}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        id="quantity"
                        className="form-control"
                        style={{ width: '30px', fontSize: '16px' }}
                        value={order.orderItems[index]?.amount || 1}
                        min="1"
                        max="10"
                      />
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => handleOnClickCount({ type: 'increase', idProduct: order.orderItems[index]?.product })}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <div className="col-2">
                      <span className="total-price">
                        {(order.orderItems[index]?.amount * order.orderItems[index]?.price || 0).toLocaleString()}đ
                      </span>
                    </div>

                    <div className="col-1">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleOnClickDelete({ idProduct: order.orderItems[index]?.product })}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ) : null
              ))
            ) : (
              <p>Không có sản phẩm trong giỏ hàng.</p>
            )}
          </div>
        </div>

        {/* Phần Thanh toán */}
        <div className="payment-section border-top pt-2">
          <div className="d-flex justify-content-between">
            <span>Tổng tiền:</span>
            <span>{priceMemo.toLocaleString()}đ</span>
            {/* Hiển thị tổng tiền giỏ hàng */}
          </div>
          <div style={{marginBottom:'30px', marginTop:'20px'}} >
            <ButtonComponent textButton="Đặt hàng" onClick={handleOrder} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
