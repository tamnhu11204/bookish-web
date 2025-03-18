import React from 'react';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import './ModalComponent.css';

const ModalComponent = ({ isOpen, title, body, onClick1, onClick2, textButton1, isLoading }) => {
    if (!isOpen) return null; // Không hiển thị nếu isOpen là false

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <div style={{ marginBottom: '5px' }}>
                        <button className="btn-close" 
                        aria-label="Close" 
                        onClick={onClick2}
                        disabled={isLoading}></button>
                    </div>
                </div>
                <div className="modal-body" style={{ fontSize: '16px' }}>
                    {body}
                </div>
                <div className="modal-footer">
                    <ButtonComponent 
                        textButton={textButton1} 
                        onClick={onClick1} 
                        isLoading={isLoading} // Truyền trạng thái loading vào ButtonComponent
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
