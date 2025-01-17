import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as SupplierService from '../../services/OptionService/SupplierService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Compressor from 'compressorjs';

const SupplierSubTab = () => {
    // State quản lý modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState('');
    const [id, setID] = useState('');
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [rowSelected, setRowSelected] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    const resetForm = () => {
        setName('');
        setNote('');
        setImage('');
        setEditingSupplier(null);
    };

    const mutation = useMutationHook(data => SupplierService.addSupplier(data));
    const mutationEdit = useMutationHook(data => SupplierService.updateSupplier(id, data));
    const mutationDelete = useMutationHook(data => SupplierService.deleteSupplier(id));

    // Lấy danh sách nhà xb từ API
    const getAllSupplier = async () => {
        const res = await SupplierService.getAllSupplier();
        return res.data;
    };

    const { isLoading: isLoadingSupplier, data: suppliers } = useQuery({
        queryKey: ['suppliers'],
        queryFn: getAllSupplier,
    });

    const { data, isSuccess, isError } = mutation;
    const { data: editData, isSuccess: isEditSuccess, isError: isEditError } = mutationEdit;
    const { data: deleteData, isSuccess: isDeleteSuccess, isError: isDeleteError } = mutationDelete;

    // Xử lý chọn ảnh và nén ảnh
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                success(result) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setImage(reader.result); // Cập nhật ảnh đã nén dưới dạng base64
                    };
                    reader.readAsDataURL(result); // Đọc ảnh đã nén dưới dạng base64
                },
                error(err) {
                    console.error(err);
                }
            });
        }
    };

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            alert('Thêm nhà cung cấp mới thành công!');
            resetForm();
            setShowModal(false);
        }
        if (isError) {
            message.error();
        }
    }, [isSuccess, isError, data?.status]);

    useEffect(() => {
        if (isEditSuccess && editData?.status !== 'ERR') {
            message.success();
            alert('Chỉnh sửa nhà cung cấp thành công!');
            resetForm();
            setEditModal(false);
        }
        if (isEditError) {
            message.error();
        }
    }, [isEditSuccess, isEditError, editData?.status]);

    useEffect(() => {
        if (isDeleteSuccess && deleteData?.status !== 'ERR') {
            message.success();
            alert('Xóa nhà cung cấp thành công!');
            resetForm();
        }
        if (isDeleteError) {
            message.error();
        }
    }, [isDeleteSuccess, isDeleteError, deleteData?.status]);

    const handleAddSupplier = () => {
        setShowModal(true);
    };

    const handleEditSupplier = (supplier) => {
        setEditModal(true);
        setRowSelected(supplier);
        setID(supplier._id);
        setName(supplier.name);
        setNote(supplier.note);
        setImage(supplier.img);
    };

    const handleDeleteSupplier = async (supplier) => {
        setID(supplier._id);
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa " + supplier.name + "?");
        if (isConfirmed) {
            onDelete();
            getAllSupplier();
        }
    };

    const onSave = async () => {
        if (editingSupplier) {
            await mutationEdit.mutateAsync({ id: editingSupplier._id, name, note, img });
        } else {
            await mutation.mutateAsync({ name, note, img });
        }
    };

    const onSave2 = async () => {
        await mutationEdit.mutateAsync({ id, name, note, img });
        getAllSupplier();
    };

    const onDelete = async () => {
        await mutationDelete.mutateAsync({ id });
    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    const onCancel2 = () => {
        alert('Hủy thao tác!');
        resetForm();
        setEditModal(false);
    };

    const handleOnChange = (value) => {
            setSearchTerm(value);
        };
    
        useEffect(() => {
                if (suppliers) {
                    setFilteredSuppliers(
                        suppliers.filter(supplier => supplier.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }
            }, [searchTerm, suppliers]);

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên nhà cung cấp"
                            enable = {true}
                        />
                    </div>
                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm nhà cung cấp"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddSupplier}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '20%' }}>Mã</th>
                            <th scope="col" style={{ width: '10%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên nhà cung cấp</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingSupplier ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map((supplier) => (
                                <tr key={supplier._id}>
                                    <td>{supplier._id}</td>
                                    <td>
                                        <img
                                            src={supplier.img}
                                            alt={supplier.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.note||'*'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditSupplier(supplier)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteSupplier(supplier)}
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
                title="THÊM NHÀ CUNG CẤP"
                body={
                    <>
                        <FormComponent
                            id="nameSupplierInput"
                            label="Tên nhà cung cấp"
                            type="text"
                            placeholder="Nhập tên nhà cung cấp"
                            value={name}
                            onChange={setName}
                            enable = {true}
                        />
                        <FormComponent
                            id="noteSupplierInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={setNote}
                            enable = {true}
                        />
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Hình ảnh</label>
                            <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                {img ? (
                                    <img src={img} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                ) : (
                                    <span className="text-muted">Chọn hình ảnh</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="image"
                                className="form-control mt-2"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {data?.status === 'ERR' && <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
            />

            <ModalComponent
                isOpen={editModal}
                title={editingSupplier ? "CHỈNH SỬA NHÀ CUNG CẤP" : "CHỈNH SỬA NHÀ CUNG CẤP"}
                body={
                    <>
                        <FormComponent
                            id="nameSupplierInput"
                            label="Tên nhà cung cấp"
                            type="text"
                            placeholder={rowSelected.name}
                            value={name}
                            onChange={setName}
                            enable = {true}
                        />
                        <FormComponent
                            id="noteSupplierInput"
                            label="Ghi chú"
                            type="text"
                            placeholder={rowSelected.note}
                            value={note}
                            onChange={setNote}
                            enable = {true}
                        />
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Hình ảnh</label>
                            <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                {img ? (
                                    <img src={img} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                ) : (
                                    <span className="text-muted">Chọn hình ảnh</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="image"
                                className="form-control mt-2"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {editData?.status === 'ERR' && <span style={{ color: "red", fontSize: "16px" }}>{editData?.message}</span>}
                    </>
                }
                textButton1="Lưu"
                onClick1={onSave2}
                onClick2={onCancel2}
            />
        </div>
    );
};

export default SupplierSubTab;
