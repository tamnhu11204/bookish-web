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
    const [img, setImage] = useState(null);
    const [id, setID] = useState('');
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [rowSelected, setRowSelected] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    const resetForm = () => {
        setName('');
        setNote('');
        setImage(null);
        setPreviewImage(null);
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
    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            console.error("Không có file hợp lệ được chọn!");
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
            alert('Cập nhật nhà cung cấp thành công!');
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
        setPreviewImage(supplier.img);
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
        const formData = new FormData();
        formData.append("name", name);
        formData.append("note", note);

        if (img instanceof File) {
            formData.append("img", img);
        } else if (typeof img === "string" && img.startsWith("http")) {
            formData.append("existingImg", img);
        }

        mutation.mutate(formData);
    };

    const onSave2 = async () => {
        if (!id) {
            console.error("Lỗi: ID không hợp lệ!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("note", note);

        if (img instanceof File) {
            formData.append("img", img);
        } else if (typeof img === "string" && img.startsWith("http")) {
            formData.append("existingImg", img);
        }

        // Kiểm tra dữ liệu form trước khi gửi
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        mutationEdit.mutate(formData);
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
                            enable={true}
                            onChange={handleOnChange}
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
                                    <td>{supplier.note || '*'}</td>
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
                            enable={true}
                        />
                        <FormComponent
                            id="noteSupplierInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={setNote}
                            enable={true}
                        />
                        <div className="mb-3">
                            <input
                                type="file"
                                onChange={handleChangeImg}
                                accept="image/*"
                                required
                            />
                            <div className="news__image">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="product-preview"
                                        style={{
                                            width: "36rem",
                                            height: "40rem",
                                            borderRadius: "15px"
                                        }}
                                    />
                                )}
                            </div>
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
                title={editingSupplier ? "CẬP NHẬT NHÀ CUNG CẤP" : "CẬP NHẬT NHÀ CUNG CẤP"}
                body={
                    <>
                        <FormComponent
                            id="nameSupplierInput"
                            label="Tên nhà cung cấp"
                            type="text"
                            placeholder={rowSelected.name}
                            value={name}
                            onChange={setName}
                            enable={true}
                        />
                        <FormComponent
                            id="noteSupplierInput"
                            label="Ghi chú"
                            type="text"
                            placeholder={rowSelected.note}
                            value={note}
                            onChange={setNote}
                            enable={true}
                        />
                        <div className="mb-3">
                            <input
                                type="file"
                                onChange={handleChangeImg}
                                accept="image/*"
                                required
                            />
                            <div className="news__image">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="product-preview"
                                        style={{
                                            width: "36rem",
                                            height: "40rem",
                                            borderRadius: "15px"
                                        }}
                                    />
                                )}
                            </div>
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
