import React, { useState, useEffect } from 'react';
import * as RecommendationService from '../../services/RecommendationService';
import './recommendation.css';
import { useActionData } from 'react-router-dom';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import * as ProductService from '../../services/ProductService';
import { useNavigate } from 'react-router-dom';

const Recommendation = ({ userId }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('User ID in :', userId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await RecommendationService.getRecommendations(userId);
        if (response.status === 'OK') {
          setRecommendedBooks(response.recommendedBooks);
        } else {
          setError('Không thể lấy gợi ý sách.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý sách:', error);
        if (error.response?.status === 404) {
          setError('Không tìm thấy người dùng. Vui lòng kiểm tra lại thông tin đăng nhập.');
        } else {
          setError('Có lỗi xảy ra khi lấy gợi ý sách.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendations();
    } else {
      setError('Vui lòng đăng nhập để nhận gợi ý sách.');
      setLoading(false);
    }
  }, [userId]);

  const handleOnClickProduct = async (id) => {
      await ProductService.updateView(id);
      navigate(`/product-detail/${id}`);
    };

  if (loading) return <div>Đang tải gợi ý...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!recommendedBooks || recommendedBooks.length === 0) return <div>Không có sách gợi ý.</div>;

  return (
    <div className="recommendation-section">
      <h3>Sách gợi ý cho bạn </h3>
      <div className="book-list">
        {recommendedBooks.map(product => (
          <CardProductComponent
          key={product._id}
          img={product.img[0]}
          proName={product.name}
          currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
          sold={product.sold}
          star={product.star}
          feedbackCount={product.feedbackCount}
          onClick={() => handleOnClickProduct(product._id)}
          view={product.view}
        />
        ))}
      </div>
    </div>
  );
};

export default Recommendation;