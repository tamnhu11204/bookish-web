// components/Recommendation/Recommendation.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import * as ProductService from '../../services/ProductService';
import * as RecomendService from '../../services/RecommendService';
import { getSessionId } from '../../../src/utils/session';
import './recommendation.css';

const Recommendation = ({ userId }) => {
  const [combos, setCombos] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // TỰ ĐỘNG TẠO + LẤY SESSION ID CHO KHÁCH VÃNG LAI
        const sessionId = getSessionId();

        // GỌI SERVICE MỚI – TRUYỀN CẢ userId VÀ sessionId
        const response = await RecomendService.getRecommend(
          userId || null,  // nếu không có userId → null
          sessionId        // luôn có sessionId
        );

        if (response.status === 'OK' && response.data?.combos?.length > 0) {
          setCombos(response.data.combos);
          setAllBooks(response.data.books || []);
        }
      } catch (err) {
        console.error('Lỗi gợi ý:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleOnClickProduct = async (id) => {
    await ProductService.updateView(id);
    navigate(`/product-detail/${id}`);
  };

  // LOADING ĐẸP KHI ĐANG TẢI
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fw-bold text-success" style={{ fontSize: '1.2rem' }}>
          Đang tìm sách hay cho bạn...
        </p>
        <small className="text-muted">AI đang phân tích sở thích của bạn</small>
      </div>
    );
  }

  // Nếu không có gợi ý → ẩn section (không hiện trắng)
  if (combos.length === 0) return null;

  return (
    <div className="recommendation-master">
      {combos.map((combo, index) => (
        <div key={index} className="combo-section mb-5">
          <div className="combo-header text-center mb-4">
            <h3 className="combo-title fw-bold text-success">{combo.title}</h3>
            <p className="combo-reason text-muted fst-italic">{combo.reason}</p>
          </div>

          <div className="combo-books row g-3 justify-content-center">
            {combo.book_ids.map((bookId) => {
              const book = allBooks.find(b => b._id === bookId || b._id.toString() === bookId);
              if (!book) return null;

              return (
                <div key={book._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <CardProductComponent
                    id={book._id}
                    img={book.img?.[0]}
                    proName={book.name}
                    currentPrice={(book.price * (100 - (book.discount || 0)) / 100).toLocaleString()}
                    originalPrice={book.price}
                    sold={book.sold}
                    star={book.star}
                    feedbackCount={book.feedbackCount}
                    onClick={() => handleOnClickProduct(book._id)}
                    view={book.view}
                    stock={book.stock}
                    discount={book.discount || 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;