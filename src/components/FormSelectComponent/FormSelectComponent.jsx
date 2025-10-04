import React from "react";

const FormSelectComponent = ({
    required,
    label,
    placeholder,
    options,
    selectedValue,
    onChange,
    name, // Thêm name để định danh
}) => {
    return (
        <div className="mb-3">
            <label
                className="form-label"
                style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "16px",
                    fontWeight: "600"
                }}
            >
                {required && <span style={{ color: "red" }}>*</span>}
                {label}
            </label>
            <select
                name={name} // Truyền name vào select
                className="form-select"
                value={selectedValue}
                onChange={onChange}
                style={{
                    padding: "0 20px",
                    backgroundColor: "#E4F7CB",
                    fontSize: "16px",
                    width: "100%",
                    height: "35px",
                    border: "none",
                    borderRadius: "10px",
                }}
            >
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
