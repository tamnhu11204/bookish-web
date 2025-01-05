
import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ProductDetailForm from './ProductEdit';
import AddProductForm from './ProductAdd';
import * as ProductService from "../../services/ProductService" ;
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as PublisherService from "../../services/OptionService/PublisherService";
import * as LanguageService from "../../services/OptionService/LanguageService"
import * as SupplierService from "../../services/OptionService/SupplierService"
import * as FormatService from "../../services/OptionService/FormatService"
import * as UnitService from "../../services/OptionService/UnitService"
import * as CategoryService from "../../services/CategoryService"
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";


const ProductTab = () => {
    const [activeTab, setActiveTab] = useState("all");
    const[productID,setProductID] = useState("");
    
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

    const getAllProduct = async () => {
            const res = await ProductService.getAllProduct();
            return res.data;
        };
    
        const { isLoading: isLoadingProduct, data: products } = useQuery({
            queryKey: ['products'],
            queryFn: getAllProduct,
        });

    // Hàm mở modal thêm danh mục
    const handleAddProduct = () => {
        
        setShowModal(true);
        setType(true);
       
    };

    const onCancel2 = () => {
        
        setShowModal(false);
       
    };


    // Hàm mở modal sửa danh mục
    const handleEditProduct = (product) => {
        
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
        setType(false);
        setProductID(product._id);
    };

    //Xóa sản phẩm 
    const [selectedProduct, setSelectedProduct] = useState("");
    const deleteMutation = useMutationHook(data => ProductService.deleteProduct(selectedProduct._id));
    const { isSuccess: isSuccessDelete, isError: isErrorDelete } = deleteMutation;

     useEffect(() => {
            
            if (isSuccessDelete ) {
                message.success();
                alert('Xóa sản phẩm thành công!');
                setShowModal(false);
            }
            if ( isErrorDelete) {
                message.error();
            }
        }, [ isSuccessDelete, isErrorDelete]);

        const handleDeleteProduct = (product) => {
            if (window.confirm(`Bạn có chắc chắn muốn xóa ngôn ngữ "${product.name}" không?`)) {
                setSelectedProduct(product);
                deleteMutation.mutate(product.id);
            }
        };
    

     if (showModal === false)return (
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
                    {isLoadingProduct ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : products && products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product._id}</td>
                            <td>
                                <img
                                    src={product.img[0]}
                                    alt={product.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}</td>
                            <td>{product.category}</td>
                            <td>{product.stock}</td>
                            <td>{product.sold}</td>
                            <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() =>handleEditProduct(product)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    
                                </td>
                            <td>
                            
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteProduct(product)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                                
                            </td>
                            </tr>
                        ))): (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
            

            </div> 
    );
    if(Type=== false) return(
        <ProductDetailForm
            isOpen={showModal}
            IDProduct={productID}
            onCancel={onCancel2}/>
    );
    else return(
        <AddProductForm
            isOpen={showModal}
            onCancel= {onCancel2}/>
    );
   
};

export default ProductTab;
