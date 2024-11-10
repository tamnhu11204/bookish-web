import React from 'react'
import './CardProductComponent.css'

const CardProductComponent = ({ img, proName, currentPrice, sold, star, score }) => {
    return (
        <div>
            <div class="card" style={{ width: '20rem' }}>

                <img src={img} class="card-img-top" alt="..." />

                <div class="card-body">
                    <h5 class="pro-name">{proName}</h5>

                    <div className="row">
                        <div className="col-1"><i class="bi bi-currency-dollar" style={{color: 'red', fontSize: '17px'}}></i></div>
                        <div className="col"><p class="current-price">{currentPrice}</p></div>
                    </div>

                    <p class="sold">Sold: {sold}</p>
                    
                    <div className="row">
                        <div className="col-3"><p class="star">{star}</p></div>
                        <div className="col-2"><i class="bi bi-star-fill"  style={{color: '#F4D761', marginLeft:'-30px', fontSize: '15px'}}></i></div>
                        <div className="col-2"><svg height="20">
                            <line x1="5" y1="0" x2="5" y2="100" style={{ stroke: '#666666', strokeWidth: 1 }} />
                        </svg></div>
                        <div className="col-5"><p class="score">{score} score</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProductComponent