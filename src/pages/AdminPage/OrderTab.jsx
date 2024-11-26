import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import OrderDetails from './OrderDetailsTab';

const OrderTab = () => {
    const [activeTab, setActiveTab] = useState("all");
    const categories = [
        {
            id: 103,
            name: 'Nguyễn Văn A',
            description: '1/1/2023',
            productCount: '23000000đ ',
            static : 'Đã giao',
        },
        {
            id: 104,
            name: 'Nguyễn Văn A',
            description: '1/1/2024',
            productCount: '23000000đ ',
            static : 'Chờ xác nhận',
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
    const handleAddCategory = () => {
        setModalTitle('TRẠNG THÁI');
        setModalBody(
            <>
                <FormComponent
                    id="nameCatagoryInput"
                    label="Mã đơn"
                    type="text"
                    placeholder="Nhập mã đơn"
                />
                <FormComponent
                    id="descCatagoryInput"
                    label="Trạng thái"
                    type="text"
                    placeholder="Chọn trạng thái"
                />
            </>
        );
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Danh mục mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm danh mục!');
            setShowModal(false);
        });
        setShowModal(true);
        setType(true);
       
    };

    // Hàm mở modal sửa danh mục
    const handleEditCategory = (category) => {
        setModalTitle('CẬP NHẬT DANH MỤC');
        setModalBody(
            <>
                <FormComponent
                    id="nameCatagoryInput"
                    label="Tên danh mục"
                    type="text"
                    defaultValue={category.name}
                />
                <FormComponent
                    id="descCatagoryInput"
                    label="M"
                    type="text"
                    defaultValue={category.description}
                />
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`Danh mục "${category.name}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật danh mục!');
            setShowModal(false);
        });
        setShowModal(true);
        setType(false);
    };

    // Hàm mở modal xóa danh mục
    const handleDeleteCategory = (category) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa danh mục <strong>{category.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`Danh mục "${category.name}" đã được xóa!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
    };
    

     if (showModal == false)return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">DANH SÁCH ĐƠN HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    {/* Tabs */}
                    <div className="row mt-4" >
                        <div className="col-12">
                            <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                                        onClick={() => setActiveTab("all")}
                                    >
                                       Tất cả
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "delivering" ? "active" : ""}`}
                                        onClick={() => setActiveTab("delivering")}
                                    >
                                        Đang giao
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "complete" ? "active" : ""}`}
                                        onClick={() => setActiveTab("complete")}
                                    >
                                        Đã giao
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "cancel" ? "active" : ""}`}
                                        onClick={() => setActiveTab("cancel")}
                                    >
                                        Đã hủy
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
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

                    
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '15%' }}>Khách hàng</th>
                            <th scope="col" style={{ width: '20%' }}>Ngày đặt</th>
                            <th scope="col" style={{ width: '30%' }}>Tổng tiền</th>
                            <th scope="col" style={{ width: '15%' }}>Trạng thái</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>{category.productCount}</td>
                                <td>{category.static}</td>
                                <td>
                                <ButtonComponent
                            textButton="Duyệt"
                            
                            onClick={handleAddCategory}
                        />
                                    
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditCategory(category)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            

            </div> 
        </div>
    );
    if(Type== false) return(
        <OrderDetails
            isOpen={showModal}/>
    );
    if(Type== true) return(
        <ModalComponent
        isOpen={showModal}
                title={modalTitle}
                body={modalBody}
                textButton1={textButton1} 
                onClick1={onSave} 
                onClick2={onCancel} />
    );
   
};

export default OrderTab;
