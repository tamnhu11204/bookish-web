import React from 'react';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import './ModalComponent.css';

const ModalComponent = ({ isOpen, title, body, onClick1, onClick2, textButton1 }) => {
    if (!isOpen) return null; // Không hiển thị nếu isOpen là false

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <div style={{marginBottom:'5px'}}>
                    {/* <ButtonComponent2  
                    icon={<i className="bi bi-x"></i>}
                    onClick={onClick2}/> */}
                    <button className="btn-close" 
                    aria-label="Close" 
                    onClick={onClick2}></button>
                    </div>
                </div>
                <div className="modal-body" style={{fontSize:'16px'}}>
                    {body}
                </div>
                <div className="modal-footer">
                    <ButtonComponent 
                    textButton={textButton1}
                    onClick={onClick1}/>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;