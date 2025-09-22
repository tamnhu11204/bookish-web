import "bootstrap/dist/css/bootstrap.min.css";

const OrderProductComponent = ({ imageSrc, name, price, initialQuantity }) => {
  const numericPrice = Number(String(price || '0').replace(/,/g, ''));
  const numericQuantity = Number(initialQuantity || 0);
  const subtotal = numericPrice * numericQuantity;

  return (
    <div
      className="card mb-3 d-flex flex-row align-items-center p-3"
      style={{ maxWidth: "100%" }}
    >
      <div className="flex-shrink-0">
        <img
          src={imageSrc}
          className="img-fluid rounded"
          alt={name}
          style={{ width: "120px", height: "auto" }}
        />
      </div>

      <div
        className="flex-grow-1 d-flex justify-content-between align-items-center ms-3"
        style={{ flexWrap: "wrap", fontSize: '16px' }}
      >
        <h5 className="mb-0 me-3" style={{ fontSize: '20px' }}>{name}</h5>
        <p className="mb-0 me-3">{numericPrice.toLocaleString()} ₫</p>
        <p className="mb-0 me-3">x {numericQuantity}</p>
        <p className="mb-0 ms-3">
          Thành tiền: {subtotal.toLocaleString()} ₫
        </p>
      </div>
    </div>
  );
};


export default OrderProductComponent;
