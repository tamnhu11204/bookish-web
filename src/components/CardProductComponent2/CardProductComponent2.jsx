import React from 'react'
import './CardProductComponent2.css'

const CardProductComponent = ({ img, proName, currentPrice, sold, star, feedbackCount,onClick }) => {
    return (
        <div className="card" style={{ width: '20rem' }} onClick={onClick}>

            <img src={img} className="card-img-top" alt="..." />

            <div className="card-body">
                <h5 className="pro-name">{proName}</h5>

                <div className="row">
                    <div className="col"><p className="current-price" style={{ color: 'red'}}>{currentPrice} đ</p></div>
                </div>

                <p className="sold">Đã bán: {sold}</p>

                <div className="row">
                    <strong>{star}/5⭐</strong> ({feedbackCount} đánh giá) | {sold} lượt bán
                </div>
            </div>
        </div>
    )
}

export default CardProductComponent