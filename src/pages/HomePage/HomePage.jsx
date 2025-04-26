import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/img/img1.png';
import img2 from '../../assets/img/img2.png';
import CardComponent from '../../components/CardComponent/CardComponent';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import * as CategoryService from '../../services/CategoryService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as ProductService from '../../services/ProductService';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import Recommendation from '../../components/Recommendation/recommendation';
import { useDispatch, useSelector } from 'react-redux';

const HomePage = () => {
  const navigate = useNavigate();
  const [newBooks, setNewBooks] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [visibleNewBooks, setVisibleNewBooks] = useState(5);
  const [visibleBestSeller, setVisibleBestSeller] = useState(5);
  const user = useSelector(state => state.user); // Thay state.user bằng cách bạn lưu user trong Redux
  const userId = user?.id || null; // Lấy userId từ Redux
  
   console.log('User ID in HomePage:', userId);
  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
      return res.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi gọi API:', error);
    }
  };

  const { isLoading: isLoadingPro, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProduct(),
  });

  const handleOnClickProduct = async (id) => {
    await ProductService.updateView(id);
    navigate(`/product-detail/${id}`);
  };

  const getAllCategory = async () => {
    try {
      const res = await CategoryService.getAllCategory();
      return res.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi gọi API:', error);
    }
  };

  const { isLoading: isLoadingCate, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategory(),
  });

  const handleCategoryClick = (category) => {
    navigate('/category', { state: { selectedCategory: category._id } });
  };

  useEffect(() => {
    const fetchNewBooks = async () => { // Thêm async
      try {
        const params = {
          limit: 10,
          page: 0,
          sort: ["createdAt", "desc"],
        };
        const products = await ProductService.getAllProductBySort(params);
        setNewBooks(products.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchNewBooks();
  }, []);

  useEffect(() => {
    const fetchBestSeller = async () => { // Thêm async
      try {
        const params = {
          limit: 10,
          page: 0,
          sort: ["sold", "desc"],
        };
        const products = await ProductService.getAllProductBySort(params);
        setBestSeller(products.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBestSeller();
  }, []);

  const loadMoreNewBooks = () => {
    navigate('/newbook');
  };

  const loadMoreBestSeller = () => {
    navigate('/bookpurchasingtrend');
  };

  const newBookInfo = (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
      {newBooks.slice(0, visibleNewBooks).map((product) => (
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
      {newBooks.length > visibleNewBooks && (
        <div className="w-100 text-center mt-4">
          <ButtonComponent2
            textButton="Xem thêm"
            onClick={loadMoreNewBooks}
          />
        </div>
      )}
    </div>
  );

  const bookPurchasingTrendInfo = (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
      {bestSeller.slice(0, visibleBestSeller).map((product) => (
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
      {bestSeller.length > visibleBestSeller && (
        <div className="w-100 text-center mt-4">
          <ButtonComponent2
            textButton="Xem thêm"
            onClick={loadMoreBestSeller}
          />
        </div>
      )}
    </div>
  );

  const catagoryInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
        {isLoadingCate ? (
          <LoadingComponent />
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <MiniCardComponent
              key={category._id}
              img={category.img}
              content={category.name}
              onClick={() => handleCategoryClick(category)}
            />
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              Không có dữ liệu để hiển thị.
            </td>
          </tr>
        )}
      </div>
    </>
  );

  const allBooks = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
        {isLoadingPro ? (
          <LoadingComponent />
        ) : products && products.length > 0 ? (
          products.map((product) => (
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
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              Không có dữ liệu để hiển thị.
            </td>
          </tr>
        )}
      </div>
    </>
  );

  const getAllPublisher = async () => {
    const res = await PublisherService.getAllPublisher();
    return res.data;
  };

  const { isLoading: isLoadingPublisher, data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: getAllPublisher,
  });

  const handlePublisherClick = (publisher) => {
    navigate('/category', { state: { selectedPublisher: publisher._id } });
  };

  const publisherInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
        {isLoadingPublisher ? (
          <LoadingComponent isLoading={isLoadingPublisher} />
        ) : publishers && publishers.length > 0 ? (
          publishers.map((publisher) => (
            <MiniCardComponent
              key={publisher._id}
              img={publisher.img}
              content={publisher.name}
              onClick={() => handlePublisherClick(publisher)}
            />
          ))
        ) : (
          <div className="text-center">
            Không có dữ liệu để hiển thị.
          </div>
        )}
      </div>
    </>
  );

  const recommendationInfo = (
    <Recommendation userId={userId} />
  );

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container">
          <div>
            <SliderComponent arrImages={[img1, img2]} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '50px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
        <div className="container">
          <CardComponent
            title="Danh mục"
            bodyContent={catagoryInfo}
            icon="bi bi-ui-checks-grid"
          />
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container" style={{ marginTop: '50px' }}>
          <CardComponent
            title="Xu hướng mua sách"
            bodyContent={bookPurchasingTrendInfo}
            icon="bi bi-graph-up-arrow"
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container" style={{ marginTop: '50px' }}>
          <CardComponent
            title="Sách gợi ý cho bạn"
            bodyContent={recommendationInfo}
            icon="bi bi-heart"
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container" style={{ marginTop: '50px' }}>
          <CardComponent
            title="Sách mới"
            bodyContent={newBookInfo}
            icon="bi bi-book"
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '50px', marginBottom: '50px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
        <div className="container">
          <CardComponent
            title="Nhà xuất bản"
            bodyContent={publisherInfo}
            icon="bi bi-pen"
          />
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
      </div>
    </div>
  );
};

export default HomePage;