import React, { useState, useEffect } from "react";

const FormSelectComponent = ({
    required,
    label,
    placeholder,
    options = [],
    selectedValue,
    onChange,
    name,
    type
}) => {

    // State cho autocomplete
    const [inputValue, setInputValue] = useState("");
    const [showList, setShowList] = useState(false);

    // Đồng bộ inputValue khi selectedValue thay đổi (ví dụ load form edit)
    useEffect(() => {
        const selected = options.find(opt => opt.value === selectedValue);
        setInputValue(selected ? selected.label : "");
    }, [selectedValue, options]);

    // Filter cho autocomplete
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // 👉 Nếu không phải autocomplete → render <select> truyền thống
    if (type !== "autocomplete") {
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
                    name={name}
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
    }

    // 👉 Autocomplete mode
    return (
        <div className="mb-3" style={{ position: "relative" }}>
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

            <input
                type="text"
                className="form-control"
                value={inputValue}
                placeholder={placeholder}
                onFocus={() => setShowList(true)}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                    backgroundColor: "#E4F7CB",
                    borderRadius: "10px",
                    height: "35px"
                }}
            />

            {showList && (
                <ul
                    className="list-group"
                    style={{
                        position: "absolute",
                        top: "80px",
                        width: "100%",
                        maxHeight: "180px",
                        overflowY: "auto",
                        zIndex: 10,
                        cursor: "pointer",
                        borderRadius: "10px"
                    }}
                >
                    {filteredOptions.length === 0 && (
                        <li className="list-group-item">Không tìm thấy</li>
                    )}

                    {filteredOptions.map((opt) => (
                        <li
                            key={opt.value}
                            className="list-group-item"
                            onClick={() => {
                                // Set chọn lên parent
                                onChange({
                                    target: { name, value: opt.value }
                                });

                                // Hiển thị label vừa chọn
                                setInputValue(opt.label);

                                // Đóng dropdown
                                setShowList(false);
                            }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FormSelectComponent;
