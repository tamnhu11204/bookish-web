import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CardComponent = ({  bodyContent}) => {
    return (
        <div className="card border-0" style={{ borderRadius: "10px" }}>
            

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
