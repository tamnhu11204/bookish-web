import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as AboutUsService from '../../services/AboutUsService';
import './AboutUsPage.css';

// Ảnh placeholder phòng trường hợp dữ liệu ảnh trong DB bị trống
import placeholderVision from '../../assets/img/img1.png';
import placeholderContact from '../../assets/img/img2.png';

const AboutUsPage = () => {
    const user = useSelector(state => state.user);
    const isAdmin = user?.isAdmin === true;
    const access_token = user?.access_token;

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});
    const [editBannerImage1, setEditBannerImage1] = useState(null);
    const [editBannerImage2, setEditBannerImage2] = useState(null);

    const queryClient = useQueryClient();

    const { data: config, isLoading } = useQuery({
        queryKey: ['aboutUsConfig'],
        queryFn: async () => (await AboutUsService.getConfig()).data,
    });

    useEffect(() => {
        if (config) {
            setEditFormData(config);
            setInitialFormData(config);
        }
    }, [config]);

    const updateMutation = useMutation({
        mutationFn: async ({ data, token }) => {
            return await AboutUsService.updateConfig(data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['aboutUsConfig']);
            setIsEditing(false);
            setEditBannerImage1(null);
            setEditBannerImage2(null);
        },
        onError: (error) => {
            console.error("Lỗi khi cập nhật:", error);
        }
    });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (field === 'bannerImage1') setEditBannerImage1(file);
            if (field === 'bannerImage2') setEditBannerImage2(file);
        }
    };

    const handleCancelEdit = () => {
        setEditFormData(initialFormData);
        setEditBannerImage1(null);
        setEditBannerImage2(null);
        setIsEditing(false);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(editFormData).forEach(key => {
            if (editFormData[key] !== null && editFormData[key] !== undefined) {
                formData.append(key, editFormData[key]);
            }
        });
        if (editBannerImage1) formData.append('bannerImage1', editBannerImage1);
        if (editBannerImage2) formData.append('bannerImage2', editBannerImage2);
        updateMutation.mutate({ data: formData, token: access_token });
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (!config && !isEditing) {
        return (
            <div className="about-us-container" style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Chưa có dữ liệu cho trang Giới thiệu.</h2>
                {isAdmin && (
                    <button className="edit-page-button" style={{ position: 'static', marginTop: '20px' }} onClick={() => setIsEditing(true)}>
                        <i className="bi bi-pencil"></i> Tạo dữ liệu ngay
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="about-us-container">
            {isAdmin && !isEditing && (
                <button className="edit-page-button" onClick={() => setIsEditing(true)}>
                    <i className="bi bi-pencil"></i> Chỉnh sửa Trang
                </button>
            )}

            <section className="about-hero-section">
                {isEditing ? (
                    <>
                        <input name="title" value={editFormData.title || ''} onChange={handleEditChange} className="inline-edit-input title-input" />
                        <textarea name="description" value={editFormData.description || ''} onChange={handleEditChange} className="inline-edit-textarea description-input" rows="6" />
                    </>
                ) : (
                    <>
                        <h1>{config?.title}</h1>
                        <p className="description">{config?.description}</p>
                    </>
                )}
            </section>

            <section className="vision-mission-section">
                <div className="vision-mission-grid">
                    <div className="image-column">
                        <img src={editBannerImage1 ? URL.createObjectURL(editBannerImage1) : (config?.bannerImage1 || placeholderVision)} alt="Tầm nhìn và Sứ mệnh" />
                        {isEditing && (
                            <div className="image-upload-overlay">
                                <label htmlFor="bannerImage1-upload">Thay đổi ảnh <i className="bi bi-upload"></i></label>
                                <input id="bannerImage1-upload" type="file" onChange={(e) => handleImageChange(e, 'bannerImage1')} />
                            </div>
                        )}
                    </div>
                    <div className="text-column">
                        <h2>Tầm Nhìn - Sứ Mệnh</h2>
                        <h3>Sứ Mệnh</h3>
                        {isEditing ? <textarea name="mission" value={editFormData.mission || ''} onChange={handleEditChange} className="inline-edit-textarea" rows="6" />
                            : <div className="content-display" dangerouslySetInnerHTML={{ __html: config?.mission?.replace(/\n/g, '<br />') }} />}
                        <h3>Tầm Nhìn</h3>
                        {isEditing ? <textarea name="vision" value={editFormData.vision || ''} onChange={handleEditChange} className="inline-edit-textarea" rows="6" />
                            : <div className="content-display" dangerouslySetInnerHTML={{ __html: config?.vision?.replace(/\n/g, '<br />') }} />}
                    </div>
                </div>
            </section>

            <section className="contact-info-section">
                <div className="contact-info-grid">
                    <div className="text-column">
                        <h2>Thông Tin Liên Hệ</h2>
                        {isEditing ? <textarea name="contacts" value={editFormData.contacts || ''} onChange={handleEditChange} className="inline-edit-textarea" rows="6" />
                            : <div className="content-display" dangerouslySetInnerHTML={{ __html: config?.contacts?.replace(/\n/g, '<br />') }} />}
                    </div>
                    <div className="image-column">
                        <img src={editBannerImage2 ? URL.createObjectURL(editBannerImage2) : (config?.bannerImage2 || placeholderContact)} alt="Thông tin liên hệ" />
                        {isEditing && (
                            <div className="image-upload-overlay">
                                <label htmlFor="bannerImage2-upload">Thay đổi ảnh <i className="bi bi-upload"></i></label>
                                <input id="bannerImage2-upload" type="file" onChange={(e) => handleImageChange(e, 'bannerImage2')} />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {isEditing && (
                <div className="edit-actions-footer">
                    <button className="save-button" onClick={handleSubmitEdit} disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading ? 'Đang lưu...' : <><i className="bi bi-check-circle"></i> Lưu</>}
                    </button>
                    <button className="cancel-button" onClick={handleCancelEdit}><i className="bi bi-x-circle"></i> Hủy</button>
                </div>
            )}
        </div>
    );
};

export default AboutUsPage;