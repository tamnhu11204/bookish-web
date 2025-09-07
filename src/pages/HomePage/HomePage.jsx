import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/img/img1.png';
import img2 from '../../assets/img/img2.png';
import iconBooks from '../../assets/img/about_icon_1.webp';
import iconStore from '../../assets/img/about_icon_2.webp';
import iconPromo from '../../assets/img/about_icon_3.webp';
import iconCare from '../../assets/img/about_icon_4.webp';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import CardComponent from '../../components/CardComponent/CardComponent';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent';
import Recommendation from '../../components/Recommendation/recommendation';
import * as AuthorService from '../../services/AuthorService';
import * as CategoryService from '../../services/CategoryService';
import * as HomePageConfigService from '../../services/HomepageConfigService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as ProductService from '../../services/ProductService';
import * as FeedbackService from '../../services/FeedbackService';
import './HomePage.css';

const TestimonialCard = ({ feedback, colorClass }) => {
  return (
    <div className={`testimonial-card ${colorClass}`}>
      <div className="testimonial-content-wrapper">
        <div className="testimonial-image-wrapper">
          <img src={feedback.img} alt="Feedback" className="testimonial-image" />
        </div>
        <div className="testimonial-text-wrapper">
          <p className="testimonial-text">"{feedback.content}"</p>
        </div>
      </div>
    </div>
  );
};

