import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const LanguageSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const queryClient = useQueryClient();

    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const resetForm = () => {
        setName('');
        setNote('');
        setSelectedLanguage(null);
    };

    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const addMutation = useMutation(data => LanguageService.addLanguage(data), {
        onSuccess: () => {
            alert("Thêm ngôn ngữ mới thành công!");
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['languages']);
        },
        onError: () => {
            message.error("Thêm ngôn ngữ thất bại!");
        }
    });

    const updateMutation = useMutation(data => {
        if (!selectedLanguage) return;
        return LanguageService.updateLanguage(selectedLanguage._id, data);
    }, {
        onSuccess: () => {
            alert("Cập nhật ngôn ngữ thành công!");
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['languages']);
        },
        onError: () => {
            message.error("Cập nhật thất bại!");
        }
    });

    const deleteMutation = useMutation(id => LanguageService.deleteLanguage(id), {
        onSuccess: () => {
            alert("Xóa ngôn ngữ thành công!");
            queryClient.invalidateQueries(['languages']);
        },
        onError: () => {
            message.error("Xóa thất bại!");
        }
    });

    const getAllLanguage = async () => {
        const res = await LanguageService.getAllLanguage();
        return res.data;
    };

    const { isLoading: isLoadingLanguage, data: languages } = useQuery({
        queryKey: ['languages'],
        queryFn: getAllLanguage,
    });

    useEffect(() => {
        if (languages) {
            setFilteredLanguages(
                languages.filter(language =>
                    language.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, languages]);

    const handleAddLanguage = () => {
        resetForm();
        setShowModal(true);
        setSelectedLanguage(null);
    };

    const handleEditLanguage = (language) => {
        if (!language) return;
        setName(language.name);
        setNote(language.note);
        setSelectedLanguage(language);
        setShowModal(true);
    };

    const handleDeleteLanguage = (language) => {
        if (!language || !language._id) return;
        if (window.confirm(`Bạn có chắc chắn muốn xóa ngôn ngữ "${language.name}" không?`)) {
            deleteMutation.mutate(language._id);
        }
    };

    const onSave = () => {
        if (validateForm()) {
            const dataToSave = { name, note };
            if (selectedLanguage && selectedLanguage._id) {
                updateMutation.mutate(dataToSave);
            } else {
                addMutation.mutate(dataToSave);
            }
        }
    };

    const onCancel = () => {
        resetForm();
        setShowModal(false);
    };

    const handleOnChange = (value) => {
        setSearchTerm(value);
    };

    return (
        <div >
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên ngôn ngữ"
                            enable={true}
                            onChange={handleOnChange}
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
                            <th scope="col" style={{ width: '30%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '20%' }}>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingLanguage ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredLanguages && filteredLanguages.length > 0 ? (
                            filteredLanguages.map((language) => (
                                <tr key={language._id}>
                                    <td>{language.code}</td>
                                    <td>{language.name.length > 20 ? language.name.slice(0, 20) + '...' : language.name}</td>
                                    <td>{language.note && language.note.length > 30 ? language.note.slice(0, 30) + '...' : language.note || 'Không có'}</td>
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
                            enable={true}
                        />
                        <FormComponent
                            id="noteLanguageInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable={true}
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
