import { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UnitService from '../../services/OptionService/UnitService';
import * as message from "../../components/MessageComponent/MessageComponent";

const UnitSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [showModal, setShowModal] = useState(false);

    const resetForm = () => {
        setName('');
        setNote('');
    };

    const [errorMessage, setErrorMessage] = useState('');
    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage(""); // Xóa lỗi khi dữ liệu hợp lệ
        return true;
    };

    const mutation = useMutationHook(data => UnitService.addUnit(data));
    const { data, isLoading, isSuccess, isError } = mutation;

    const getAllUnit = async () => {
        const res = await UnitService.getAllUnit();
        return res.data;
    };

    const { isLoading: isLoadingUnit, data: units } = useQuery({
        queryKey: ['units'],
        queryFn: getAllUnit,
    });

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success()
            alert('Thêm đơn vị mới thành công!');
            resetForm();
            setShowModal(false);
        } else if (isError) {
            message.error()
        }
    }, [data?.status, isError, isSuccess])

    const handleAddUnit = () => setShowModal(true);
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const onSave = async () => {
        if (validateForm()) {
            await mutation.mutateAsync({ name, note });
        }
    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
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
                                    <LoadingComponent />
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
                            onChange={handleOnChangeName}
                            required={true}
                        />
                        <FormComponent
                            id="noteUnitInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
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
        </div>
    );
};

export default UnitSubTab;
