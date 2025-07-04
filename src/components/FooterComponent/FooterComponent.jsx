import React, { useEffect, useState } from 'react';
import './FooterComponent.css';
import * as ShopProfileService from '../../services/ShopProfileService';
import * as ListAddressService from '../../services/ListAddressService';
import { useQuery } from '@tanstack/react-query';

function FooterComponent() {
    const [addressDetails, setAddressDetails] = useState(null);

    const getDetailShop = async () => {
        const res = await ShopProfileService.getDetailShop();
        return res.data;
    };

    const { isLoading: isLoadingShop, data: shop } = useQuery({
        queryKey: ['shop'],
        queryFn: getDetailShop,
    });

    useEffect(() => {
        if (shop) {
            const fetchDetails = async () => {
                try {
                    const [provinceRes, districtRes, communeRes] = await Promise.all([
                        ListAddressService.getProvinceDetail(shop.province),
                        ListAddressService.getDistrictDetail(shop.district),
                        ListAddressService.getCommuneDetail(shop.commune),
                    ]);

                    setAddressDetails({
                        provinceName: provinceRes.data.data.name,
                        districtName: districtRes.data.data.name,
                        communeName: communeRes.data.data.name,
                    });
                } catch (error) {
                    console.error("Error fetching address details:", error);
                }
            };

            fetchDetails();
        }
    }, [shop]);

    if (isLoadingShop) {
        return <div>Loading...</div>;
    }

    if (!shop || !addressDetails) {
        return <div>Shop information is not available.</div>;
    }

    return (
        <footer className="footer text-white py-4" style={{ backgroundColor: '#198754', fontSize: '14px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <img
                            alt={shop.name || "Shop Logo"}
                            src={shop.logo}
                            className="shop-logo"
                            onError={(e) => e.target.src = '/default-logo.png'} // Hiển thị ảnh mặc định nếu lỗi
                        />
                        <p style={{ fontSize: '20px' }}>{shop.slogan}</p>
                        <p>{shop.description}</p>
                        <p>
                            Kho hàng: {shop.specificAddress}, {addressDetails.communeName},
                            {addressDetails.districtName}, {addressDetails.provinceName}
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h2>Hỗ Trợ Khách Hàng</h2>
                        <p>Hotline: {shop.phone}</p>
                        <p>
                            <a href={`mailto:${shop.email}`} className="text-white">Email: {shop.email}</a>
                        </p>
                        <p>
                            <a href="/policy" className="text-white">Chính sách hỗ trợ hoàn đơn</a>
                        </p>
                        <p>
                            <a href="/instruction" className="text-white">Hướng dẫn đặt hàng</a>
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h2>Đến Thăm Bookish Tại</h2>
                        <div className="social-icons d-flex gap-2">
                            <a href={shop.facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: '30px' }}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href={shop.insta} target="_blank" rel="noopener noreferrer" style={{ fontSize: '30px', marginLeft: '10px' }}>
                                <i className="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponent;
