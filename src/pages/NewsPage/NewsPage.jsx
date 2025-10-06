import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as NewsService from "../../services/NewsService";
import NewsCard from "../../components/CardNewsComponent/CardNewsComponent";
import NewsCard2 from "../../components/NewsCardComponent/NewCard";
import "./NewsPage.css";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate, Link } from "react-router-dom";

const NewsPage = () => {
  const { data: newsList, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => (await NewsService.getAllNews()).data,
  });

  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin === true;

  // State for modal & management
  const [isManagingNews, setIsManagingNews] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSaveNews = async (formData) => {
    try {
      await NewsService.createNews(formData);
      queryClient.invalidateQueries(["news"]);
      setShowModal(false);
      setEditingNews(null);
    } catch (error) {
      console.error("Lỗi khi lưu tin tức:", error);
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá tin này?")) {
      try {
        await NewsService.deleteNews(id, user?.access_token);
        queryClient.invalidateQueries(["news"]);
      } catch (error) {
        console.error("Lỗi khi xoá tin:", error);
      }
    }
  };

  // Group news by category
  const groupedNews = newsList?.reduce((acc, news) => {
    const category = news.category || "Khác"; // Fallback to "Khác" if category is undefined
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(news);
    return acc;
  }, {});

  return (
    <div className="news-page container py-4">
      <div>
        {isManagingNews ? (
          <h1 className="site-title">Quản lý tin tức</h1>
        ) : (
          <h1 className="site-title">Tin tức</h1>
        )}
      </div>

      {isAdmin && (
        <div className="admin-controls">
          <button
            className="edit-promotion-button"
            onClick={() => setIsManagingNews(!isManagingNews)}
          >
            <i className={isManagingNews ? "bi bi-eye" : "bi bi-gear"}></i>
            {isManagingNews ? "Xem trang tin tức" : "Quản lý tin tức"}
          </button>
        </div>
      )}

      <div className="row">
        <main>
          {isManagingNews ? (
            <>
              <div className="col d-flex justify-content-end">
                <ButtonComponent
                  textButton="Thêm tin tức"
                  icon={<i className="bi bi-plus-circle"></i>}
                  onClick={() =>
                    setIsManagingNews(!isManagingNews) & navigate("/news/create")
                  }
                />
              </div>
              <table className="table custom-table" style={{ marginTop: "30px" }}>
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: "30%" }}>
                      Tiêu đề
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Ảnh
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Tác giả
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Ngày đăng
                    </th>
                    <th scope="col" style={{ width: "20%" }}>
                      Sửa/Xóa
                    </th>
                  </tr>
                </thead>
                <tbody className="table-content">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5">Loading...</td>
                    </tr>
                  ) : newsList?.length > 0 ? (
                    newsList.map((news) => (
                      <tr key={news._id}>
                        <td>{news.title}</td>
                        <td>
                          <img
                            src={news.image}
                            alt={news.title}
                            style={{ width: "80px", height: "100px", objectFit: "cover" }}
                          />
                        </td>
                        <td>{news.author}</td>
                        <td>{news.publishedAt}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => {
                              setEditingNews(news);
                              setShowModal(true);
                              navigate(`/news/edit/${news._id}`);
                            }}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteNews(news._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Không có dữ liệu để hiển thị.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <div className="row">
              <aside className="col-3">
                <h5 className="sidebar-title">Danh mục tin tức</h5>
                <div className="category-news-list">
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : groupedNews && Object.keys(groupedNews).length > 0 ? (
                    Object.keys(groupedNews).map((category) => (
                      <div key={category} className="category-section">
                        <h6 className="category-title">{category}</h6>
                        {groupedNews[category].map((news) => (
                          <Link
                            to={`/news/${news._id}`}
                            style={{ textDecoration: "none" }}
                            key={news._id}
                          >
                            <NewsCard2
                              image={news.image}
                              title={news.title}
                              date={new Date(news.createdAt).toLocaleDateString("vi-VN")}
                            />
                          </Link>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p>Không có tin tức nào.</p>
                  )}
                </div>
              </aside>
              <div className="col-9">
                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap", rowGap: "20px" }}
                >
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : newsList?.length > 0 ? (
                    newsList.map((news) => (
                      <div className="col-6" key={news._id} style={{ marginBottom: "10px" }}>
                        <Link to={`/news/${news._id}`} style={{ textDecoration: "none" }}>
                          <NewsCard
                            image={news.image}
                            date={new Date(news.createdAt).toLocaleDateString("vi-VN")}
                            author={news.source || "Bookish Team"}
                            title={news.title}
                            description={news.summary}
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">Không có tin tức nào.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NewsPage;