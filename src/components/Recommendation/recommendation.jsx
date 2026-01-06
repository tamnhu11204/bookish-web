// components/Recommendation/Recommendation.jsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import * as RecomendService from '../../services/RecommendService';
import * as ProductService from '../../services/ProductService';
import { getSessionId } from '../../../src/utils/session';
import './recommendation.css';

const Recommendation = ({ userId }) => {
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const queryKey = ['recommend', userId || 'guest', sessionId];
  console.log('Recommendation queryKey:', queryKey);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await RecomendService.getRecommend(userId || null, sessionId);
      if (response.status === 'OK') {
        return response.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const combos = data?.combos || [];
  const allBooks = data?.books || [];

  const handleOnClickProduct = async (id) => {
    await ProductService.updateView(id);
    navigate(`/product-detail/${id}`);
  };

  // Loading đẹp
  if (isLoading) {
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

  // Không có gợi ý → ẩn section
  if (combos.length === 0) return null;

  return (
    <div className="recommendation-master">
      {combos.map((combo, index) => (
        <div key={index} className="combo-section">
          <div className="combo-header">
            <p className="combo-title"
            >{combo.title}</p>
            <p className="combo-reason">{combo.reason}</p>
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