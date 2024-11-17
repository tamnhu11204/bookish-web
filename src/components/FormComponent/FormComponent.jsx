import React from "react";

const FormComponent = ({placeholder, type, label,...rests }) => {
    return (
        <div style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '5px', fontSize:'16px' }}>{label}</label>
            <input
                placeholder={placeholder}
                type={type}
                style={{
                    padding:'0 20px',
                    backgroundColor: '#E4F7CB',
                    fontSize: '14px',
                    width: '100%',
                    height: '35px',
                    border: 'none',
                    borderRadius: '10px',
                }}
                {...rests}
            />
        </div>
    );
};

export default FormComponent;
