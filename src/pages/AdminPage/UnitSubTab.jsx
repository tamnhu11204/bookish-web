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
    const [editModal, setEditModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredUnits, setFilteredUnits] = useState([]); 

    const resetForm = () => {
        setName('');
        setNote('');
        setSelectedUnit(null);
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

    const mutationAdd = useMutationHook(data => UnitService.addUnit(data));
    const mutationEdit = useMutationHook(data => UnitService.updateUnit(selectedUnit._id, data));
    const mutationDelete = useMutationHook(data => UnitService.deleteUnit(selectedUnit._id));

    const { data, isLoading, isSuccess, isError } = mutationAdd;
    const { data: editData, isSuccess: isEditSuccess, isError: isEditError } = mutationEdit;
    const { data: deleteData, isSuccess: isDeleteSuccess, isError: isDeleteError } = mutationDelete;

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
            message.success();
            alert('Thêm đơn vị mới thành công!');
            resetForm();
            setShowModal(false);
        } else if (isError) {
            message.error();
        }
    }, [data?.status, isError, isSuccess]);

    useEffect(() => {
        if (isEditSuccess && editData?.status !== 'ERR') {
            message.success();
            alert('Cập nhật đơn vị thành công!');
            resetForm();
            setEditModal(false);
        } else if (isEditError) {
            message.error();
        }
    }, [isEditSuccess, isEditError, editData?.status]);

    useEffect(() => {
        if (isDeleteSuccess && deleteData?.status !== 'ERR') {
            message.success();
            alert('Xóa đơn vị thành công!');
            resetForm();
        } else if (isDeleteError) {
            message.error();
        }
    }, [isDeleteSuccess, isDeleteError, deleteData?.status]);

    const handleAddUnit = () => setShowModal(true);
    const handleEditUnit = (unit) => {
        setSelectedUnit(unit);
        setName(unit.name);
        setNote(unit.note);
        setEditModal(true);
    };
    const handleDeleteUnit = async (unit) => {
        setSelectedUnit(unit);
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa đơn vị này?");
        if (isConfirmed) {
            await mutationDelete.mutateAsync();
        }
    };

    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const onSave = async () => {
        if (validateForm()) {
            await mutationAdd.mutateAsync({ name, note });
        }
    };

    const onSaveEdit = async () => {
        if (validateForm()) {
            await mutationEdit.mutateAsync({ name, note });
        }
    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    const onCancelEdit = () => {
        alert('Hủy thao tác!');
        resetForm();
        setEditModal(false);
    };

    const handleOnChange = (value) => {
            setSearchTerm(value);
        };
    
        useEffect(() => {
                if (units) {
                    setFilteredUnits(
                        units.filter(unit => unit.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }
            }, [searchTerm, units]);
    

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên đơn vị"
                            enable = {true}
                            onChange={handleOnChange}
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
                            <th scope="col" style={{ width: '10%' }}>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingUnit ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredUnits && filteredUnits.length > 0 ? (
                            filteredUnits.map((unit) => (
                                <tr key={unit._id}>
                                    <td>{unit.code}</td>
                                    <td>{unit.name.length > 20 ? unit.name.slice(0, 20) + '...' : unit.name}</td>
                                    <td>{unit.note && unit.note.length > 30 ? unit.note.slice(0, 30) + '...' : unit.note || 'Không có'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditUnit(unit)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteUnit(unit)}
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

            {/* Modal Thêm Đơn Vị */}
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
                            enable = {true}
                        />
                        <FormComponent
                            id="noteUnitInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable = {true}
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

            {/* Modal Chỉnh Sửa Đơn Vị */}
            <ModalComponent
                isOpen={editModal}
                title="CẬP NHẬT ĐƠN VỊ"
                body={
                    <>
                        <FormComponent
                            id="nameUnitInputEdit"
                            label="Tên đơn vị"
                            type="text"
                            placeholder="Nhập tên đơn vị"
                            value={name}
                            onChange={handleOnChangeName}
                            required={true}
                            enable = {true}
                        />
                        <FormComponent
                            id="noteUnitInputEdit"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable = {true}
                        />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                            {editData?.status === 'ERR' &&
                                <span style={{ color: "red", fontSize: "16px" }}>{editData?.message}</span>}
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

export default UnitSubTab;
