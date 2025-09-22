import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as NewsService from "../../services/NewsService";
import "./NewsPage.css";

const NewsCreatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  console.log("ID từ useParams:", id, "Type:", typeof id); // Debug ID và kiểu

  const [formData, setFormData] = useState({
    title: "",
    segments: [{ title: "", content: "" }],
    summary: "",
    source: "",
    author: "",
    category: "",
    publishDate: "",
    image: null,
  });

  // Chỉ chạy useQuery nếu id hợp lệ
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      console.log("Fetching news with ID:", id); // Debug fetch
      const response = await NewsService.getNewsDetail(id);
      console.log("initialData:", response.data);
      return response.data;
    },
    enabled: !!id && id !== "", // Chỉ chạy nếu id không rỗng
    retry: 1, // Thử lại 1 lần
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  console.log("isLoading:", isLoading, "error:", error); // Debug trạng thái query

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        segments: initialData.segments?.length > 0 ? initialData.segments : [{ title: "", content: "" }],
        summary: initialData.summary || "",
        source: initialData.source || "",
        author: initialData.author || "",
        category: initialData.category || "",
        publishDate: initialData.publishDate ? new Date(initialData.publishDate).toISOString().split("T")[0] : "",
        image: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleChangeImg = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh (jpg, png, v.v.)!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File ảnh quá lớn! Vui lòng chọn file dưới 5MB.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSegmentChange = (index, field, value) => {
    setFormData((prev) => {
      const newSegments = [...prev.segments];
      newSegments[index] = { ...newSegments[index], [field]: value };
      return { ...prev, segments: newSegments };
    });
  };

  const addSegment = () => {
    setFormData((prev) => ({
      ...prev,
      segments: [...prev.segments, { title: "", content: "" }],
    }));
  };

  const removeSegment = (index) => {
    setFormData((prev) => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.segments.some((segment) => segment.content.trim())) {
      alert("Vui lòng điền tiêu đề và ít nhất một đoạn nội dung!");
      return;
    }
    setIsSaving(true);
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("segments", JSON.stringify(formData.segments));
    fd.append("summary", formData.summary || "");
    fd.append("source", formData.source || "");
    fd.append("author", formData.author || "");
    fd.append("category", formData.category || "");
    fd.append("publishDate", formData.publishDate || "");
    if (formData.image instanceof File) {
      fd.append("image", formData.image);
    }
    if (initialData?.image) {
      fd.append("existingImage", initialData.image);
    }
    console.log("FormData entries:", [...fd.entries()]);
    try {
      if (id && id !== "") {
        await NewsService.updateNews(id, fd);
        alert("Cập nhật tin tức thành công!");
      } else {
        await NewsService.createNews(fd);
        alert("Tạo tin tức thành công!");
      }
      navigate("/news");
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Lỗi khi lưu tin tức: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Kiểm tra id bằng if-else
  if (!id || id === "") {
    console.log("Rendering create mode"); // Debug chế độ tạo mới
    return (
      <div className="news-create-page container py-5">
        <h1 className="page-title">Thêm tin tức mới</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề bài viết</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Nhập tiêu đề bài viết"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {formData.segments.map((segment, index) => (
            <div key={index} className="segment-container">
              <label className="form-label">Đoạn {index + 1}</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tiêu đề đoạn (tùy chọn)"
                value={segment.title}
                onChange={(e) => handleSegmentChange(index, "title", e.target.value)}
              />
              <textarea
                className="form-textarea"
                placeholder="Nội dung đoạn"
                value={segment.content}
                onChange={(e) => handleSegmentChange(index, "content", e.target.value)}
                required
              />
              {formData.segments.length > 1 && (
                <button
                  type="button"
                  className="btn btn-remove-segment"
                  onClick={() => removeSegment(index)}
                >
                  Xóa đoạn
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-add-segment"
            onClick={addSegment}
          >
            Thêm đoạn mới
          </button>

          <div className="form-group">
            <label className="form-label">Tóm tắt</label>
            <textarea
              name="summary"
              className="form-textarea summary-textarea"
              placeholder="Nhập tóm tắt bài viết"
              value={formData.summary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tác giả</label>
            <input
              type="text"
              name="author"
              className="form-input"
              placeholder="Nhập tên tác giả"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <input
              type="text"
              name="category"
              className="form-input"
              placeholder="Nhập danh mục (VD: Khuyến mãi, Giới thiệu sách)"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nguồn bài viết</label>
            <input
              type="text"
              name="source"
              className="form-input"
              placeholder="Nhập nguồn bài viết (VD: URL hoặc tên báo)"
              value={formData.source}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ngày đăng</label>
            <input
              type="date"
              name="publishDate"
              className="form-input"
              value={formData.publishDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh minh họa</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-input"
              onChange={handleChangeImg}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-save" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu"}
            </button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate("/news")}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Chế độ chỉnh sửa: kiểm tra trạng thái tải và lỗi
  if (isLoading) {
    console.log("Rendering loading state"); // Debug trạng thái tải
    return <div className="container py-5 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    console.log("Rendering error state:", error.message); // Debug lỗi
    return (
      <div className="container py-5 text-center">
        Lỗi khi tải tin tức: {error.message}
        <br />
        <button className="btn btn-primary mt-3" onClick={() => navigate("/news")}>
          Quay lại
        </button>
      </div>
    );
  }

  // Chế độ chỉnh sửa: hiển thị form với dữ liệu điền sẵn
  console.log("Rendering edit mode"); // Debug chế độ chỉnh sửa
  return (
    <div className="news-create-page container py-5">
      <h1 className="page-title">Chỉnh sửa tin tức</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Tiêu đề bài viết</label>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="Nhập tiêu đề bài viết"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {formData.segments.map((segment, index) => (
          <div key={index} className="segment-container">
            <label className="form-label">Đoạn {index + 1}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tiêu đề đoạn (tùy chọn)"
              value={segment.title}
              onChange={(e) => handleSegmentChange(index, "title", e.target.value)}
            />
            <textarea
              className="form-textarea"
              placeholder="Nội dung đoạn"
              value={segment.content}
              onChange={(e) => handleSegmentChange(index, "content", e.target.value)}
              required
            />
            {formData.segments.length > 1 && (
              <button
                type="button"
                className="btn btn-remove-segment"
                onClick={() => removeSegment(index)}
              >
                Xóa đoạn
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-add-segment"
          onClick={addSegment}
        >
          Thêm đoạn mới
        </button>

        <div className="form-group">
          <label className="form-label">Tóm tắt</label>
          <textarea
            name="summary"
            className="form-textarea summary-textarea"
            placeholder="Nhập tóm tắt bài viết"
            value={formData.summary}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tác giả</label>
          <input
            type="text"
            name="author"
            className="form-input"
            placeholder="Nhập tên tác giả"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Danh mục</label>
          <input
            type="text"
            name="category"
            className="form-input"
            placeholder="Nhập danh mục (VD: Khuyến mãi, Giới thiệu sách)"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nguồn bài viết</label>
          <input
            type="text"
            name="source"
            className="form-input"
            placeholder="Nhập nguồn bài viết (VD: URL hoặc tên báo)"
            value={formData.source}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ngày đăng</label>
          <input
            type="date"
            name="publishDate"
            className="form-input"
            value={formData.publishDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ảnh minh họa</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-input"
            onChange={handleChangeImg}
          />
          {initialData?.image && !formData.image && (
            <div className="image-preview text-center mt-2">
              <img src={initialData.image} alt="Ảnh hiện tại" className="img-fluid" />
              <p className="image-note">Ảnh hiện tại (sẽ được giữ nếu không chọn ảnh mới)</p>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save" disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
          <button type="button" className="btn btn-cancel" onClick={() => navigate("/news")}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsCreatePage;