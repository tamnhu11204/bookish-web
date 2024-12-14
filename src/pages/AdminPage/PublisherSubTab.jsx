import React, {useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const PublisherSubTab = () => {
    

    // State quản lý modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState(null);
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);
    const handleOnChangeImage = (value) => setImage(value);
    const [editingPublisher, setEditingPublisher] = useState(null);


    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const resetForm = () => {
        setName('');
        setNote('');
        setImage('');
        setEditingPublisher(null);

    };

    const mutation = useMutationHook(data => PublisherService.addPublisher(data));
    const mutationEdit = useMutationHook(data => PublisherService.updatePublisher(data));


    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          setImage(URL.createObjectURL(event.target.files[0]));
        }
      };

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

    const handleAddPublisher = () => {
        setShowModal(true);
    };

    const onSave = async () => {
        //await mutation.mutateAsync({ name, note ,img});
        if (editingPublisher) {
            await mutationEdit.mutateAsync({ id: editingPublisher._id, name, note, img });
        } else {
            await mutation.mutateAsync({ name, note, img });
        }


    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    // Hàm mở modal thêm nxb
    /*const handleAddPublisher = () => {
        setModalTitle('THÊM NHÀ XUẤT BẢN');
        setModalBody(
            <>
                
                <FormComponent
                    id="nameInput"
                    placeholder="Nhập tên nhà xuất bản"
                    type="text"
                    label="Tên nhà xuất bản"
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    placeholder="Nhập ghi chú"
                ></FormComponent>

            </>
        );
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Nhà xuất bản mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm nhà xuất bản!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa nxb
    const handleEditPublisher = (publisher) => {
        setModalTitle('CẬP NHẬT NHÀ XUẤT BẢN');
        setModalBody(
            <>
            <FormComponent
                    id="nameInput"
                    type="text"
                    label="Tên nhà xuất bản"
                    defaultValue={publisher.name}
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    defaultValue={publisher.note}
                ></FormComponent>
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`Nhà xuất bản"${publisher.name}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật nhà xuất bản!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa nxb
    const handleDeletePublisher = (publisher) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa nhà xuất bản <strong>{publisher.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`Nhà xuất bản "${publisher.name}" đã được xóa!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
    }; */

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

                <table className="table custom-table" style={{marginTop:'30px'}}>
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
                                        //onClick={() => handleEditPublisher(publisher)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                       // onClick={() => handleDeletePublisher(publisher)}
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
                            id="namePublisherInput"
                            label="Tên nhà xuất bản"
                            type="text"
                            placeholder="Nhập tên nhà xuất bản"
                            value={name}
                            onChange={handleOnChangeName}
                        />
                        <FormComponent
                            id="notePublisherInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                        />

<div className="mb-3">
        <label htmlFor="image" className="form-label">
          Hình ảnh
        </label>
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
                        {data?.status === 'ERR' &&
                            <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
            />

            
<ModalComponent
                isOpen={showModal}
                title={editingPublisher ? "CHỈNH SỬA NHÀ CUNG CẤP" : "THÊM NHÀ CUNG CẤP"}
                body={
                    <>
                        <FormComponent
                            id="namePublisherInput"
                            label="Tên nhà xuất bản"
                            type="text"
                            placeholder="Nhập tên nhà xuất bản"
                            value={name}
                            onChange={handleOnChangeName}
                        />
                        <FormComponent
                            id="notePublisherInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                        />
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">
                                Hình ảnh
                            </label>
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
                        {data?.status === 'ERR' && 
                            <span style={{ color: "red", fontSize:"16px" }}>{data?.message}</span>}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
                />



        </div>
    );
};

export default PublisherSubTab;
