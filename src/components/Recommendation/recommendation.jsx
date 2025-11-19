// components/Recommendation/Recommendation.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import * as ProductService from '../../services/ProductService';
import * as RecomendService from '../../services/RecommendService';
import './recommendation.css';

const Recommendation = ({ userId }) => {
  const [combos, setCombos] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await RecomendService.getRecommend(userId);
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

  if (loading || combos.length === 0) return null;

  return (
    <div className="recommendation-master">
      {combos.map((combo, index) => (
        <div key={index} className="combo-section">
          <div className="combo-header">
            <h3 className="combo-title">{combo.title}</h3>
            <p className="combo-reason">{combo.reason}</p>
          </div>

          <div className="combo-books">
            {combo.book_ids.map((bookId) => {
              const book = allBooks.find(b => b._id === bookId || b._id.toString() === bookId);
              if (!book) return null;

              return (
                <div key={book._id} className="book-card-wrapper">
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