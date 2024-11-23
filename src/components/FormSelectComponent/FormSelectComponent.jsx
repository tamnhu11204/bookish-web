import React, { useState } from "react";

const FormSelectComponent = ({ placeholder, label, options, event, values }) => {
    const [inputValue, setInputValue] = useState(values || "");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (event) {
            event(e);
        }
    };

    return (
        <div className="mb-2">
            <label
                className="form-label"
                style={{ display: "block", marginBottom: "5px", fontSize: "16px" }}
            >
                {label}
            </label>
            <div className="input-container" style={{ position: "relative" }}>
                <input
                    list={`datalist-${label}`}
                    onChange={handleInputChange}
                    value={inputValue}
                    placeholder={placeholder || "Chọn hoặc nhập một tùy chọn"}
                    className="form-control"
                    style={{
                        padding: "0 20px",
                        backgroundColor: "#E4F7CB",
                        fontSize: "14px",
                        width: "100%",
                        height: "35px",
                        border: "none",
                        borderRadius: "10px",
                    }}
                />
                <datalist id={`datalist-${label}`}>
                    {options &&
                        options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                </datalist>
                {/* Dropdown arrow icon */}
                <span
                    className="dropdown-icon"
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "18px",
                        pointerEvents: "none",
                    }}
                >
                    <i class="bi bi-caret-down"></i>
                </span>
            </div>
        </div>
    );
};

export default FormSelectComponent;
