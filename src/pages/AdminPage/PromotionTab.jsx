import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';

const PromotionTab = () => {

    const [activeTab, setActiveTab] = useState("sale");
    const promotions = [
        {
            id: 103,
            value: '100.000đ',
            startAt: '01/01/2023',
            endAt: '01/02/2023',
            applyFor: '20.000đ',
            quantity: 10,
            used: 5
        },
        {
            id: 104,
            value: '100.000đ',
            startAt: '01/01/2023',
            endAt: '01/02/2023',
            applyFor: '20.000đ',
            quantity: 10,
            used: 5
        },
    ];

    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState('');
    const [onSave, setOnSave] = useState(() => () => { });
    const [onCancel, setOnCancel] = useState(() => () => { });

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Hàm mở modal thêm ưu đãi
    const [selectedOption, setSelectedOption] = useState('default');
    const handleAddPromotion = () => {
        setModalTitle('THÊM ƯU ĐÃI');
        setModalBody(
            <>
                <p style={{ fontSize: '16px' }}>Chọn loại ưu đãi</p>
                <div className="row">
                    <div className="col-6">
                        <div className="form-check ">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="saleOption"
                                id="defaultAddress"
                                checked={selectedOption === 'default'}
                                onChange={() => setSelectedOption('default')}
                            />
                            <label className="form-check-label" htmlFor="defaultAddress">
                                Mã giảm giá
                            </label>
                        </div>


                    </div>

                    <div className="col-6">
                        <div className="form-check ">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="freeShipOption"
                                id="otherAddress"
                                checked={selectedOption === 'other'}
                                onChange={() => setSelectedOption('other')}
                            />
                            <label className="form-check-label" htmlFor="otherAddress">
                                Miễn phí vận chuyển
                            </label>
                        </div>
                    </div>
                </div>

                <FormComponent
                    id="valueInput"
                    label="Mô tả"
                    type="number"
                    placeholder="Nhập giá trị"
                />

                <FormComponent
                    id="startAtInput"
                    label="Ngày bắt đầu"
                    type="date"
                    placeholder="Chọn ngày bắt đầu"
                />

                <FormComponent
                    id="endAtInput"
                    label="Ngày kết thúc"
                    type="date"
                    placeholder="Chọn ngày kết thúc"
                />

                <FormComponent
                    id="applyForInput"
                    label="Áp dụng cho"
                    type="number"
                    placeholder="Nhập giá trị đơn hàng tối thiểu có thể áp dụng mã"
                />

                <FormComponent
                    id="quantityInput"
                    label="Số lượng"
                    type="number"
                    placeholder="Nhập số lượng"
                />
            </>
        );
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Ưu đãi mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm ưu đãi!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa ưu đãi
    const handleEditPromotion = (promotion) => {
        setModalTitle('CẬP NHẬT ƯU ĐÃI');
        setModalBody(
            <>
                <p style={{ fontSize: '16px' }}>Chọn loại ưu đãi</p>
                <div className="row">
                    <div className="col-6">
                        <div className="form-check ">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="saleOption"
                                id="defaultAddress"
                                checked={selectedOption === 'default'}
                                onChange={() => setSelectedOption('default')}
                            />
                            <label className="form-check-label" htmlFor="defaultAddress">
                                Mã giảm giá
                            </label>
                        </div>


                    </div>

                    <div className="col-6">
                        <div className="form-check ">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="freeShipOption"
                                id="otherAddress"
                                checked={selectedOption === 'other'}
                                onChange={() => setSelectedOption('other')}
                            />
                            <label className="form-check-label" htmlFor="otherAddress">
                                Miễn phí vận chuyển
                            </label>
                        </div>
                    </div>
                </div>

                <FormComponent
                    id="valueInput"
                    label="Mô tả"
                    type="number"
                    defaultValue={promotion.value}
                />

                <FormComponent
                    id="startAtInput"
                    label="Ngày bắt đầu"
                    type="date"
                    defaultValue={promotion.startAt}
                />

                <FormComponent
                    id="endAtInput"
                    label="Ngày kết thúc"
                    type="date"
                    defaultValue={promotion.endAt}
                />

                <FormComponent
                    id="applyForInput"
                    label="Áp dụng cho"
                    type="number"
                    defaultValue={promotion.applyFor}
                />

                <FormComponent
                    id="quantityInput"
                    label="Số lượng"
                    type="number"
                    defaultValue={promotion.quantity}
                />

                <FormComponent
                    id="usedInput"
                    label="Đã sử dụng"
                    type="number"
                    defaultValue={promotion.used}
                />
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`ưu đãi "${promotion.id}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật ưu đãi!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa ưu đãi
    const handleDeletePromotion = (promotion) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{ fontSize: '16px' }}>Bạn có chắc chắn muốn xóa ưu đãi <strong>{promotion.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); 
        setOnSave(() => () => {
            alert(`ưu đãi "${promotion.id}" đã được xóa!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
    };

    //Nội dung ở tab mã giảm giá
    const saleContent = (
        <>
            <div className="col-6">
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên ưu đãi"
                />
            </div>

            <table className="table custom-table" >
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={{ width: '10%' }}>Mã</th>
                        <th scope="col" style={{ width: '10%' }}>Giá trị</th>
                        <th scope="col" style={{ width: '15%' }}>Ngày bắt đầu</th>
                        <th scope="col" style={{ width: '15%' }}>Ngày kết thúc</th>
                        <th scope="col" style={{ width: '20%' }}>Áp dụng cho</th>
                        <th scope="col" style={{ width: '10%' }}>Số lượng</th>
                        <th scope="col" style={{ width: '10%' }}>Đã sử dụng</th>
                        <th scope="col" style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody className="table-content">
                    {promotions.map((promotion) => (
                        <tr key={promotion.id}>
                            <td>{promotion.id}</td>
                            <td>{promotion.value}</td>
                            <td>{promotion.startAt}</td>
                            <td>{promotion.endAt}</td>
                            <td>Đơn hàng tối thiểu {promotion.applyFor}</td>
                            <td>{promotion.quantity}</td>
                            <td>{promotion.used}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEditPromotion(promotion)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeletePromotion(promotion)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )

    //Nội dung ở tab miễn phí vận chuyển
    const freeShipContent = (
        <>
            <div className="col-6">
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên ưu đãi"
                />
            </div>

            <table className="table custom-table" >
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={{ width: '10%' }}>Mã</th>
                        <th scope="col" style={{ width: '10%' }}>Giá trị</th>
                        <th scope="col" style={{ width: '15%' }}>Ngày bắt đầu</th>
                        <th scope="col" style={{ width: '15%' }}>Ngày kết thúc</th>
                        <th scope="col" style={{ width: '20%' }}>Áp dụng cho</th>
                        <th scope="col" style={{ width: '10%' }}>Số lượng</th>
                        <th scope="col" style={{ width: '10%' }}>Đã sử dụng</th>
                        <th scope="col" style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody className="table-content">
                    {promotions.map((promotion) => (
                        <tr key={promotion.id}>
                            <td>{promotion.id}</td>
                            <td>{promotion.value}</td>
                            <td>{promotion.startAt}</td>
                            <td>{promotion.endAt}</td>
                            <td>Đơn hàng tối thiểu {promotion.applyFor}</td>
                            <td>{promotion.quantity}</td>
                            <td>{promotion.used}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEditPromotion(promotion)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeletePromotion(promotion)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )

    //
    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">ƯU ĐÃI</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col d-flex justify-content-end">
                        <ButtonComponent
                            textButton="Thêm ưu đãi"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddPromotion}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="row mt-4" >
                        <div className="col-12">
                            <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "sale" ? "active" : ""}`}
                                        onClick={() => setActiveTab("sale")}
                                    >
                                        Mã giảm giá
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "freeShip" ? "active" : ""}`}
                                        onClick={() => setActiveTab("freeShip")}
                                    >
                                        Miễn phí vận chuyển
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nội dung Tab */}
                <div className="tab-content" style={{ flexGrow: 1 }}>
                    <div className="tab-pane fade show active">
                        {activeTab === "sale" && <div>{saleContent}</div>}
                        {activeTab === "freeShip" && <div>{freeShipContent}</div>}
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={showModal}
                title={modalTitle}
                body={modalBody}
                textButton1={textButton1}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default PromotionTab;
