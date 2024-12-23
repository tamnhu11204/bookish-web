import React from "react";

const FormComponent = (props) => {
    const handleOnChangeInput = (e) => {
        props.onChange(e.target.value);
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>
                
                {props.required && <span style={{ color: 'red' }}>*</span>} 
                {props.label} {/* Thêm dấu * nếu trường bắt buộc */}
            </label>
            <input
                value={props.value}
                placeholder={props.placeholder}
                type={props.type}
                style={{
                    padding: '0 20px',
                    backgroundColor: '#E4F7CB',
                    fontSize: '16px',
                    width: '100%',
                    height: '35px',
                    border: 'none',
                    borderRadius: '10px',
                }}
                onChange={handleOnChangeInput}
            />
        </div>
    );
};

export default FormComponent;
