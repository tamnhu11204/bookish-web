import React from 'react'
import './CardProductComponent.css'

const CardProductComponent = ({ img, proName, currentPrice, sold, star, feedbackCount,onClick, view }) => {
    return (
        <div className="card-pro" style={{ width: '22rem' }} onClick={onClick}>

            <img src={img} className="card-img-top" alt="..." />

            <div className="card-body">
                <h5 className="pro-name">{proName}</h5>

                <div className="row">
                    <div className="col"><p className="current-price" style={{ color: 'red'}}>{currentPrice} đ</p></div>
                </div>

                <p className="sold">Đã bán: {sold}</p>

                <div className="row">
                    <strong>{star}/5⭐</strong>
                </div>
                <div className="row" style={{marginLeft:'0px'}}>
                    {feedbackCount} đánh giá | {sold} lượt bán | {view} lượt xem
                </div>
            </div>
        </div>
    )
}

export default CardProductComponent