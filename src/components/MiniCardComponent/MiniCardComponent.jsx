import React from 'react'
import './MiniCardComponent.css'

function MiniCardComponent({ img, content, onClick }) {
    return (
        <div className="mini-card" onClick={onClick} style={{ width: '18rem' }}>
            <div className="mini-card-img-container">
                <img src={img} className="mini-card-img" alt="..." />
            </div>
            <div className="mini-card-body">
                <p className="mini-card-text">{content}</p>
            </div>
        </div>
    )
}

export default MiniCardComponent