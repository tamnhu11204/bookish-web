import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as PromotionService from '../../services/PromotionService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { Button, Popover } from 'antd';

const PromotionTab = () => {

    // Lấy danh sách ưu đãi từ API
    const getAllPromotion = async () => {
        const res = await PromotionService.getAllPromotion();
        console.log('data', res)
        return res.data;
    };

    const { isLoading: isLoadingPromotion, data: promotions } = useQuery({
        queryKey: ['promotions'],
        queryFn: getAllPromotion,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('value'); 

    // Hàm thay đổi giá trị input tìm kiếm
    const handleInputChange = (value) => {
        setSearchTerm(value);
    };

    // Hàm để tìm kiếm theo giá trị, ngày bắt đầu, ngày kết thúc
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredPromotions(promotions);
        } else {
            const filteredPromotions = promotions.filter((promotion) => {
                const searchTermNumber = Number(searchTerm);
    
                if (searchType === 'value' && !isNaN(searchTermNumber) && promotion.value === searchTermNumber) {
                    return true;
                }
    
                if (searchType === 'start' && formatDate(promotion.start).includes(searchTerm)) {
                    return true;
                }

                if (searchType === 'finish' && formatDate(promotion.finish).includes(searchTerm)) {
                    return true;
                }
    
                return false; 
            });
    
            setFilteredPromotions(filteredPromotions);
        }
    }, [searchTerm, searchType, promotions]); 
    
    
    

    // Render content tìm kiếm
    const popoverContent = (
        <div>
            <Button onClick={() => setSearchType('value')}>Tìm theo giá trị</Button>
            <Button onClick={() => setSearchType('start')}>Tìm theo ngày bắt đầu</Button>
            <Button onClick={() => setSearchType('finish')}>Tìm theo ngày kết thúc</Button>
        </div>
    );

    // State lưu trữ các ưu đãi đã lọc
    const [filteredPromotions, setFilteredPromotions] = useState(promotions);

    useEffect(() => {
        setFilteredPromotions(promotions);
    }, [promotions]);

    ////////////////----------Thêm-------------///////////////////

    // State cho form và modal
    const [value, setValue] = useState('');
    const [start, setStart] = useState('');
    const [finish, setFinish] = useState('');
    const [quantity, setQuantity] = useState('');
    const [condition, setCondition] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Hàm reset form
    const resetForm = () => {
        setValue('');
        setStart('');
        setFinish('');
        setQuantity('');
        setCondition('');
        setErrorMessage('');

    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    };


    const validateForm = () => {
        if (!value || !start || !finish || !quantity || !condition) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage(""); // Xóa lỗi khi dữ liệu hợp lệ
        return true;
    };

    // Mutation để thêm ưu đãi
    const mutation = useMutationHook(data => PromotionService.addPromotion(data));
    const { data, isSuccess, isError } = mutation;

    // Thêm ưu đãi
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            alert('Thêm ưu đãi mới thành công!');
            resetForm();
            setShowModal(false);
        }
        if (isError && data?.status === 'ERR') {
            message.error();

        }
    }, [isSuccess, isError, data]);


    const handleAddPromotion = () => setShowModal(true);
    const handleOnChangeValue = (value) => setValue(value);
    const handleOnChangeStart = (value) => setStart(value);
    const handleOnChangeFinish = (value) => setFinish(value);
    const handleOnChangeCondition = (value) => setCondition(value);
    const handleOnChangeQuantity = (value) => setQuantity(value);

    const onSave = async () => {
        if (validateForm()) {
            await mutation.mutateAsync({ value, start, finish, quantity, condition });
        }
    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    ////////////////----------Sửa-------------///////////////////

    const [selectedPromotion, setSelectedPromotion] = useState('');
    const [valueEdit, setValueEdit] = useState('');
    const [startEdit, setStartEdit] = useState('');
    const [finishEdit, setFinishEdit] = useState('');
    const [quantityEdit, setQuantityEdit] = useState('');
    const [conditionEdit, setConditionEdit] = useState('');
    const [errorMessageEdit, setErrorMessageEdit] = useState('');
    const [editModal, setShowModalEdit] = useState(false);

    const validateFormEdit = () => {
        if (!value || !start || !finish || !quantity || !condition) {
            setErrorMessageEdit("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const handleEditPromotion = (promotion) => {
        setShowModalEdit(true);
        setSelectedPromotion(promotion);
        const startDate = new Date(promotion.start).toISOString().split('T')[0];  // Lấy phần ngày của ISO string
        const finishDate = new Date(promotion.finish).toISOString().split('T')[0];

        setValueEdit(promotion.value);
        setStartEdit(startDate);  
        setFinishEdit(finishDate); 
        setQuantityEdit(promotion.quantity);
        setConditionEdit(promotion.condition);
    };



    const handleOnChangeValueEdit = (value) => setValueEdit(value);
    const handleOnChangeStartEdit = (value) => setStartEdit(value);
    const handleOnChangeFinishEdit = (value) => setFinishEdit(value);
    const handleOnChangeQuantityEdit = (value) => setQuantityEdit(value);
    const handleOnChangeConditionEdit = (value) => setConditionEdit(value);

    const onSaveEdit = async () => {
        const updatedPromotion = {
            value: setValueEdit,
            start: setStartEdit,
            finish: setFinishEdit,
            condition: setQuantityEdit,
            quantity: setConditionEdit,
        };
        if (validateFormEdit()) {
            try {
                const response = await PromotionService.updatePromotion(selectedPromotion._id, updatedPromotion);
                if (response.status === 'OK') {
                    alert("Cập nhật ưu đãi thành công!");
                    setShowModalEdit(false);
                } else {
                    alert("Lỗi khi cập nhật ưu đãi.");
                }
            } catch (error) {
                console.error("Error updating promotion: ", error.response ? error.response.data : error);
                alert("Đã xảy ra lỗi khi cập nhật ưu đãi.");
            }
        }
    };

    const onCancelEdit = () => {
        alert("Hủy thao tác!");
        setShowModalEdit(false);
    };

    //////////------------xóa-----------------////////////

    const handleDeletePromotion = async (promotionId) => {
        try {
            // eslint-disable-next-line no-restricted-globals
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa ưu đãi này?");
            if (isConfirmed) {
                await PromotionService.deletePromotion(promotionId);
                alert("Xóa ưu đãi thành công!");
            }
        } catch (error) {
            console.error("Error deleting Promotion: ", error);
            alert("Đã xảy ra lỗi khi xóa ưu đãi.");
        }
    };

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
                </div>
            </div>
            <>
                <div className="col-6" style={{ marginBottom: '20px' }}>
                    <FormComponent
                        id="searchInput"
                        type="text"
                        placeholder={`Nhập ${searchType}...`}
                        value={searchTerm}
                        onChange={handleInputChange}
                    />

                    {/* Popover filter */}
                    <Popover
                        content={popoverContent}
                        title="Chọn trường để tìm"
                        trigger="click"
                        placement="bottomLeft"
                    >
                        <Button className="btn btn-first">
                            <i style={{ fontSize: '20px' }} className="bi bi-filter"></i>
                        </Button>
                    </Popover>
                </div>

                <table className="table custom-table">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '20%' }}>Mã</th>
                            <th scope="col" style={{ width: '10%' }}>Giá trị</th>
                            <th scope="col" style={{ width: '10%' }}>Ngày bắt đầu</th>
                            <th scope="col" style={{ width: '10%' }}>Ngày kết thúc</th>
                            <th scope="col" style={{ width: '15%' }}>Áp dụng cho</th>
                            <th scope="col" style={{ width: '10%' }}>Số lượng</th>
                            <th scope="col" style={{ width: '10%' }}>Đã sử dụng</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingPromotion ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredPromotions && filteredPromotions.length > 0 ? (
                            filteredPromotions.map((promotion) => (
                                <tr key={promotion._id}>
                                    <td>{promotion._id}</td>
                                    <td>{promotion.value}</td>
                                    <td>{formatDate(promotion.start)}</td>
                                    <td>{formatDate(promotion.finish)}</td>
                                    <td>Đơn hàng tối thiểu {promotion.condition}</td>
                                    <td>{promotion.quantity}</td>
                                    <td>{promotion.used}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditPromotion(promotion)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger"
                                            onClick={() => handleDeletePromotion(promotion._id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>


            {/* Modal thêm đơn vị */}
            <ModalComponent
                isOpen={showModal}
                title="CẬP NHẬT ĐƠN VỊ"
                body={
                    <>
                        <FormComponent
                            id="valueInput"
                            label="Giá trị"
                            type="number"
                            placeholder="Nhập giá trị (VND)"
                            value={value}
                            onChange={handleOnChangeValue}
                            required={true}
                        />

                        <FormComponent
                            id="startAtInput"
                            label="Ngày bắt đầu"
                            type="date"
                            placeholder="Nhập ngày bắt đầu"
                            value={start}
                            onChange={handleOnChangeStart}
                            required={true}
                        />

                        <FormComponent
                            id="endAtInput"
                            label="Ngày kết thúc"
                            type="date"
                            placeholder="Nhập ngày kết thúc"
                            value={finish}
                            onChange={handleOnChangeFinish}
                            required={true}
                        />

                        <FormComponent
                            id="applyForInput"
                            label="Áp dụng cho đơn hàng tối thiểu"
                            type="number"
                            placeholder="Nhập giá trị đơn hàng tối thiểu (VND)"
                            value={condition}
                            onChange={handleOnChangeCondition}
                            required={true}
                        />

                        <FormComponent
                            id="quantityInput"
                            label="Số lượng"
                            type="number"
                            placeholder="Nhập số lượng"
                            value={quantity}
                            onChange={handleOnChangeQuantity}
                            required={true}
                        />

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                            {errorMessage && (
                                <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                    {errorMessage}
                                </div>
                            )}
                            {data?.status === 'ERR' &&
                                <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
                        </div>

                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
            />

            {/* Modal chỉnh sửa ưu đãi */}
            <ModalComponent
                isOpen={editModal}
                title="THÊM ĐƠN VỊ"
                body={
                    <>
                        <FormComponent
                            id="valueInput"
                            label="Giá trị"
                            type="number"
                            placeholder="Nhập giá trị (VND)"
                            value={valueEdit}
                            onChange={handleOnChangeValueEdit}
                            required={true}
                        />

                        <FormComponent
                            id="startAtInput"
                            label="Ngày bắt đầu"
                            type="date"
                            placeholder="Nhập ngày bắt đầu"
                            value={startEdit}
                            onChange={handleOnChangeStartEdit}
                            required={true}
                        />

                        <FormComponent
                            id="endAtInput"
                            label="Ngày kết thúc"
                            type="date"
                            placeholder="Nhập ngày kết thúc"
                            value={finishEdit}
                            onChange={handleOnChangeFinishEdit}
                            required={true}
                        />

                        <FormComponent
                            id="applyForInput"
                            label="Áp dụng cho đơn hàng tối thiểu"
                            type="number"
                            placeholder="Nhập giá trị đơn hàng tối thiểu (VND)"
                            value={conditionEdit}
                            onChange={handleOnChangeConditionEdit}
                            required={true}
                        />

                        <FormComponent
                            id="quantityInput"
                            label="Số lượng"
                            type="number"
                            placeholder="Nhập số lượng"
                            value={quantityEdit}
                            onChange={handleOnChangeQuantityEdit}
                            required={true}
                        />

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                            {errorMessageEdit && (
                                <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                    {errorMessageEdit}
                                </div>
                            )}
                            {data?.status === 'ERR' &&
                                <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
                        </div>

                    </>
                }
                textButton1="Thêm"
                onClick1={onSaveEdit}
                onClick2={onCancelEdit}
            />
        </div>
    );
};

export default PromotionTab;
