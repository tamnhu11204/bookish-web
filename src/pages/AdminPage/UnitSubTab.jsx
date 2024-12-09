import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UnitService from '../../services/UnitService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const UnitSubTab = () => {
    // State cho form và modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Hàm reset form
    const resetForm = () => {
        setName('');
        setNote('');
    };

    // Mutation để thêm đơn vị
    const mutation = useMutationHook(data => UnitService.addUnit(data));

    // Lấy danh sách đơn vị từ API
    const getAllUnit = async () => {
        const res = await UnitService.getAllUnit();
        return res.data;
    };

    const { isLoading: isLoadingUnit, data: units } = useQuery({
        queryKey: ['units'],
        queryFn: getAllUnit,
    });

    // Thêm đơn vị
    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.status !== 'ERR') {
            message.success();
            alert('Thêm đơn vị mới thành công!');
            resetForm();
            setShowModal(false);
        }
        if (mutation.isError) {
            message.error();
        }
    }, [mutation.isSuccess, mutation.isError, mutation.data?.status]);

    const handleAddUnit = () => setShowModal(true);

    const onSave = async () => {
        await mutation.mutateAsync({ name, note });
    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                {/* Thanh tìm kiếm và nút thêm */}
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên đơn vị"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm đơn vị"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddUnit}
                        />
                    </div>
                </div>

                {/* Bảng hiển thị danh sách đơn vị */}
                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '30%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Tên đơn vị</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingUnit ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent/>
                                </td>
                            </tr>
                        ) : units && units.length > 0 ? (
                            units.map((unit) => (
                                <tr key={unit._id}>
                                    <td>{unit._id}</td>
                                    <td>{unit.name}</td>
                                    <td>{unit.note}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger">
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

            {/* Modal thêm đơn vị */}
            <ModalComponent
                isOpen={showModal}
                title="THÊM ĐƠN VỊ"
                body={
                    <>
                        <FormComponent
                            id="nameUnitInput"
                            label="Tên đơn vị"
                            type="text"
                            placeholder="Nhập tên đơn vị"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <FormComponent
                            id="noteUnitInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                        {mutation.data?.status === 'ERR' && (
                            <span style={{ color: "red", fontSize: "16px" }}>
                                {mutation.data?.message}
                            </span>
                        )}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default UnitSubTab;
