import React from "react";

const FormComponent = (props) => {
    return (
        <div className="mb-3" style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '421px'
        }}>
            <label htmlFor="exampleFormControlInput1" className="form-label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="form-control"
                id={props.id}
                placeholder={props.placeholder}
            />
        </div>
    );
};

export default FormComponent;
