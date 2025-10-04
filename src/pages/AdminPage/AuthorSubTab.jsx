import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as AuthorService from '../../services/AuthorService';
import './AdminPage.css';
import TextEditor from './partials/TextEditor';

const AuthorSubTab = () => {
    // State quản lý modal
    const [name, setName] = useState('');
    const [info, setInfo] = useState('');
    const [img, setImage] = useState(null);
    const [id, setID] = useState('');
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [rowSelected, setRowSelected] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAuthors, setFilteredAuthors] = useState([]);

    const resetForm = () => {
        setName('');
        setInfo('');
        setImage(null);
        setPreviewImage(null);
        setEditingAuthor(null);
    };

    const mutation = useMutationHook(data => AuthorService.addAuthor(data));
    const mutationEdit = useMutationHook(data => AuthorService.updateAuthor(id, data));
    const mutationDelete = useMutationHook(data => AuthorService.deleteAuthor(id));

    // Lấy danh sách từ API
    const getAllAuthor = async () => {
        const res = await AuthorService.getAllAuthor();
        return res.data;
    };

    const { isLoading: isLoadingAuthor, data: authors } = useQuery({
        queryKey: ['authors'],
        queryFn: getAllAuthor,
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
            alert('Thêm tác giả mới thành công!');
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
            alert('Cập nhật tác giả thành công!');
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
            alert('Xóa tác giả thành công!');
            resetForm();
        }
        if (isDeleteError) {
            message.error();
        }
    }, [isDeleteSuccess, isDeleteError, deleteData?.status]);

    const handleAddAuthor = () => {
        setShowModal(true);
    };

    const handleEditAuthor = (auhtor) => {
        setEditModal(true);
        setRowSelected(auhtor);
        setID(auhtor._id);
        setName(auhtor.name);
        setInfo(auhtor.info);
        setImage(auhtor.img);
        setPreviewImage(auhtor.img);
    };

    const handleDeleteAuthor = async (auhtor) => {
        setID(auhtor._id);
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa " + auhtor.name + "?");
        if (isConfirmed) {
            onDelete();
            getAllAuthor();
        }
    };

    const onSave = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("info", info);

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
        formData.append("info", info);

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
        if (authors) {
            setFilteredAuthors(
                authors.filter(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [searchTerm, authors]);

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
    };

    return (
        <div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên tác giả"
                            enable={true}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm tác giả"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddAuthor}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '20%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên tác giả</th>
                            <th scope="col" style={{ width: '20%' }}>Thông tin</th>
                            <th scope="col" style={{ width: '20%' }}>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingAuthor ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredAuthors && filteredAuthors.length > 0 ? (
                            filteredAuthors.map((author) => (
                                <tr key={author._id}>
                                    <td>{author.code}</td>
                                    <td>
                                        <img
                                            src={author.img}
                                            alt={author.name}
                                            style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{author.name.length > 20 ? author.name.slice(0, 20) + '...' : author.name}</td>
                                    <td>
                                        {author.info
                                            ? stripHtml(author.info).length > 30
                                                ? stripHtml(author.info).slice(0, 30) + "..."
                                                : stripHtml(author.info)
                                            : "Không có"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditAuthor(author)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteAuthor(author)}
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
                title="THÊM TÁC GIẢ"
                body={
                    <>
                        <FormComponent
                            id="nameAuthorInput"
                            label="Tên tác giả"
                            type="text"
                            placeholder="Nhập tên tác giả"
                            value={name}
                            onChange={setName}
                            enable={true}
                        />
                        {/* <FormComponent
                            id="infoAuthorInput"
                            label="Thông tin"
                            type="text"
                            placeholder="Nhập thông tin"
                            value={info}
                            onChange={setInfo}
                            enable={true}
                        /> */}
                        <TextEditor value={info} onChange={setInfo} />
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
                title={editingAuthor ? "CẬP NHẬT TÁC GIẢ" : "CẬP NHẬT TÁC GIẢ"}
                body={
                    <>
                        <FormComponent
                            id="nameAuthorInput"
                            label="Tên tác giả"
                            type="text"
                            placeholder={rowSelected.name}
                            value={name}
                            onChange={setName}
                            enable={true}
                        />
                        {/* <FormComponent
                            id="infoAuthorInput"
                            label="Thông tin"
                            type="text"
                            placeholder={rowSelected.info}
                            value={info}
                            onChange={setInfo}
                            enable={true}
                        /> */}
                        <TextEditor value={info} onChange={setInfo} />
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

export default AuthorSubTab;
