import React from 'react';
import './ModalComponent.css';

const ModalComponent = ({ isOpen, onClose, title, body, onSave }) => {
    if (!isOpen) return null; // Không hiển thị nếu `isOpen` là `false`

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5>{title}</h5>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {body}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Đóng
                    </button>
                    <button className="btn btn-primary" onClick={onSave}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
