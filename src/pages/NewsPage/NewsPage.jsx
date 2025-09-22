import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as NewsService from "../../services/NewsService";
import NewsCard from "../../components/CardNewsComponent/CardNewsComponent";
import {useNavigate, Link } from "react-router-dom";
import NewsCard2 from "../../components/NewsCardComponent/NewCard";
import "./NewsPage.css";

const NewsPage = () => {
  
  const { data: newsList, isLoading } = useQuery({ queryKey: ['news'], queryFn: async () => (await NewsService.getAllNews()).data });

  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin === true;

  // State modal & quản lý
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

  

  return (
    <div className="news-page container py-4">
      <h2 className="page-title text-center mb-5">Tin tức</h2>

      
      {isAdmin && (
          <div className="admin-controls">
             <button className="edit-page-button" onClick={() => setIsManagingNews(!isManagingNews)&navigate("/news/create")}>
              <i className={isManagingNews ? "bi bi-x-circle" : "bi bi-pencil"}></i>
              {isManagingNews ? 'Hủy chỉnh sửa' : 'Thêm tin tức'}
            </button>

            <button className="edit-promotion-button" onClick={() => setIsManagingNews(!isManagingNews)}>
              <i className={isManagingNews ? "bi bi-eye" : "bi bi-gear"}></i>
              {isManagingNews ? 'Xem trang tin tức' : 'Quản lý tin tức'}
            </button>
          </div>
        )}


      <div className="row">
        {/* Sidebar khuyến mãi */}
        <aside className="col-md-3">
          <h5 className="sidebar-title">Tin Hot</h5>
          <div className="promo-news-list">
            {newsList?.slice(0, 4).map((n) => (
              
               <Link to={`/news/${n._id}`} style={{ textDecoration: 'none' }}>
               <NewsCard2
         key = {n._id}
          image={n.image}
          title={n.title}
           date={new Date(n.createdAt).toLocaleDateString("vi-VN")}
        />
             </Link>
            ))}
          </div>
        </aside>

        {/* Main news */}
        <main className="col-md-9">
          {isManagingNews ? (
            <div className="news-manage-list">
              {isLoading ? (
                <div>Loading...</div>
              ) : newsList?.length > 0 ? (
                newsList.map((news) => (
                  <div
                    key={news._id}
                    className="news-manage-item d-flex justify-content-between align-items-center"
                  >
                    <span>{news.title}</span>
                    <div className="manage-actions">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          setEditingNews(news);
                          setShowModal(true);
                          navigate(`/news/edit/${news._id}`)
                        }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteNews(news._id)}
                      >
                        🗑️ Xoá
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có tin tức nào.</p>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {isLoading ? (
                <div>Loading...</div>
              ) : newsList?.length > 0 ? (
                newsList.map((news) => (
                  <div className="col-md-6" key={news._id}>
                   
                    <Link to={`/news/${news._id}`} style={{ textDecoration: 'none' }}>
                      <NewsCard
                        image={news.image} // Sửa thành img để khớp với backend
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
          )}
        </main>
      </div>

     

    </div>
  );
};

export default NewsPage;
