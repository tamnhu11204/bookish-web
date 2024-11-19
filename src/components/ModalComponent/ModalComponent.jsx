import React from 'react';
import './ModalComponent.css';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../ButtonComponent/ButtonComponent2';

const ModalComponent = ({ isOpen, title, body, onClick1, onClick2, textButton1 }) => {
    if (!isOpen) return null; // Không hiển thị nếu isOpen là false

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <div style={{marginBottom:'5px'}}>
                    <ButtonComponent2  
                    icon={<i class="bi bi-x"></i>}
                    onClick={onClick2}/>
                    </div>
                </div>
                <div className="modal-body">
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