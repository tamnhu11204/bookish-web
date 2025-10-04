import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as PublisherService from '../../services/OptionService/PublisherService';
import './AdminPage.css';

const PublisherSubTab = () => {
    // State quản lý modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState(null);
    const [id, setID] = useState('');
    const [editingPublisher, setEditingPublisher] = useState(null);
    const [rowSelected, setRowSelected] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPublishers, setFilteredPublishers] = useState([]);

    const resetForm = () => {
        setName('');
        setNote('');
        setImage(null);
        setPreviewImage(null);
        setEditingPublisher(null);
    };

    const mutation = useMutationHook(data => PublisherService.addPublisher(data));
    const mutationEdit = useMutationHook(data => PublisherService.updatePublisher(id, data));
    const mutationDelete = useMutationHook(data => PublisherService.deletePublisher(id));

    // Lấy danh sách nhà xb từ API
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
            alert('Cập nhật nhà xuất bản thành công!');
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
        setPreviewImage(publisher.img);
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
        if (publishers) {
            setFilteredPublishers(
                publishers.filter(publisher => publisher.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [searchTerm, publishers]);

    return (
        <div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên nhà xuất bản"
                            enable={true}
                            onChange={handleOnChange}
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
                            <th scope="col" style={{ width: '20%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên nhà xuất bản</th>
                            <th scope="col" style={{ width: '20%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '20%' }}>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingPublisher ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredPublishers && filteredPublishers.length > 0 ? (
                            filteredPublishers.map((publisher) => (
                                <tr key={publisher._id}>
                                    <td>{publisher.code}</td>
                                    <td>
                                        <img
                                            src={publisher.img}
                                            alt={publisher.name}
                                            style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{publisher.name.length > 20 ? publisher.name.slice(0, 20) + '...' : publisher.name}</td>
                                    <td>{publisher.note && publisher.note.length > 30 ? publisher.note.slice(0, 30) + '...' : publisher.note || 'Không có'}</td>
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
                            enable={true}
                        />
                        <FormComponent
                            id="notePublisherInput"
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
                title={editingPublisher ? "CẬP NHẬT NHÀ XUẤT BẢN" : "CẬP NHẬT NHÀ XUẤT BẢN"}
                body={
                    <>
                        <FormComponent
                            id="namePublisherInput"
                            label="Tên nhà xuất bản"
                            type="text"
                            placeholder={rowSelected.name}
                            value={name}
                            onChange={setName}
                            enable={true}
                        />
                        <FormComponent
                            id="notePublisherInput"
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

export default PublisherSubTab;
