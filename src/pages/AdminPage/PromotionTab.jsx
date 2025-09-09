import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as PromotionService from '../../services/PromotionService';
import * as message from '../../components/MessageComponent/MessageComponent';
import { useMutationHook } from '../../hooks/useMutationHook';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { Button, Popover } from 'antd';

const PromotionTab = () => {
    const queryClient = useQueryClient();

    // Lấy danh sách ưu đãi từ API
    const getAllPromotion = async () => {
        const res = await PromotionService.getAllPromotion();
        console.log('data', res);
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

    // Hàm format ngày cho tìm kiếm và hiển thị
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Hàm tìm kiếm theo giá trị, ngày bắt đầu, ngày kết thúc
    useEffect(() => {
        if (!promotions) return;
        if (searchTerm === '') {
            setFilteredPromotions(promotions);
        } else {
            const filteredPromotions = promotions.filter((promotion) => {
                const searchTermLower = searchTerm.toLowerCase();
                const searchTermNumber = Number(searchTerm);

                if (searchType === 'value' && !isNaN(searchTermNumber) && promotion.value === searchTermNumber) {
                    return true;
                }

                if (searchType === 'start' && formatDate(promotion.start).toLowerCase().includes(searchTermLower)) {
                    return true;
                }

                if (searchType === 'finish' && formatDate(promotion.finish).toLowerCase().includes(searchTermLower)) {
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
            <button>Thêm giá trị</button>
            <button onClick={() => setSearchType('value')}>Thêm giá trị</button>
            <button onClick={() => setSearchType('start')}>Tìm ngày bắt đầu</button>
            <button onClick={() => setSearchType('finish')}>Thêm giá trị</button>
        </div>
    );

    // State lưu trữ các ưu đãi đã lọc
    const [filteredPromotions, setFilteredPromotions] = useState([]);

    useEffect(() => {
        setFilteredPromotions(promotions);
    }, [promotions]);

    //////////////// Thêm //////////////
    // State cho form và modal
    const [value, setValue] = useState('');
    const [start, setStart] = useState('');
    const [finish, setFinish] = useState('');
    const [quantity, setQuantity] = useState('');
    const [condition, setCondition] = useState('');
    const [showModal, setShowModal] = useState('');
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

    const validateForm = () => {
        if (!value || !start || !finish || !quantity || !condition) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            return false;
        }
        if (Number(value) <= 0 || Number(quantity) <= 0 || Number(condition) <= 0) {
            setErrorMessage('Giá trị, số lượng và điều kiện phải là số dương!');
            return false;
        }
        const startDate = new Date(start);
        const finishDate = new Date(finish);
        const now = new Date();
        if (startDate >= finishDate) {
            setErrorMessage('Ngày bắt đầu phải trước ngày kết thúc!');
            return false;
        }
        if (startDate < now.setHours(0, 0, 0, 0)) {
            setErrorMessage('Ngày bắt đầu không được là ngày trong quá khứ!');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    // Mutation để thêm ưu đãi
    const mutation = useMutationHook((data) => PromotionService.addPromotion(data));

    // Thêm ưu đãi
    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.status === 'OK') {
            message.success('Thêm ưu đãi thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['promotions']);
        }
        if (mutation.isError || mutation.data?.status === 'ERR') {
            message.error(mutation.data?.message || 'Lỗi khi thêm ưu đãi.');
        }
    }, [mutation.isSuccess, mutation.isError, mutation.data, queryClient]);

    const handleAddPromotion = () => setShowModal(true);
    const handleOnChangeValue = (value) => setValue(value);
    const handleOnChangeStart = (value) => setStart(value);
    const handleOnChangeFinish = (value) => setFinish(value);
    const handleOnChangeCondition = (value) => setCondition(value);
    const handleOnChangeQuantity = (value) => setQuantity(value);

    const onSave = async () => {
        if (validateForm()) {
            try {
                await mutation.mutateAsync({
                    value: Number(value),
                    start,
                    finish,
                    quantity: Number(quantity),
                    condition: Number(condition),
                });
            } catch (error) {
                message.error('Lỗi khi thêm ưu đãi.');
            }
        }
    };

    const onCancel = () => {
        message.success('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    ////////////////----------Sửa-------------///////////////////

    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [valueEdit, setValueEdit] = useState('');
    const [startEdit, setStartEdit] = useState('');
    const [finishEdit, setFinishEdit] = useState('');
    const [quantityEdit, setQuantityEdit] = useState('');
    const [conditionEdit, setConditionEdit] = useState('');
    const [errorMessageEdit, setErrorMessageEdit] = useState('');
    const [editModal, setShowModalEdit] = useState(false);

    const validateFormEdit = () => {
        if (!valueEdit || !startEdit || !finishEdit || !quantityEdit || !conditionEdit) {
            setErrorMessageEdit('Vui lòng nhập đầy đủ thông tin!');
            return false;
        }
        if (Number(valueEdit) <= 0 || Number(quantityEdit) <= 0 || Number(conditionEdit) <= 0) {
            setErrorMessageEdit('Giá trị, số lượng và điều kiện phải là số dương!');
            return false;
        }
        const startDate = new Date(startEdit);
        const finishDate = new Date(finishEdit);
        const now = new Date();
        if (startDate >= finishDate) {
            setErrorMessageEdit('Ngày bắt đầu phải trước ngày kết thúc!');
            return false;
        }
        if (startDate < now.setHours(0, 0, 0, 0)) {
            setErrorMessageEdit('Ngày bắt đầu không được là ngày trong quá khứ!');
            return false;
        }
        setErrorMessageEdit('');
        return true;
    };

    const handleEditPromotion = (promotion) => {
        setShowModalEdit(true);
        setSelectedPromotion(promotion);
        const startDate = new Date(promotion.start).toISOString().split('T')[0];
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

    // Mutation để cập nhật ưu đãi
    const mutationUpdate = useMutationHook((data) => PromotionService.updatePromotion(data.id, data.payload));

    useEffect(() => {
        if (mutationUpdate.isSuccess && mutationUpdate.data?.status === 'OK') {
            message.success('Cập nhật ưu đãi thành công!');
            setShowModalEdit(false);
            queryClient.invalidateQueries(['promotions']);
        }
        if (mutationUpdate.isError || mutationUpdate.data?.status === 'ERR') {
            message.error(mutationUpdate.data?.message || 'Lỗi khi cập nhật ưu đãi.');
        }
    }, [mutationUpdate.isSuccess, mutationUpdate.isError, mutationUpdate.data, queryClient]);

    const onSaveEdit = async () => {
        if (validateFormEdit()) {
            try {
                const payload = {
                    value: Number(valueEdit),
                    start: startEdit,
                    finish: finishEdit,
                    condition: Number(conditionEdit),
                    quantity: Number(quantityEdit),
                };
                await mutationUpdate.mutateAsync({ id: selectedPromotion._id, payload });
            } catch (error) {
                message.error('Lỗi khi cập nhật ưu đãi.');
            }
        }
    };

    const onCancelEdit = () => {
        message.success('Hủy thao tác!');
        setShowModalEdit(false);
    };

    //////////------------Xóa-----------------////////////

    const handleDeletePromotion = async (promotionId) => {
        try {
            const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa ưu đãi này?');
            if (isConfirmed) {
                await PromotionService.deletePromotion(promotionId);
                message.success('Xóa ưu đãi thành công!');
                queryClient.invalidateQueries(['promotions']);
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            message.error('Đã xảy ra lỗi khi xóa ưu đãi.');
        }
    };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">QUẢN LÝ ƯU ĐÃI</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col d-flex justify-content-start">
                        <ButtonComponent
                            textButton="Thêm ưu đãi"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddPromotion}
                        />
                    </div>
                </div>
            </div>

            <div className="col-6" style={{ marginBottom: '16px' }}>
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder={`Nhập ${searchType === 'value' ? 'giá trị' : searchType === 'start' ? 'ngày bắt đầu (dd/mm/yyyy)' : 'ngày kết thúc (dd/mm/yyyy)'}`}
                    value={searchTerm}
                    onChange={handleInputChange}
                    enable={true}
                />

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
                                <td>{promotion.value.toLocaleString()}</td>
                                <td>{formatDate(promotion.start)}</td>
                                <td>{formatDate(promotion.finish)}</td>
                                <td>Đơn hàng tối thiểu {promotion.condition.toLocaleString()}</td>
                                <td>{promotion.quantity}</td>
                                <td>{promotion.used}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditPromotion(promotion)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeletePromotion(promotion._id)}>
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

            {/* Modal thêm ưu đãi */}
            <ModalComponent
                isOpen={showModal}
                title="THÊM ƯU ĐÃI"
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
                            enable={true}
                        />
                        <FormComponent
                            id="startAtInput"
                            label="Ngày bắt đầu"
                            type="date"
                            placeholder="Nhập ngày bắt đầu"
                            value={start}
                            onChange={handleOnChangeStart}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="endAtInput"
                            label="Ngày kết thúc"
                            type="date"
                            placeholder="Nhập ngày kết thúc"
                            value={finish}
                            onChange={handleOnChangeFinish}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="applyForInput"
                            label="Áp dụng cho đơn hàng tối thiểu"
                            type="number"
                            placeholder="Nhập giá trị đơn hàng tối thiểu (VND)"
                            value={condition}
                            onChange={handleOnChangeCondition}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="quantityInput"
                            label="Số lượng"
                            type="number"
                            placeholder="Nhập số lượng"
                            value={quantity}
                            onChange={handleOnChangeQuantity}
                            required={true}
                            enable={true}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            {errorMessage && (
                                <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px', fontSize: '16px' }}>
                                    {errorMessage}
                                </div>
                            )}
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
                title="CẬP NHẬT ƯU ĐÃI"
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
                            enable={true}
                        />
                        <FormComponent
                            id="startAtInput"
                            label="Ngày bắt đầu"
                            type="date"
                            placeholder="Nhập ngày bắt đầu"
                            value={startEdit}
                            onChange={handleOnChangeStartEdit}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="endAtInput"
                            label="Ngày kết thúc"
                            type="date"
                            placeholder="Nhập ngày kết thúc"
                            value={finishEdit}
                            onChange={handleOnChangeFinishEdit}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="applyForInput"
                            label="Áp dụng cho đơn hàng tối thiểu"
                            type="number"
                            placeholder="Nhập giá trị đơn hàng tối thiểu (VND)"
                            value={conditionEdit}
                            onChange={handleOnChangeConditionEdit}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="quantityInput"
                            label="Số lượng"
                            type="number"
                            placeholder="Nhập số lượng"
                            value={quantityEdit}
                            onChange={handleOnChangeQuantityEdit}
                            required={true}
                            enable={true}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            {errorMessageEdit && (
                                <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px', fontSize: '16px' }}>
                                    {errorMessageEdit}
                                </div>
                            )}
                        </div>
                    </>
                }
                textButton1="Lưu"
                onClick1={onSaveEdit}
                onClick2={onCancelEdit}
            />
        </div>
    );
};

export default PromotionTab;