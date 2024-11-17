import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CardComponent = ({ title, bodyContent, icon }) => {
    return (
        <div className="card border-0" style={{ borderRadius: "10px" }}>
            {/* Header */}
            <div
                className="card-header"
                style={{
                    backgroundColor: "#E4F7CB",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    height: "50px", // Set the height to 50px
                }}
            >
                <div className="d-flex align-items-center" style={{ height: "100%" }}>
                    <div
                        className="d-flex justify-content-center align-items-center me-2"
                        style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: "#2A7D46",
                            borderRadius: "5px",
                        }}
                    >
                        {/* Sử dụng icon thay vì ButtonComponent */}
                        <i
                            className={icon}
                            style={{ color: "#FFFFFF", fontSize: "20px" }}
                        ></i>
                    </div>
                    <h6 className="m-0" style={{ color: "#2A7D46", fontSize: "20px" }}>
                        {title}
                    </h6>
                </div>
            </div>

            {/* Body */}
            <div
                className="card-body "
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    minHeight: "100px", // Đảm bảo có chiều cao tối thiểu
                    flexWrap: "wrap", // Nếu có nhiều CardProductComponent, cho phép xuống dòng
                }}
            >
                {bodyContent}
            </div>

        </div>
    );
};

export default CardComponent;
