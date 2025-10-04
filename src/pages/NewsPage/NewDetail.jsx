import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as NewsService from "../../services/NewsService";
import "./NewsPage.css";
import NewsCard from "../../components/NewsCardComponent/NewCard";

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
      <h1 className="site-title">Tin tức</h1>

      <div className="row">
        {/* Sidebar khuyến mãi */}
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
                      <NewsCard
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
  );
};



export default NewsDetail;
