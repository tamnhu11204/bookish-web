import React, { useState, useEffect } from 'react';
import * as RecommendationService from '../../services/RecommendationService';
import './recommendation.css';

const Recommendation = ({ userId }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Đang tải gợi ý...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!recommendedBooks || recommendedBooks.length === 0) return <div>Không có sách gợi ý.</div>;

  return (
    <div className="recommendation-section">
      <h3>Sách gợi ý cho bạn</h3>
      <div className="book-list">
        {recommendedBooks.map(book => (
          <div key={book._id} className="book-item">
            <img src={book.img || 'https://placehold.co/80x80'} alt={book.title} style={{ width: '80px', height: '80px' }} />
            <p><strong>{book.title}</strong></p>
            <p>{book.author}</p>
            <p>{book.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;