import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as NewsService from "../../services/NewsService";
import "./NewsPage.css";

const NewsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const { data: newsList, isLoading2 } = useQuery({ queryKey: ['news'], queryFn: async () => (await NewsService.getAllNews()).data });
  

  // Fetch chi tiết tin tức
  const { data: newsDetail, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => (await NewsService.getNewsDetail(id)).data,
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-5 text-center">Đang tải...</div>;
  if (!newsDetail) return <div className="container py-5 text-center">Không tìm thấy tin tức</div>;

 
return (
    <div className="news-page container py-4">
      <h2 className="page-title text-center mb-5">Tin tức</h2>

     

      <div className="row">
        {/* Sidebar khuyến mãi */}
        <aside className="col-md-3">
          <h5 className="sidebar-title">Tin Khuyến Mãi</h5>
          <div className="promo-news-list">
            {newsList?.slice(0, 4).map((n) => (
              <div key={n._id} className="promo-news-item d-flex mb-3">
              
                <div className="ms-2">
                  <p className="promo-title">{n.title}</p>
                  <p className="promo-date">
                    {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main news */}
         <div className="news-detail container py-5">
      <h1 className="news-title">{newsDetail.title}</h1>

      {/* Ảnh minh họa - Đưa lên trên */}
      {newsDetail.image && (
        <div className="news-image text-center mb-4">
          <img src={newsDetail.image} alt={newsDetail.title} className="img-fluid" />
        </div>
      )}

      <div className="news-meta d-flex align-items-center mb-3">
        <i className="bi bi-calendar me-2"></i>
        <span className="me-3">
          {new Date(newsDetail.createdAt).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
        <i className="bi bi-person me-2"></i>
        <span>{newsDetail.author || "Bookish Team"}</span>
      </div>

      <p className="news-summary">
        <em>{newsDetail.summary}</em>
      </p>

      {/* Hiển thị các đoạn */}
      <div className="news-segments mb-4">
        {newsDetail.segments && newsDetail.segments.length > 0 ? (
          newsDetail.segments.map((segment, index) => (
            <div key={index} className="segment" style={{ marginBottom: "20px" }}>
              {segment.title && <h3 className="segment-title">{segment.title}</h3>}
              <div
                className="segment-content"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            </div>
          ))
        ) : (
          <p>Không có nội dung.</p>
        )}
      </div>
    </div>
   </div>
    </div>
  );};



export default NewsDetail;
