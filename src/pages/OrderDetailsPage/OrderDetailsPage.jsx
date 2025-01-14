import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as OrderService from '../../services/OrderService';
import * as ListAddressService from '../../services/ListAddressService';
import * as ProductService from '../../services/ProductService';
import * as OrderActiveListService from '../../services/OrderActiveListService';
import { useQuery } from "@tanstack/react-query";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await OrderService.getDetailOrder(id);
      setOrder(data.data);
    };
    fetchProduct();
  }, [id]);

  const [addressDetails, setAddressDetails] = useState(null);

  useEffect(() => {
    if (!order) return;

    const fetchDetails = async () => {
      if (!order.province || !order.district || !order.commune) {
        console.warn("Thiếu thông tin tỉnh, huyện, xã trong order.");
        return;
      }

      try {
        const provinceDetail = await ListAddressService.getProvinceDetail(order.province);
        const districtDetail = await ListAddressService.getDistrictDetail(order.district);
        const communeDetail = await ListAddressService.getCommuneDetail(order.commune);

        setAddressDetails({
          province: order.province,
          district: order.district,
          commune: order.commune,
          provinceName: provinceDetail.data.data.name,
          districtName: districtDetail.data.data.name,
          communeName: communeDetail.data.data.name,
        });
      } catch (error) {
        console.error("Error fetching address details for order:", error);
        setAddressDetails({
          province: order.province,
          district: order.district,
          commune: order.commune,
        });
      }
    };

    fetchDetails();
  }, [order]);

  // Ensure that addressDetails and order are available before rendering customer information
  const customer = {
    name: order?.name,
    phone: order?.phone,
    address: order && addressDetails
      ? `${order.specificAddress}, ${addressDetails.communeName}, ${addressDetails.districtName}, ${addressDetails.provinceName}`
      : "Địa chỉ chưa được cập nhật",
    orderDate: order ? new Date(order.createdAt).toISOString().split('T')[0] : "",
    orderId: order?._id,
  };

  useEffect(() => {
    if (order?.paymentMethod === true) {
      setPaymentMethod('Thanh toán khi nhận hàng');
    } else {
      setPaymentMethod('Thanh toán qua ngân hàng');
    }
  }, [order?.paymentMethod]);


  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (order && order.orderItems && order.orderItems.length > 0) {
        try {
          const limitedOrderItems = order.orderItems.slice(0, 20);
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

  const getAllOrderActive = async (id) => {
    const res = await OrderActiveListService.getAllOrderActive(id);
    return res?.data ;
  };

  const { isLoading: isLoadingActiveList, data: activeLists } = useQuery(
    ["activeLists", id],
    () => getAllOrderActive(id)  // Truyền hàm vào queryFn
  );


  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-4">Trạng thái: <span className="badge bg-success">{order?.activeNow}</span></h5>

          <div className="row mb-4">
            <div className="col-md-6">
              <div>
                <strong>Tên khách hàng:</strong> {customer.name}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {customer.phone}
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <strong>Ngày đặt:</strong> {customer.orderDate}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {customer.address}
              </div>
            </div>
          </div>

          <h5 className="bg-light p-2" style={{fontSize:'16px'}}>Mã đơn: {customer.orderId}</h5>
          <table className="table mt-3" style={{fontSize:'16px'}}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {productDetails && productDetails.length > 0 ? (
                productDetails.map((item, index) => (
                  order?.orderItems[index] ? (
                    <tr key={index}>
                      <td className="d-flex align-items-center">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="img-thumbnail me-3"
                          style={{ width: "80px" }}
                        />
                        {item.name}
                      </td>
                      <td>{order?.orderItems[index].price.toLocaleString()} đ</td>
                      <td>{order?.orderItems[index].amount}</td>
                      <td>{(order?.orderItems[index].price * order?.orderItems[index].amount).toLocaleString()} đ</td>
                    </tr>
                  ) : null
                ))
              ) : (
                <p>Không có sản phẩm.</p>
              )}
            </tbody>

          </table>

          <div className="text-end" style={{fontSize:'16px'}}>
            <p>Tạm tính: {order?.itemsPrice.toLocaleString()} đ</p>
            <p>Phí vận chuyển: {order?.shippingPrice.toLocaleString()} đ</p>
            <p>Giảm giá: {order?.discount.toLocaleString()} đ</p>
            <h5 className="fw-bold text-danger" style={{ fontSize: '20px' }}>Tổng tiền: {order?.totalMoney.toLocaleString()}đ</h5>
          </div>

          <h5 className="bg-light p-2 mt-4" style={{fontSize:'16px'}}>Phương thức thanh toán: {paymentMethod}</h5>
          <ul style={{fontSize:'16px'}}>
          {activeLists && activeLists.length > 0 ? (
            activeLists[0].activeList.map((item, index) => (
              <li key={index}>
                <strong>{item.active}</strong> : {new Date(item.date).toISOString().split('T')[0]}
              </li>
            ))
          ) : (
            <p>Không có trạng thái nào.</p>
          )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
