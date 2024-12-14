import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FormatService from '../../services/OptionService/FormatService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const FormSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const [showModal, setShowModal] = useState(false);

    const mutation = useMutationHook(data => FormatService.addFormat(data));

    // Lấy danh sách hình thức từ API
    const getAllFormat = async () => {
        const res = await FormatService.getAllFormat();
        return res.data;
    };

    const { isLoading: isLoadingFormat, data: formats } = useQuery({
        queryKey: ['formats'],
        queryFn: getAllFormat,
    });

    const { data, isSuccess, isError } = mutation;

    const resetForm = () => {
        setName('');
        setNote('');
    };

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            alert('Thêm hình thức mới thành công!');
            resetForm();
            setShowModal(false);
        }
        if (isError) {
            message.error();
        }
    }, [isSuccess, isError, data?.status]);

    const handleAddFormat = () => {
        setShowModal(true);
    };

    const onSave = async () => {
        await mutation.mutateAsync({ name, note });
    };

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    // // Hàm mở modal sửa ngôn ngữ
    // const handleEditLanguage = (language) => {
    //     setModalTitle('CẬP NHẬT HÌNH THỨC');
    //     setModalBody(
    //         <>
    //         <FormComponent
    //                 id="nameInput"
    //                 type="text"
    //                 label="Tên hình thức"
    //                 defaultValue={language.name}
    //             ></FormComponent>

    //             <FormComponent
    //                 id="noteInput"
    //                 label="Ghi chú"
    //                 type="text"
    //                 defaultValue={language.note}
    //             ></FormComponent>
    //         </>
    //     );
    //     setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
    //     setOnSave(() => () => {
    //         alert(`Ngôn ngữ"${language.name}" đã được cập nhật!`);
    //         setShowModal(false);
    //     });
    //     setOnCancel(() => () => {
    //         alert('Hủy cập nhật ngôn ngữ!');
    //         setShowModal(false);
    //     });
    //     setShowModal(true);
    // };

    // // Hàm mở modal xóa ngôn ngữ
    // const handleDeleteLanguage = (language) => {
    //     setModalTitle('Xác nhận xóa');
    //     setModalBody(
    //         <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa ngôn ngữ <strong>{language.name}</strong> không?</p>
    //     );
    //     setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
    //     setOnSave(() => () => {
    //         alert(`Ngôn ngữ "${language.name}" đã được xóa!`);
    //         setShowModal(false);
    //     });
    //     setOnCancel(() => () => {
    //         setShowModal(false);
    //     });
    //     setShowModal(true);
    // };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên hình thức"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm hình thức"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddFormat}
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
                        {isLoadingFormat ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : formats && formats.length > 0 ? (
                            formats.map((format) => (
                                <tr key={format._id}>
                                    <td>{format._id}</td>
                                    <td>{format.name}</td>
                                    <td>{format.note}</td>
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
                title="THÊM HÌNH THỨC"
                body={
                    <>
                        <FormComponent
                            id="nameFormatInput"
                            label="Tên hình thức"
                            type="text"
                            placeholder="Nhập tên hình thức"
                            value={name}
                            onChange={handleOnChangeName}
                        />
                        <FormComponent
                            id="noteUnitInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                        />
                        {data?.status === 'ERR' &&
                            <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default FormSubTab;
