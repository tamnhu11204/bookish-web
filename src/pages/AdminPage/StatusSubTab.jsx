import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ActiveService from '../../services/OptionService/ActiveService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const StatusSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const queryClient = useQueryClient(); // Get query client for manual cache updates

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStatuses, setFilteredStatuses] = useState([]);

    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const resetForm = () => {
        setName('');
        setNote('');
    };

    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage(""); // Clear error if valid
        return true;
    };

    const addMutation = useMutationHook(data => ActiveService.addActive(data));
    const updateMutation = useMutationHook(data => ActiveService.updateActive(selectedStatus._id, data));
    const deleteMutation = useMutationHook(data => ActiveService.deleteActive(selectedStatus._id));

    const getAllStatus = async () => {
        const res = await ActiveService.getAllActive();
        return res.data;
    };

    const { isLoading: isLoadingStatus, data: statuses } = useQuery({
        queryKey: ['statuses'],
        queryFn: getAllStatus,
    });

    const { data, isSuccess, isError } = addMutation;
    const { isSuccess: isSuccessUpdate, isError: isErrorUpdate } = updateMutation;
    const { isSuccess: isSuccessDelete, isError: isErrorDelete } = deleteMutation;

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            alert('Thêm trạng thái đơn hàng mới thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['statuses']); // Invalidate the cache to refetch Statuss
        }

        if (isError || isErrorUpdate || isErrorDelete) {
            message.error();
        }
    }, [isSuccess, isError, data?.status, queryClient, isErrorUpdate, isErrorDelete]);

    useEffect(() => {
        if (isSuccessDelete) {
            message.success();
            alert('Xóa trạng thái đơn hàng thành công!');
            resetForm();
        }
        if (isErrorDelete) {
            message.error();
        }
    }, [isSuccessDelete, isErrorDelete]);

    useEffect(() => {
        if (isSuccessUpdate && data?.status !== 'ERR') {
            message.success();
            alert('Cập nhật trạng thái đơn hàng thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['statuses']); // Invalidate the cache to refetch Statuss
        }
    }, [isSuccessUpdate, isErrorUpdate]);



    const handleAddStatus = () => {
        resetForm();
        setShowModal(true);
        setSelectedStatus(null);
    };

    const handleEditStatus = (status) => {
        setName(status.name);
        setNote(status.note);
        setSelectedStatus(status);
        setShowModal(true);
    };

    const handleDeleteStatus = (status) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa trạng thái đơn hàng "${status.name}" không?`)) {
            setSelectedStatus(status);
            deleteMutation.mutate(status._id);
        }
    };

    const onSave = async () => {
        if (validateForm()) {
            const dataToSave = { name, note };
            if (selectedStatus) {
                dataToSave.id = selectedStatus._id;
                updateMutation.mutate(dataToSave); // Update Status
            } else {
                addMutation.mutate(dataToSave); // Add new Status
            }
        }
    };

    const onCancel = () => {
        resetForm();
        setShowModal(false);
    };

    const handleOnChange = (value) => {
        setSearchTerm(value);
    };

    useEffect(() => {
        if (statuses) {
            setFilteredStatuses(
                statuses.filter(status => status.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [searchTerm, statuses]);

    return (
        <div >
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên trạng thái đơn hàng"
                            enable={true}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm trạng thái đơn hàng"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddStatus}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '30%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Tên trạng thái đơn hàng</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingStatus ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredStatuses && filteredStatuses.length > 0 ? (
                            filteredStatuses.map((status) => (
                                <tr key={status._id}>
                                    <td>{status._id}</td>
                                    <td>{status.name}</td>
                                    <td>{status.note || '*'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditStatus(status)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteStatus(status)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ModalComponent
                isOpen={showModal}
                title={selectedStatus ? "CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG" : "THÊM TRẠNG THÁI ĐƠN HÀNG"}
                body={
                    <>
                        <FormComponent
                            id="nameStatusInput"
                            label="Tên trạng thái đơn hàng"
                            type="text"
                            placeholder="Nhập tên trạng thái đơn hàng"
                            value={name}
                            onChange={handleOnChangeName}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="noteStatusInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable={true}
                        />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                            {errorMessage && (
                                <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </>
                }
                textButton1={selectedStatus ? "Cập nhật" : "Thêm"}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default StatusSubTab;
