import React from 'react'
import './MiniCardComponent.css'

function MiniCardComponent({img, content}) {
    return (
        <div class="card" style={{width: '18rem'}}>
            <img src={img} class="card-img" alt="..." />
            <div class="card-body">
                <p class="card-text">{content}</p>
            </div>
        </div>
    )
}

export default MiniCardComponent