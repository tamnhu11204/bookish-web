import React from 'react'
import './CardComponent.css'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const CardComponent = ({ textHeader, ...rests }) => {
    return (
        <div className="card-product" >
            <div className="card-header">
                {textHeader}
            </div>

            <hr className="line" />

            <div className="card-body">
                <div className="d-flex justify-content-between">
                    {[...Array(5)].map((_, index) => (
                        <div className="card" style={{ width: '10rem', marginRight: '10px' }} key={index}>
                            <img src={'...'} className="card-img-top" alt="Book Cover" />
                            <div className="card-body">
                                <h5 className="card-title">Võ Nhất</h5>
                                <p className="card-text" style={{ color: '#198754' }}>Sách khoa học</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <ButtonComponent
                    textButton="See more"
                    // icon={<i className="bi bi-person-circle" />}
                />    
            </div>
        </div>
    )
}

export default CardComponent