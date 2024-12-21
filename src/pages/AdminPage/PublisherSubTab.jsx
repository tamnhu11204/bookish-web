import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Compressor from 'compressorjs';

const PublisherSubTab = () => {
    // State quản lý modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState('');
    const [id, setID] = useState('');
    const [editingPublisher, setEditingPublisher] = useState(null);
    const [rowSelected, setRowSelected] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const resetForm = () => {
        setName('');
        setNote('');
        setImage('');
        setEditingPublisher(null);
    };

    const mutation = useMutationHook(data => PublisherService.addPublisher(data));
    const mutationEdit = useMutationHook(data => PublisherService.updatePublisher(id, data));
    const mutationDelete = useMutationHook(data => PublisherService.deletePublisher(id));

    // Lấy danh sách nhà cung cấp từ API
    const getAllPublisher = async () => {
        const res = await PublisherService.getAllPublisher();
        return res.data;
    };

    const { isLoading: isLoadingPublisher, data: publishers } = useQuery({
        queryKey: ['publishers'],
        queryFn: getAllPublisher,
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
            alert('Thêm nhà xuất bản mới thành công!');
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
            alert('Chỉnh sửa nhà xuất bản thành công!');
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
            alert('Xóa nhà xuất bản thành công!');
            resetForm();
        }
        if (isDeleteError) {
            message.error();
        }
    }, [isDeleteSuccess, isDeleteError, deleteData?.status]);

    const handleAddPublisher = () => {
        setShowModal(true);
    };

    const handleEditPublisher = (publisher) => {
        setEditModal(true);
        setRowSelected(publisher);
        setID(publisher._id);
        setName(publisher.name);
        setNote(publisher.note);
        setImage(publisher.img);
    };

    const handleDeletePublisher = async (publisher) => {
        setID(publisher._id);
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa " + publisher.name + "?");
        if (isConfirmed) {
            onDelete();
            getAllPublisher();
        }
    };

    const onSave = async () => {
        if (editingPublisher) {
            await mutationEdit.mutateAsync({ id: editingPublisher._id, name, note, img });
        } else {
            await mutation.mutateAsync({ name, note, img });
        }
    };

    const onSave2 = async () => {
        await mutationEdit.mutateAsync({ id, name, note, img });
        getAllPublisher();
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

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên nhà xuất bản"
                        />
                    </div>
                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm nhà xuất bản"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddPublisher}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên nhà xuất bản</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingPublisher ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : publishers && publishers.length > 0 ? (
                            publishers.map((publisher) => (
                                <tr key={publisher._id}>
                                    <td>{publisher._id}</td>
                                    <td>
                                        <img
                                            src={publisher.img}
                                            alt={publisher.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{publisher.name}</td>
                                    <td>{publisher.note}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditPublisher(publisher)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeletePublisher(publisher)}
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
                title="THÊM NHÀ XUẤT BẢN"
                body={
                    <>
                        <FormComponent
                            id="namePublisherInput"
                            label="Tên nhà xuất bản"
                            type="text"
                            placeholder="Nhập tên nhà xuất bản"
                            value={name}
                            onChange={setName}
                        />
                        <FormComponent
                            id="notePublisherInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={setNote}
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
                title={editingPublisher ? "CHỈNH SỬA NHÀ XUẤT BẢN" : "CHỈNH SỬA NHÀ XUẤT BẢN"}
                body={
                    <>
                        <FormComponent
                            id="namePublisherInput"
                            label="Tên nhà xuất bản"
                            type="text"
                            placeholder={rowSelected.name}
                            value={name}
                            onChange={setName}
                        />
                        <FormComponent
                            id="notePublisherInput"
                            label="Ghi chú"
                            type="text"
                            placeholder={rowSelected.note}
                            value={note}
                            onChange={setNote}
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

export default PublisherSubTab;
