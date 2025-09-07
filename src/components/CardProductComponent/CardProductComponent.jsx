import React from 'react';
import './CardProductComponent.css';

const CardProductComponent = ({ img, proName, currentPrice, sold, star, feedbackCount, onClick, view }) => {
    return (
        <div className="card-product-component" onClick={onClick}>
            <div className="card-product-img-container">
                <img src={img} className="card-product-img" alt="..." />
            </div>
            <div className="card-product-body">
                <h5 className="card-product-name">{proName}</h5>
                <div className="card-product-row">
                    <div className="col">
                        <p className="card-product-price">{currentPrice} đ</p>
                    </div>
                </div>
                <div className="card-product-row">
                    <strong>{star}/5⭐</strong>
                </div>
                <div className="card-product-row" style={{ marginLeft: '0px' }}>
                    {feedbackCount} đánh giá | {sold} lượt bán | {view} lượt xem
                </div>
            </div>
        </div>
    );
};

export default CardProductComponent;