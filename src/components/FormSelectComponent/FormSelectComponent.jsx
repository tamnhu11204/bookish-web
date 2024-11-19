import React from "react";

const FormSelectComponent = ({ placeholder, type, label, ...rests }) => {
    return (
        <div className="mb-2">
                        <label className="form-label" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }} >{label}</label>
                        <select className="form-select" 
                        placeholder={placeholder}
                        type={type}
                        style={{
                            padding: '0 20px',
                            backgroundColor: '#E4F7CB',
                            fontSize: '14px',
                            width: '100%',
                            height: '35px',
                            border: 'none',
                            borderRadius: '10px',
                        }}
                        {...rests}
                        >
                            <option value="">Chọn Quận/Huyện</option>
                            {/* Thêm các tùy chọn khác ở đây */}
                        </select>
                    </div>
    );
};

export default FormSelectComponent;
