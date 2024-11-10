import React from 'react';
import './CardComponent.css';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const CardComponent = ({ textHeader, headerButton, children, ...rests }) => {
    return (
        <div className="card-product">
            <div className="card-header">
                <div className="row">
            {/* <div className="col">{headerButton && <div className="header-button">{headerButton}</div>}</div> */}
                <div className="col">{textHeader}</div>
                </div>
            </div>

            <hr className="line" />

            <div className="card-body">
                {children}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <ButtonComponent
                    textButton="See more"/>
            </div>
        </div>
    );
}

export default CardComponent;