const AuthorCard = ({ author }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Lấy sản phẩm của tác giả để hiển thị khi hover
  const { data: authorProductsData } = useQuery({
    queryKey: ['products_for_author_card', author._id],
    queryFn: () => ProductService.getAllProductBySort({
      limit: 5,
      filter: ['author', author._id]
    }),
    staleTime: 1000 * 60 * 5,
    enabled: isHovered,
  });

  const products = authorProductsData?.data || [];
  const totalProducts = authorProductsData?.total || 0;

  const handleNavigate = () => {
    navigate(`/author/${author.slug || author._id}`);
  };

  return (
    <div
      className="author-showcase-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="author-portrait-wrapper" onClick={handleNavigate}>
        <img src={author.img} alt={author.name} className="author-portrait" />

        <div className="book-stack-on-portrait">
          <div className="book-counter-card">
            <span>{totalProducts}+</span>
          </div>

          {products.slice(0, 3).map((product, index) => (
            <img
              key={product._id}
              src={product.img[0]}
              alt={product.name}
              className={`stacked-book-cover book-cover-${index}`}
            />
          ))}
        </div>
      </div>

      <div className="author-name-below">
        <h4>{author.name}</h4>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [newBooks, setNewBooks] = useState([]);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const user = useSelector(state => state.user);
  const userId = user?.id || null;
  const isAdmin = user?.isAdmin === true;
  const access_token = user?.access_token;

  const [currentPublisherIndex, setCurrentPublisherIndex] = useState(0);
  const publishersPerPage = 5;

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const categoriesPerPage = 5;

  // State cho editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editBannerImage1, setEditBannerImage1] = useState(null);
  const [editBannerImage2, setEditBannerImage2] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});

  // State cho chức năng xem thêm/thu gọn
  const [expanded, setExpanded] = useState(false);

  const queryClient = useQueryClient();

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialsPerPage = 3;

  const { data: feedbacks = [], isLoading: isLoadingFeedbacks } = useQuery({
    queryKey: ['allFeedbacksForHomepage'],
    queryFn: () => FeedbackService.getAllFeedback(),
    select: (data) => {
      if (!data?.data) return [];
      const filtered = data.data.filter(fb => fb.star === 5 && (fb.img && fb.img !== ''));
      const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sorted.slice(0, 10);
    },
    staleTime: 1000 * 60 * 5,
  });

  const handlePrevTestimonial = () => {
    setTestimonialIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNextTestimonial = () => {
    if (testimonialIndex + testimonialsPerPage < feedbacks.length) {
      setTestimonialIndex(prev => prev + 1);
    }
  };

  const [authorSliderIndex, setAuthorSliderIndex] = useState(0);
  const authorsPerPage = 5;

  const { data: allAuthorsData, isLoading: isLoadingAllAuthors } = useQuery({
    queryKey: ['allAuthorsForSlider'],
    queryFn: () => AuthorService.getAllAuthor(),
  });

  const allAuthors = allAuthorsData?.data || [];

  const handlePrevAuthor = () => {
    setAuthorSliderIndex(prev => Math.max(prev - authorsPerPage, 0));
  };

  const handleNextAuthor = () => {
    if (authorSliderIndex + authorsPerPage < allAuthors.length) {
      setAuthorSliderIndex(prev => prev + authorsPerPage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Lấy config từ API
  const { data: config, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['homepageConfig'],
    queryFn: async () => (await HomePageConfigService.getConfig()).data,
  });

  useEffect(() => {
    if (config) {
      setEditFormData(config);
      setInitialFormData(config);
    }
  }, [config]);

  const handleOnClickProduct = async (id) => {
    await ProductService.updateView(id);
    navigate(`/product-detail/${id}`);
  };

  const { isLoading: isLoadingCate, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await CategoryService.getAllCategory()).data,
  });

  const handleCategoryClick = (category) => {
    navigate('/category', { state: { selectedCategory: category._id } });
  };

  useEffect(() => {
    const fetchNewBooks = async () => {
      const params = { limit: 10, page: 0, sort: ["createdAt", "desc"] };
      const products = await ProductService.getAllProductBySort(params);
      setNewBooks(products.data);
    };
    fetchNewBooks();
  }, []);

  const loadMoreNewBooks = () => navigate('/newbook');

  const newBookInfo = (
    <div className="d-flex flex-wrap justify-content-center gap-3">
      {newBooks.slice(0, 5).map((product) => (
        <CardProductComponent
          key={product._id}
          {...product}
          img={product.img[0]}
          onClick={() => handleOnClickProduct(product._id)}
          currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
          proName={product.name}
          sold={product.sold}
          star={product.star}
          feedbackCount={product.feedbackCount}
          view={product.view}
        />
      ))}
      {newBooks.length > 5 && (
        <div className="view-more-container">
          <ButtonComponent2 textButton="Xem thêm" onClick={loadMoreNewBooks} />
        </div>
      )}
    </div>
  );

  const handlePrevCategory = () => setCurrentCategoryIndex(prev => Math.max(prev - categoriesPerPage, 0));
  const handleNextCategory = () => {
    const parentCategories = categories.filter(c => c.parent === null);
    if ((currentCategoryIndex + categoriesPerPage) < parentCategories.length) {
      setCurrentCategoryIndex(prev => prev + categoriesPerPage);
    }
  };

  const parentCategories = categories ? categories.filter(c => c.parent === null) : [];
  const catagoryInfo = (
    <div className="slider-container">
      {parentCategories.length > categoriesPerPage && (
        <button onClick={handlePrevCategory} disabled={currentCategoryIndex === 0} className="slider-nav-button prev">
          <i className="bi bi-chevron-left"></i>
        </button>
      )}
      <div className="slider-content">
        {isLoadingCate ? <LoadingComponent /> : parentCategories.length > 0 ? (
          parentCategories.slice(currentCategoryIndex, currentCategoryIndex + categoriesPerPage).map((category) => (
            <MiniCardComponent key={category._id} {...category} content={category.name} onClick={() => handleCategoryClick(category)} />
          ))
        ) : (
          <div className="no-data-text">Không có dữ liệu để hiển thị.</div>
        )}
      </div>
      {parentCategories.length > categoriesPerPage && (
        <button onClick={handleNextCategory} disabled={(currentCategoryIndex + categoriesPerPage) >= parentCategories.length} className="slider-nav-button next">
          <i className="bi bi-chevron-right"></i>
        </button>
      )}
    </div>
  );

  const { isLoading: isLoadingPublisher, data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => (await PublisherService.getAllPublisher()).data,
  });

  const handlePublisherClick = (publisher) => navigate('/category', { state: { selectedPublisher: publisher._id } });
  const handlePrevPublisher = () => setCurrentPublisherIndex(prev => Math.max(prev - publishersPerPage, 0));
  const handleNextPublisher = () => {
    if ((currentPublisherIndex + publishersPerPage) < publishers.length) {
      setCurrentPublisherIndex(prev => prev + publishersPerPage);
    }
  };

  const publisherInfo = (
    <div className="slider-container">
      {publishers && publishers.length > publishersPerPage && (
        <button onClick={handlePrevPublisher} disabled={currentPublisherIndex === 0} className="slider-nav-button prev">
          <i className="bi bi-chevron-left"></i>
        </button>
      )}
      <div className="slider-content">
        {isLoadingPublisher ? <LoadingComponent /> : publishers && publishers.length > 0 ? (
          publishers.slice(currentPublisherIndex, currentPublisherIndex + publishersPerPage).map((publisher) => (
            <MiniCardComponent key={publisher._id} {...publisher} content={publisher.name} onClick={() => handlePublisherClick(publisher)} />
          ))
        ) : (
          <div className="no-data-text">Không có dữ liệu để hiển thị.</div>
        )}
      </div>
      {publishers && publishers.length > publishersPerPage && (
        <button onClick={handleNextPublisher} disabled={(currentPublisherIndex + publishersPerPage) >= publishers.length} className="slider-nav-button next">
          <i className="bi bi-chevron-right"></i>
        </button>
      )}
    </div>
  );

  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => (await AuthorService.getAllAuthor()).data,
  });

  const { data: featuredAuthor, isLoading: isLoadingFeaturedAuthor } = useQuery({
    queryKey: ['featuredAuthor', config?.featuredAuthorId],
    queryFn: async () => (await AuthorService.getDetailAuthor(config.featuredAuthorId._id)).data,
    enabled: !!config?.featuredAuthorId,
  });

  const { data: authorProducts, isLoading: isLoadingAuthorProducts } = useQuery({
    queryKey: ['products', 'author', config?.featuredAuthorId],
    queryFn: async () => {
      const params = {
        limit: 4,
        page: 0,
        filter: ['author', config.featuredAuthorId._id]
      };
      const res = await ProductService.getAllProductBySort(params);
      return res.data;
    },
    enabled: !!config?.featuredAuthorId,
  });


  const updateMutation = useMutation({
    mutationFn: async ({ data, token }) => {
      return await HomePageConfigService.updateConfig(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['homepageConfig']);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật:", error);
    }
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (field === 'bannerImage1') setEditBannerImage1(file);
    if (field === 'bannerImage2') setEditBannerImage2(file);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editFormData).forEach(key => {
      if (key === 'featuredAuthorId' && typeof editFormData[key] === 'object' && editFormData[key] !== null) {
        formData.append(key, editFormData[key]._id);
      } else if (editFormData[key] !== null && editFormData[key] !== undefined) {
        formData.append(key, editFormData[key]);
      }
    });
    if (editBannerImage1) formData.append('bannerImage1', editBannerImage1);
    if (editBannerImage2) formData.append('bannerImage2', editBannerImage2);

    updateMutation.mutate({ data: formData, token: access_token });
  };
  const handleCancelEdit = () => {
    setEditFormData(initialFormData);
    setEditBannerImage1(null);
    setEditBannerImage2(null);
    setIsEditing(false);
  };

  const features = [
    { key: 1, icon: iconBooks, defaultTitle: 'Đa dạng đầu sách' },
    { key: 2, icon: iconStore, defaultTitle: 'Không gian thân thiện' },
    { key: 3, icon: iconPromo, defaultTitle: 'Khuyến mãi hấp dẫn' },
    { key: 4, icon: iconCare, defaultTitle: 'DVKH tận tâm' },
  ];

  if (isLoadingConfig) return <LoadingComponent />;

  return (
    <div className="homepage-container">
      {isAdmin && !isEditing && (
        <button className="edit-page-button" onClick={() => setIsEditing(true)}>
          <i className="bi bi-pencil"></i> Chỉnh sửa Trang
        </button>
      )}

      <section className="hero-banner" style={{ backgroundImage: `url(${editBannerImage2 ? URL.createObjectURL(editBannerImage2) : (config?.bannerImage2 || img2)})` }}>
        {isEditing && (
          <div className="image-upload-overlay">
            <label htmlFor="bannerImage2-upload">Thay đổi ảnh bìa <i className="bi bi-upload"></i></label>
            <input id="bannerImage2-upload" type="file" onChange={(e) => handleImageChange(e, 'bannerImage2')} style={{ display: 'none' }} />
          </div>
        )}
        <div className="hero-text-content">
          {isEditing ? (
            <input className="inline-edit-input h1-input" name="bannerTextLine1" value={editFormData.bannerTextLine1 || ''} onChange={handleEditChange} />
          ) : (
            <h1 className={isTextVisible ? 'visible' : ''}>{config?.bannerTextLine1 || 'Bookish'}</h1>
          )}
          {isEditing ? (
            <input className="inline-edit-input p-input" name="bannerTextLine2" value={editFormData.bannerTextLine2 || ''} onChange={handleEditChange} />
          ) : (
            <p className={isTextVisible ? 'visible' : ''}>{config?.bannerTextLine2 || 'Mở sách - Mở thế giới'}</p>
          )}
        </div>
        <div className="wave-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.3-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,122.49,0,184.82,15.7,63.45,15.94,130.33,27.14,202.38,22.73,81.91-4.89,155.91-22.12,232.35-42.57V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      <section className="section-wrapper about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src={editBannerImage1 ? URL.createObjectURL(editBannerImage1) : (config?.bannerImage1 || img1)} alt="Về Bookish" />
              {isEditing && (
                <div className="image-upload-overlay">
                  <label htmlFor="bannerImage1-upload">Thay đổi ảnh <i className="bi bi-upload"></i></label>
                  <input id="bannerImage1-upload" type="file" onChange={(e) => handleImageChange(e, 'bannerImage1')} style={{ display: 'none' }} />
                </div>
              )}
            </div>
            <div className="about-content">
              {isEditing ? (
                <input className="inline-edit-input h2-input" name="aboutSectionTitle" value={editFormData.aboutSectionTitle || ''} onChange={handleEditChange} />
              ) : (
                <h2>{config?.aboutSectionTitle || 'Về Bookish'}</h2>
              )}
              {isEditing ? (
                <textarea className="inline-edit-textarea" name="aboutSectionParagraph" value={editFormData.aboutSectionParagraph || ''} onChange={handleEditChange} />
              ) : (
                <p>{config?.aboutSectionParagraph}</p>
              )}

              <div className="feature-grid">
                {features.map(feature => (
                  <div className="feature-item" key={feature.key}>
                    {/* Thêm thẻ img cho icon */}
                    <img src={feature.icon} alt={feature.defaultTitle} className="feature-icon" />

                    <div className="feature-text-content">
                      {isEditing ? (
                        <>
                          <input
                            className="inline-edit-input h3-input"
                            name={`feature${feature.key}Title`}
                            value={editFormData[`feature${feature.key}Title`] || ''}
                            onChange={handleEditChange}
                          />
                          <textarea
                            className="inline-edit-textarea p-input"
                            name={`feature${feature.key}Text`}
                            value={editFormData[`feature${feature.key}Text`] || ''}
                            onChange={handleEditChange}
                          />
                        </>
                      ) : (
                        <>
                          <h3>{config?.[`feature${feature.key}Title`] || feature.defaultTitle}</h3>
                          <p>{config?.[`feature${feature.key}Text`]}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-wrapper"> <div className="container"> <CardComponent title="Thể loại nổi bật" bodyContent={catagoryInfo} icon="bi bi-ui-checks-grid" /> </div> </div>
      <div className="section-wrapper"> <div className="container"> <CardComponent title="Sách gợi ý cho bạn" bodyContent={<Recommendation userId={userId} />} icon="bi bi-heart" /> </div> </div>
      <div className="section-wrapper"> <div className="container"> <CardComponent title="Sách mới" bodyContent={newBookInfo} icon="bi bi-book" /> </div> </div>

      {isLoadingAuthors || isLoadingFeaturedAuthor ? (<LoadingComponent />) : featuredAuthor && (
        <section className="section-wrapper featured-author-section">
          <div className="container">
            {isEditing && (
              <div className="featured-author-edit">
                <label>Chọn Tác Giả Nổi Bật:</label>
                <select name="featuredAuthorId" value={editFormData.featuredAuthorId?._id || editFormData.featuredAuthorId} onChange={handleEditChange}>
                  {authors?.map(author => (
                    <option key={author._id} value={author._id}>{author.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="text-featured-author section-header-left">
              <i class="bi bi-stars"></i>
              <p >Tác giả nổi bật</p>
              <i class="bi bi-stars"></i>
              <div className="header-line"></div>
            </div>
            <div className="featured-author-grid">
              <div className="author-bio">
                <h2>{featuredAuthor.name}</h2>
                <div
                  className={`bio-text ${expanded ? 'expanded' : ''}`}
                  dangerouslySetInnerHTML={{ __html: featuredAuthor.info }}
                />
                <ButtonComponent2
                  textButton={expanded ? "Thu gọn" : "Xem thêm"}
                  onClick={() => setExpanded(!expanded)}
                />
              </div>
              <div className="author-image-decorated">
                <img src={featuredAuthor.img} alt={featuredAuthor.name} />
                <div className="author-image-info">
                  <h3>Tác giả</h3>
                  <h2>{featuredAuthor.name}</h2>
                </div>
              </div>
              <div className="author-products">
                {isLoadingAuthorProducts ? (<LoadingComponent />) : (
                  authorProducts?.map(product => (
                    <CardProductComponent
                      key={product._id}
                      {...product}
                      img={product.img[0]}
                      onClick={() => handleOnClickProduct(product._id)}
                      currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
                      proName={product.name}
                      sold={product.sold}
                      star={product.star}
                      feedbackCount={product.feedbackCount}
                      view={product.view}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-wrapper featured-authors-section">
        <div className="container">
          {isLoadingAllAuthors ? (
            <LoadingComponent />
          ) : (
            <div className="slider-container">
              {allAuthors.length > authorsPerPage && (
                <button
                  className="slider-nav-button prev"
                  onClick={handlePrevAuthor}
                  disabled={authorSliderIndex === 0}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              )}

              <div className="slider-content">
                {allAuthors.slice(authorSliderIndex, authorSliderIndex + authorsPerPage).map(author => (
                  <AuthorCard key={author._id} author={author} />
                ))}
              </div>

              {allAuthors.length > authorsPerPage && (
                <button
                  className="slider-nav-button next"
                  onClick={handleNextAuthor}
                  disabled={authorSliderIndex + authorsPerPage >= allAuthors.length}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section-wrapper testimonials-section">
        <div className="container">
          <div className="text-featured-fb section-header-left-fb">
            <i class="bi bi-stars"></i>
            <p >Khách hàng nói gì về Bookish</p>
            <i class="bi bi-stars"></i>
            <div className="header-line-fb"></div>
          </div>

          {isLoadingFeedbacks ? (
            <LoadingComponent />
          ) : feedbacks.length > 0 ? (
            <div className="testimonial-slider">
              <button
                className="slider-nav-button prev"
                onClick={handlePrevTestimonial}
                disabled={testimonialIndex === 0}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <div className="testimonial-slider-content">
                <div
                  className="testimonial-slider-track"
                  style={{ transform: `translateX(-${testimonialIndex * (100 / testimonialsPerPage)}%)` }}
                >
                  {feedbacks.map((feedback, index) => (
                    <TestimonialCard
                      key={feedback._id}
                      feedback={feedback}
                      colorClass={index % 2 === 0 ? 'color-1' : 'color-2'}
                    />
                  ))}
                </div>
              </div>
              <button
                className="slider-nav-button next"
                onClick={handleNextTestimonial}
                disabled={testimonialIndex + testimonialsPerPage >= feedbacks.length}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          ) : (
            <p className="text-center">Chưa có đánh giá nào nổi bật.</p>
          )}
        </div>
      </section>

      <div className="section-wrapper"> <div className="container">
        <CardComponent title="Nhà xuất bản" bodyContent={publisherInfo} icon="bi bi-pen" /> </div>
      </div>

      {isEditing && (
        <div className="edit-actions-footer">
          <button className="save-button" onClick={handleSubmitEdit}>
            <i className="bi bi-check-circle"></i> Lưu Thay Đổi
          </button>
          <button className="cancel-button" onClick={handleCancelEdit}>
            <i className="bi bi-x-circle"></i> Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;