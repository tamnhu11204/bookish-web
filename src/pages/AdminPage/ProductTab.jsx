
import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ProductDetailForm from './ProductEdit';
import AddProductForm from './ProductAdd';

const ProductTab = () => {
    const [activeTab, setActiveTab] = useState("all");
    const products = [
        {
            id :103,
            image :'https://via.placeholder.com/50',
                    name : "Vợ nhặt",
                    price : "50.000 đ",
                    discount : "50%",
                    type :"Văn học Việt Nam",
                    placeholder:"Nhập mã đơn",
                    inventory : 12,
                    sold : 12
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name : "Vợ nhặt",
            price : "50.000 đ",
            discount : "50%",
            type :"Văn học Việt Nam",
            placeholder:"Nhập mã đơn",
            inventory : 12,
            sold : 12
        },
    ];
    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState(''); // Nút Lưu/Cập nhật
    const [onSave, setOnSave] = useState(() => () => {});
    const [onCancel, setOnCancel] = useState(() => () => {});
    const [Type,setType] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    };

  

    // Hàm mở modal thêm danh mục
    const handleAddProduct = () => {
        
        setShowModal(true);
        setType(true);
       
    };

    // Hàm mở modal sửa danh mục
    const handleEditProduct = () => {
        
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
        setType(false);
    };
    

     if (showModal == false)return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">DANH SÁCH ĐƠN HÀNG</h3>
            </div>

            
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo thời gian đơn hàng"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm sản phẩm "
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddProduct}
                        />
                    </div>

                    
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                        <th scope="col" style={{ width: '10%' }}>Mã</th>
                        <th scope="col" style={{ width: '10%' }}>Ảnh</th>
                        <th scope="col" style={{ width: '20%' }}>Tên sản phẩm</th>
                        <th scope="col" style={{ width: '10%' }}>Giá</th>
                        <th scope="col" style={{ width: '10%' }}>Giảm giá</th>
                        <th scope="col" style={{ width: '20%' }}>Thuộc danh mục</th>
                        <th scope="col" style={{ width: '15%' }}>Tồn kho</th>
                        <th scope="col" style={{ width: '15%' }}>Đã bán</th>
                        <th scope="col" style={{ width: '10%' }}></th>
                        
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                            <td>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}</td>
                            <td>{product.type}</td>
                            <td>{product.inventory}</td>
                            <td>{product.sold}</td>
                            <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={ handleEditProduct}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    
                                </td>
                            <td>
                            
                                <button
                                    className="btn btn-sm btn-danger"
                                    //onClick={() => handleDeleteAccount(product)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                                
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            

            </div> 
    );
    if(Type== false) return(
        <ProductDetailForm
            isOpen={showModal}/>
    );
    else return(
        <AddProductForm
            isOpen={showModal}/>
    );
   
};

export default ProductTab;
