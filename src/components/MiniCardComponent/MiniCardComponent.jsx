import React from 'react'
import './MiniCardComponent.css'

function MiniCardComponent({img, content,onClick}) {
    return (
        <div className="card" onClick={onClick} style={{width: '18rem'}}>
            <img src={img} className="card-img" alt="..." />
            <div className="card-body">
                <p className="card-text">{content}</p>
            </div>
        </div>
    )
}

export default MiniCardComponent