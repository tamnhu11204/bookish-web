import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';

const CatagoryTab = () => {
    const categories = [
        {
            id: 103,
            image: 'https://via.placeholder.com/50',
            name: 'Văn học',
            description: 'Mô tả văn học',
            productCount: 10,
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name: 'Văn học Việt Nam',
            description: 'Mô tả văn học Việt Nam',
            productCount: 1,
        },
    ];

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [modalAction, setModalAction] = useState(() => {}); // Function to execute on Save

    // Mở modal cho chức năng Thêm
    const handleAddCategory = () => {
        setModalTitle('Thêm danh mục');
        setModalBody(
            <form>
                <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                        Tên danh mục
                    </label>
                    <input type="text" className="form-control" id="categoryName" />
                </div>
                <div className="mb-3">
                    <label htmlFor="categoryDescription" className="form-label">
                        Mô tả
                    </label>
                    <textarea className="form-control" id="categoryDescription" rows="3" />
                </div>
            </form>
        );
        setModalAction(() => () => {
            alert('Danh mục mới đã được thêm!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Mở modal cho chức năng Sửa
    const handleEditCategory = (category) => {
        setModalTitle('Sửa danh mục');
        setModalBody(
            <form>
                <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                        Tên danh mục
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="categoryName"
                        defaultValue={category.name}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="categoryDescription" className="form-label">
                        Mô tả
                    </label>
                    <textarea
                        className="form-control"
                        id="categoryDescription"
                        rows="3"
                        defaultValue={category.description}
                    />
                </div>
            </form>
        );
        setModalAction(() => () => {
            alert(`Danh mục ${category.name} đã được sửa!`);
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Mở modal cho chức năng Xóa
    const handleDeleteCategory = (category) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p>
                Bạn có chắc chắn muốn xóa danh mục <strong>{category.name}</strong> không?
            </p>
        );
        setModalAction(() => () => {
            alert(`Danh mục ${category.name} đã được xóa!`);
            setShowModal(false);
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">DANH MỤC SẢN PHẨM</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên danh mục"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm danh mục"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddCategory} // Thêm danh mục
                        />
                    </div>
                </div>

                <table className="table custom-table">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '15%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên danh mục</th>
                            <th scope="col" style={{ width: '30%' }}>Mô tả</th>
                            <th scope="col" style={{ width: '15%' }}>Số sản phẩm</th>
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
                                        onClick={() => handleEditCategory(category)} // Sửa danh mục
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteCategory(category)} // Xóa danh mục
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sử dụng Modal Component */}
            <ModalComponent
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={modalAction}
                title={modalTitle}
                body={modalBody}
            />
        </div>
    );
};

export default CatagoryTab;
