import React from 'react';

const ProductItem = ({ image, name, price, quantity, onQuantityChange, onRemove }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };
 // Tính thành tiền
 const totalPrice = price * quantity;

 return (
   <div className="cart-item d-flex align-items-start border-bottom py-3">
     <input type="checkbox" className="me-3 mt-2" />
     <img
       src={image}
       alt={name}
       className="item-image me-3"
       style={{ width: '80px', height: '100px' }}
     />
     <div className="item-details flex-grow-1 d-flex flex-column">
       <h5 className="mb-2">{name}</h5>
       <div className="d-flex align-items-center justify-content-end mb-2">
         <button onClick={handleDecrease} className="btn btn-outline-secondary me-2">
           -
         </button>
         <span className="quantity mx-2">{quantity}</span>
         <button onClick={handleIncrease} className="btn btn-outline-secondary me-2">
           +
         </button>
         <span className="total-price mx-3">{totalPrice.toLocaleString()}đ</span>
         <button onClick={onRemove} className="remove-button btn btn-danger">
           X
         </button>
       </div>
       <p className="mb-0 mt-auto">{price.toLocaleString()}đ</p>
     </div>
   </div>
 );
};




export default ProductItem;
