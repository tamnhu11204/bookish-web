import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const LanguageSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const queryClient = useQueryClient(); // Get query client for manual cache updates

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

    const addMutation = useMutationHook(data => LanguageService.addLanguage(data));
    const updateMutation = useMutationHook(data => LanguageService.updateLanguage(selectedLanguage._id, data));
    const deleteMutation = useMutationHook(data => LanguageService.deleteLanguage(selectedLanguage._id));

    const getAllLanguage = async () => {
        const res = await LanguageService.getAllLanguage();
        return res.data;
    };

    const { isLoading: isLoadingLanguage, data: languages } = useQuery({
        queryKey: ['languages'],
        queryFn: getAllLanguage,
    });

    const { data, isSuccess, isError } = addMutation;
    const { isSuccess: isSuccessUpdate, isError: isErrorUpdate } = updateMutation;
    const { isSuccess: isSuccessDelete, isError: isErrorDelete } = deleteMutation;

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            alert('Thêm ngôn ngữ mới thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['languages']); // Invalidate the cache to refetch languages
        }
        if (isSuccessUpdate && data?.status !== 'ERR') {
            message.success();
            alert('Cập nhật ngôn ngữ thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['languages']); // Invalidate the cache to refetch languages
        }
        if (isError || isErrorUpdate || isErrorDelete) {
            message.error();
        }
    }, [isSuccess, isError, isSuccessUpdate, isErrorUpdate, isSuccessDelete, isErrorDelete, data?.status, queryClient]);

    const handleAddLanguage = () => {
        resetForm();
        setShowModal(true);
        setSelectedLanguage(null);
    };

    const handleEditLanguage = (language) => {
        setName(language.name);
        setNote(language.note);
        setSelectedLanguage(language);
        setShowModal(true);
    };

    const handleDeleteLanguage = (language) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa ngôn ngữ "${language.name}" không?`)) {
            deleteMutation.mutate(language._id);
        }
    };

    const onSave = async () => {
        if (validateForm()) {
            const dataToSave = { name, note };
            if (selectedLanguage) {
                dataToSave.id = selectedLanguage._id;
                updateMutation.mutate(dataToSave); // Update language
            } else {
                addMutation.mutate(dataToSave); // Add new language
            }
        }
    };

    const onCancel = () => {
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
                            placeholder="Tìm kiếm theo tên ngôn ngữ"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm ngôn ngữ"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddLanguage}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '30%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Tên ngôn ngữ</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingLanguage ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : languages && languages.length > 0 ? (
                            languages.map((language) => (
                                <tr key={language._id}>
                                    <td>{language._id}</td>
                                    <td>{language.name}</td>
                                    <td>{language.note}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditLanguage(language)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteLanguage(language)}
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
                title={selectedLanguage ? "CẬP NHẬT NGÔN NGỮ" : "THÊM NGÔN NGỮ"}
                body={
                    <>
                        <FormComponent
                            id="nameLanguageInput"
                            label="Tên ngôn ngữ"
                            type="text"
                            placeholder="Nhập tên ngôn ngữ"
                            value={name}
                            onChange={handleOnChangeName}
                            required={true}
                        />
                        <FormComponent
                            id="noteLanguageInput"
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
                        </div>
                    </>
                }
                textButton1={selectedLanguage ? "Cập nhật" : "Thêm"}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default LanguageSubTab;
