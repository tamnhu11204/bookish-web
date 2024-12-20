import React from "react";

const FormSelectComponent = ({ label, placeholder, options, selectedValue, onChange }) => {
    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <select className="form-select" value={selectedValue} onChange={onChange}
                style={{
                    padding: "0 20px",
                    backgroundColor: "#E4F7CB",
                    fontSize: "14px",
                    width: "100%",
                    height: "35px",
                    border: "none",
                    borderRadius: "10px",
                }}>
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelectComponent;
