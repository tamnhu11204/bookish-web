import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ImportDetails from './ImportDetailTab';
import AddImport from './AddImportTab';

const ImportTab = () => {
    const categories = [
        {
            id: 103,
            image: 'https://via.placeholder.com/50',
            name: 'An Nam',
            description: '1/1/2023',
            productCount: '23000000đ ',
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name: 'Fahasa',
            description: '2/1/2023',
            productCount: '1000000đ',
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
        setModalTitle('THÊM DANH MỤC');
        setModalBody(
            <>
                <FormComponent
                    id="nameCatagoryInput"
                    label="Tên danh mục"
                    type="text"
                    placeholder="Nhập tên danh mục"
                />
                <FormComponent
                    id="descCatagoryInput"
                    label="Mô tả"
                    type="text"
                    placeholder="Nhập mô tả"
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
                    label="Mô tả"
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
                <h3 className="text mb-0">LỊCH SỬ NHẬP HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo thời gian nhập hàng"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Nhập hàng"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddCategory}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '15%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Nhà cung cấp</th>
                            <th scope="col" style={{ width: '30%' }}>Ngày nhập hàng</th>
                            <th scope="col" style={{ width: '15%' }}>Tổng số tiền</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>{category.productCount}</td>
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
    );
    if(Type== false) return(
        <ImportDetails
            isOpen={showModal}/>
    );
    if(Type== true) return(
        <AddImport
        isOpen={showModal}
        type={Type}/>
    );
   
};

export default ImportTab;
