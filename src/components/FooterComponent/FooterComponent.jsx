import React from 'react'
import './FooterComponent.css'

function FooterComponent() {
    return (
        <footer className="footer bg-dark text-white py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h2>Bookish</h2>
                        <p>Mở sách, mở thế giới</p>
                        <p>Bookish.com chỉ nhận đặt hàng online và giao hàng trực tiếp.</p>
                        <p>KHÔNG hỗ trợ mua trực tiếp.</p>
                        <p>Kho hàng: Phường Đông Hòa, Thành phố Dĩ An, Tỉnh Bình Dương</p>
                    </div>
                    <div className="col-md-4">
                        <h2>Hỗ Trợ Khách Hàng</h2>
                        <p>0123456789</p>
                        <p>
                            <a href="mailto:bookishshop@gmail.com" className="text-white">bookishshop@gmail.com</a>
                        </p>
                        <p>
                            <a href="#" className="text-white">Câu hỏi thường gặp</a>
                        </p>
                        <p>
                            <a href="#" className="text-white">Hướng dẫn đặt hàng</a>
                        </p>
                        <p>
                            <a href="#" className="text-white">Giới thiệu về Bookish.com</a>
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h2>Đến Thăm Bookish Tại</h2>
                        <div className="social-icons d-flex gap-2">
                            <a href="#"><img src="facebook-icon.png" alt="Facebook" className="social-icon" /></a>
                            <a href="#"><img src="pinterest-icon.png" alt="Pinterest" className="social-icon" /></a>
                            <a href="#"><img src="instagram-icon.png" alt="Instagram" className="social-icon" /></a>
                            <a href="#"><img src="other-icon.png" alt="Other" className="social-icon" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent