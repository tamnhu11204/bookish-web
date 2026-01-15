import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import CardComponent from '../../components/CardComponent2/CardComponent2';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as AuthorService from '../../services/AuthorService';
import * as CategoryService from '../../services/CategoryService';
import * as FormatService from '../../services/OptionService/FormatService';
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as ProductService from '../../services/ProductService';
import CategoryTab from '../AdminPage/CategoryTab';
import ProductTab from '../AdminPage/ProductTab';
import './CatagoryPage.css';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { debounce } from 'lodash';

const CatagoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState('');
  const [openedCategories, setOpenedCategories] = useState([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [isManagingPromotions, setIsManagingPromotions] = useState(false);
  const user = useSelector(state => state.user);
  const isAdmin = user?.isAdmin === true;
  const [selectedAdminCategoryId, setSelectedAdminCategoryId] = useState(null);

  // Lấy searchResults và searchQuery từ state
  const { searchResults = [], searchQuery = '' } = location.state || {};
  console.log('Search results in CatagoryPage:', searchResults); // Thêm dòng này
  console.log('Search query in CatagoryPage:', searchQuery);

  // Debounce author search
  const debouncedSetAuthorSearch = debounce(setAuthorSearch, 300);

  // Lấy tất cả danh mục, nhà xuất bản, tác giả, ngôn ngữ, hình thức
  const { isLoading: isLoadingCategory, data: categoryTree } = useQuery({
    queryKey: ['categoryTree'],
    queryFn: async () => {
      const res = await CategoryService.getTreeCategory();
      return res.data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await CategoryService.getAllCategory();
      return res.data;
    }
  });

  const AllCategory = Array.isArray(categories)
    ? categories.map(categorie => ({
      value: categorie._id,
      label: categorie.name
    }))
    : [];

  const { isLoading: isLoadingPublisher, data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const res = await PublisherService.getAllPublisher();
      return res.data;
    }
  });

  const AllPub = Array.isArray(publishers)
    ? publishers.map(publisher => ({
      value: publisher._id,
      label: publisher.name
    }))
    : [];

  const { isLoading: isLoadingAuthor, data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await AuthorService.getAllAuthor();
      return res.data;
    }
  });

  const AllAuthors = Array.isArray(authors)
    ? authors.map(author => ({
      value: author._id,
      label: author.name
    }))
    : [];

  const filteredAuthors = AllAuthors.filter(author =>
    author.label.toLowerCase().includes(authorSearch.toLowerCase())
  );

  const { isLoading: isLoadingLanguage, data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const res = await LanguageService.getAllLanguage();
      return res.data;
    }
  });

  const AllLanguages = Array.isArray(languages)
    ? languages.map(language => ({
      value: language._id,
      label: language.name
    }))
    : [];

  const { isLoading: isLoadingFormat, data: formats } = useQuery({
    queryKey: ['formats'],
    queryFn: async () => {
      const res = await FormatService.getAllFormat();
      return res.data;
    }
  });

  const AllFormat = Array.isArray(formats)
    ? formats.map(format => ({
      value: format._id,
      label: format.name
    }))
    : [];

  // Nhận danh mục/nhà xuất bản từ state
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategories([location.state.selectedCategory]);
    }
    if (location.state?.selectedPublisher) {
      setSelectedPublishers([location.state.selectedPublisher]);
    }
  }, [location.state]);

  // Hàm lấy tất cả ID danh mục con
  const getAllCategoryIds = (categories, selectedIds) => {
    if (!categories || !selectedIds?.length) return selectedIds || [];
    const allIds = new Set(selectedIds);
    const traverse = cats => {
      cats.forEach(cat => {
        if (selectedIds.includes(cat._id)) {
          allIds.add(cat._id);
          if (cat.children && cat.children.length > 0) {
            cat.children.forEach(child => allIds.add(child._id));
            traverse(cat.children);
          }
        } else if (cat.children) {
          traverse(cat.children);
        }
      });
    };
    traverse(categories);
    return Array.from(allIds);
  };

  // Toggle mở/đóng category
  const toggleCategory = categoryId => {
    setOpenedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Render danh mục dạng cây
  const renderCategoryTree = (categories, level = 0) => {
    return categories.map(cat => (
      <div key={cat._id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="form-check flex-grow-1">
            <input
              className="form-check-input"
              type="checkbox"
              value={cat._id}
              id={`category-${cat._id}`}
              checked={selectedCategories.includes(cat._id)}
              onChange={() => handleCategoryChange(cat._id)}
            />
            <label className="form-check-label" htmlFor={`category-${cat._id}`}>
              {cat.name}
            </label>
          </div>
          {cat.children && cat.children.length > 0 && (
            <span
              onClick={() => toggleCategory(cat._id)}
              className="plus_minus"
            >
              {openedCategories.includes(cat._id) ? '-' : '+'}
            </span>
          )}
        </div>
        {cat.children &&
          openedCategories.includes(cat._id) &&
          renderCategoryTree(cat.children, level + 1)}
      </div>
    ));
  };

  // Xử lý sự kiện
  const handleCategoryChange = categoryValue => {
    setSelectedCategories(prev =>
      prev.includes(categoryValue)
        ? prev.filter(value => value !== categoryValue)
        : [...prev, categoryValue]
    );
    setSelectAllCategories(false);
    setCurrentPage(1);
  };

  const handlePublisherChange = publisherValue => {
    setSelectedPublishers(prev =>
      prev.includes(publisherValue)
        ? prev.filter(value => value !== publisherValue)
        : [...prev, publisherValue]
    );
    setCurrentPage(1);
  };

  const handleAuthorChange = authorValue => {
    setSelectedAuthors(prev =>
      prev.includes(authorValue)
        ? prev.filter(value => value !== authorValue)
        : [...prev, authorValue]
    );
    setCurrentPage(1);
  };

  const handleLanguageChange = languageValue => {
    setSelectedLanguages(prev =>
      prev.includes(languageValue)
        ? prev.filter(value => value !== value)
        : [...prev, languageValue]
    );
    setCurrentPage(1);
  };

  const handleFormatChange = formatValue => {
    setSelectedFormats(prev =>
      prev.includes(formatValue)
        ? prev.filter(value => value !== formatValue)
        : [...prev, formatValue]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = range => {
    const rangeStr = `${range[0]}-${range[1] === Infinity ? 'Infinity' : range[1]}`;
    setSelectedPriceRanges(prev =>
      prev.includes(rangeStr)
        ? prev.filter(r => r !== rangeStr)
        : [...prev, rangeStr]
    );
    setCurrentPage(1);
  };

  const handleSelectAllCategoriesChange = () => {
    if (!selectAllCategories) {
      const allCategoryValues = AllCategory.map(category => category.value);
      setSelectedCategories(allCategoryValues);
    } else {
      setSelectedCategories([]);
    }
    setSelectAllCategories(!selectAllCategories);
    setCurrentPage(1);
  };

  const removeFilter = (type, value) => {
    switch (type) {
      case 'category':
        setSelectedCategories(prev => prev.filter(v => v !== value));
        break;
      case 'price':
        setSelectedPriceRanges(prev => prev.filter(v => v !== value));
        break;
      case 'author':
        setSelectedAuthors(prev => prev.filter(v => v !== value));
        break;
      case 'publisher':
        setSelectedPublishers(prev => prev.filter(v => v !== value));
        break;
      case 'language':
        setSelectedLanguages(prev => prev.filter(v => v !== value));
        break;
      case 'format':
        setSelectedFormats(prev => prev.filter(v => v !== value));
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const handleSortChange = sortValue => {
    setSelectedSort(sortValue);
    setCurrentPage(1);
  };

  // Xóa kết quả tìm kiếm
  const clearSearchResults = () => {
    navigate('/category', { state: {} }); // Xóa state
    setCurrentPage(1);
  };

  // API call
  const getFilteredProducts = async () => {
    const allCategoryIds = getAllCategoryIds(categoryTree, selectedCategories);
    const filters = {
      categories: allCategoryIds,
      publishers: selectedPublishers,
      authors: selectedAuthors,
      languages: selectedLanguages,
      formats: selectedFormats,
      priceRanges: selectedPriceRanges
    };
    const sort = selectedSort ? [selectedSort.split('-')[0], selectedSort.split('-')[1]] : null;
    const params = new URLSearchParams({
      limit: productsPerPage,
      page: currentPage,
      sort: sort ? JSON.stringify(sort) : '',
      filters: JSON.stringify(filters)
    });
    const res = await ProductService.getAllProduct(`?${params.toString()}`);
    setTotalPages(res.totalPage);
    return res.data;
  };

  const { isLoading: isLoadingPro, data: products } = useQuery({
    queryKey: [
      'products',
      currentPage,
      selectedCategories,
      selectedPublishers,
      selectedAuthors,
      selectedLanguages,
      selectedFormats,
      selectedPriceRanges,
      selectedSort
    ],
    queryFn: getFilteredProducts,
    enabled: !searchResults.length // Chỉ gọi API nếu không có searchResults
  });

  const handleOnClickProduct = id => {
    navigate(`/product-detail/${id}`);
  };

  const displayProducts = searchResults.length > 0 ? searchResults : products || [];
  const paginatedProducts = useMemo(() => displayProducts, [displayProducts]);

  const maxVisible = 5;
  const pageNumbers = [];
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push('...');
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push('...');
    if (endPage < totalPages) pageNumbers.push(totalPages);
  }

  const paginationButtons = (
    <div className="pagination-category d-flex justify-content-center gap-2" style={{ marginBottom: "30px" }}>
      {currentPage > 1 && (
        <ButtonComponent2
          textButton="Trước"
          onClick={() => setCurrentPage(currentPage - 1)}
        />
      )}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <ButtonComponent2 key={`ellipsis-${index}`} textButton="..." />;
        }
        const pageNumber = page;
        const isActive = currentPage === pageNumber;
        return isActive ? (
          <ButtonComponent
            key={pageNumber}
            textButton={String(pageNumber)}
            onClick={() => setCurrentPage(pageNumber)}
          />
        ) : (
          <ButtonComponent2
            key={pageNumber}
            textButton={String(pageNumber)}
            onClick={() => setCurrentPage(pageNumber)}
          />
        );
      })}
      {currentPage < totalPages && (
        <ButtonComponent2
          textButton="Tiếp theo"
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      )}
    </div>
  );

  const BookInfo = (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
      {isLoadingPro && !searchResults.length ? (
        <LoadingComponent />
      ) : paginatedProducts.length > 0 ? (
        paginatedProducts
          .filter(product => product.isDeleted !== true)
          .map(product => (
            <CardProductComponent
              key={product._id}
              id={product._id}
              img={product.img?.[0] || ''} // Đảm bảo img không undefined
              proName={product.name}
              currentPrice={((product.price * (100 - (product.discount || 0))) / 100).toLocaleString()}
              originalPrice={product.price}
              sold={product.sold}
              star={product.star}
              feedbackCount={product.feedbackCount}
              onClick={() => handleOnClickProduct(product._id)}
              view={product.view}
              stock={product.stock}
              discount={product.discount}
            />
          ))
      ) : (
        <div>Không có sản phẩm nào để hiển thị.</div>
      )}
    </div>
  );

  const selectedFiltersDisplay = (
    <div className="selected-filters mb-3">
      {searchQuery && (
        <span className="badge bg-primary me-2">
          Tìm kiếm: {searchQuery.length > 10 ? searchQuery.substring(0, 10) + '...' : searchQuery}
          <button type="button" onClick={clearSearchResults}>×</button>
        </span>
      )}
      {selectedCategories.map(id => {
        const label = AllCategory.find(c => c.value === id)?.label || 'Unknown Category';
        return (
          <span key={`cat-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('category', id)}>×</button>
          </span>
        );
      })}
      {selectedPriceRanges.map(range => {
        const displayRange = range.replace('-', 'đ - ').replace('Infinity', 'trở lên') + 'đ';
        return (
          <span key={`price-${range}`} className="badge bg-secondary me-2">
            Giá {displayRange} <button type="button" onClick={() => removeFilter('price', range)}>×</button>
          </span>
        );
      })}
      {selectedAuthors.map(id => {
        const label = AllAuthors.find(a => a.value === id)?.label || 'Unknown Author';
        return (
          <span key={`auth-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('author', id)}>×</button>
          </span>
        );
      })}
      {selectedPublishers.map(id => {
        const label = AllPub.find(p => p.value === id)?.label || 'Unknown Publisher';
        return (
          <span key={`pub-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('publisher', id)}>×</button>
          </span>
        );
      })}
      {selectedLanguages.map(id => {
        const label = AllLanguages.find(l => l.value === id)?.label || 'Unknown Language';
        return (
          <span key={`lang-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('language', id)}>×</button>
          </span>
        );
      })}
      {selectedFormats.map(id => {
        const label = AllFormat.find(f => f.value === id)?.label || 'Unknown Format';
        return (
          <span key={`fmt-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('format', id)}>×</button>
          </span>
        );
      })}
    </div>
  );

  const sortButtons = (
    <div className="sort-buttons d-flex gap-2 mb-3 flex-wrap">
      {[
        { value: 'name-asc', label: 'Tên A-Z' },
        { value: 'name-desc', label: 'Tên Z-A' },
        { value: 'new', label: 'Hàng mới' },
        { value: 'price-asc', label: 'Giá thấp đến cao' },
        { value: 'price-desc', label: 'Giá cao đến thấp' },
        { value: 'sold', label: 'Bán chạy' }
      ].map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleSortChange(value)}
          className={selectedSort === value ? 'active' : ''}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div className="container">
        {isAdmin && (
          <div className="admin-controls">
            <button
              className="edit-page-button"
              onClick={() => setIsManagingPromotions(!isManagingPromotions)}
            >
              <i className={isManagingPromotions ? 'bi bi-eye' : 'bi bi-gear'}></i>
              {isManagingPromotions ? 'Xem trang danh mục' : 'Quản lý danh mục và sản phẩm'}
            </button>
          </div>
        )}
        {isManagingPromotions ? (
          <div className="row">
            <div className="col-4">
              <CategoryTab
                selectedCategoryIdForFilter={selectedAdminCategoryId}
                onCategorySelect={setSelectedAdminCategoryId}
              />
            </div>
            <div className="col-8">
              <ProductTab selectedCategoryId={selectedAdminCategoryId} />
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-3">
              <div className="card-catagory">
                {selectedFiltersDisplay}
                {selectedCategories.length +
                  selectedPriceRanges.length +
                  selectedAuthors.length +
                  selectedPublishers.length +
                  selectedLanguages.length +
                  selectedFormats.length === 0 &&
                  !searchQuery && <span className="text-muted">Chưa chọn bộ lọc nào</span>}
                <div className="card-header-catagory">DANH MỤC SẢN PHẨM</div>
                <div className="list-check">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAllCategories"
                      checked={selectAllCategories}
                      onChange={handleSelectAllCategoriesChange}
                    />
                    <label className="form-check-label" htmlFor="selectAllCategories">
                      Tất cả
                    </label>
                  </div>
                  {isLoadingCategory ? (
                    <LoadingComponent />
                  ) : categoryTree?.length > 0 ? (
                    renderCategoryTree(categoryTree)
                  ) : (
                    <p>Không có danh mục nào để hiển thị.</p>
                  )}
                </div>
                <hr className="line" />
                <div className="card-header-catagory">GIÁ</div>
                <div className="list-check">
                  {[
                    { id: 'price1', range: [0, 100000], label: '0đ - 100.000đ' },
                    { id: 'price2', range: [100000, 200000], label: '100.000đ - 200.000đ' },
                    { id: 'price3', range: [200000, 300000], label: '200.000đ - 300.000đ' },
                    { id: 'price4', range: [300000, 400000], label: '300.000đ - 400.000đ' },
                    { id: 'price5', range: [400000, 500000], label: '400.000đ - 500.000đ' },
                    { id: 'price6', range: [500000, Infinity], label: '500.000đ - trở lên' }
                  ].map(({ id, range, label }) => {
                    const rangeStr = `${range[0]}-${range[1] === Infinity ? 'Infinity' : range[1]}`;
                    return (
                      <div className="form-check" key={id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={id}
                          onChange={() => handlePriceRangeChange(range)}
                          checked={selectedPriceRanges.includes(rangeStr)}
                        />
                        <label className="form-check-label" htmlFor={id}>
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <hr className="line" />
                <div className="card-header-catagory">TÁC GIẢ</div>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Tìm kiếm tác giả..."
                  onChange={e => debouncedSetAuthorSearch(e.target.value)}
                />
                <div className="list-check" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {isLoadingAuthor ? (
                    <LoadingComponent />
                  ) : filteredAuthors.length > 0 ? (
                    filteredAuthors.map(author => (
                      <div className="form-check" key={author.value}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={author.value}
                          id={`author-${author.value}`}
                          checked={selectedAuthors.includes(author.value)}
                          onChange={() => handleAuthorChange(author.value)}
                        />
                        <label className="form-check-label" htmlFor={`author-${author.value}`}>
                          {author.label}
                        </label>
                      </div>
                    ))
                  ) : authorSearch ? (
                    <p>Không tìm thấy tác giả.</p>
                  ) : (
                    <p>Không có tác giả nào để hiển thị.</p>
                  )}
                </div>
                <hr className="line" />
                <div className="card-header-catagory">NHÀ XUẤT BẢN</div>
                <div className="list-check">
                  {isLoadingPublisher ? (
                    <LoadingComponent />
                  ) : AllPub.length > 0 ? (
                    AllPub.map(publisher => (
                      <div className="form-check" key={publisher.value}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={publisher.value}
                          id={`publisher-${publisher.value}`}
                          checked={selectedPublishers.includes(publisher.value)}
                          onChange={() => handlePublisherChange(publisher.value)}
                        />
                        <label className="form-check-label" htmlFor={`publisher-${publisher.value}`}>
                          {publisher.label}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Không có nhà xuất bản nào để hiển thị.</p>
                  )}
                </div>
                <hr className="line" />
                <div className="card-header-catagory">NGÔN NGỮ</div>
                <div className="list-check">
                  {isLoadingLanguage ? (
                    <LoadingComponent />
                  ) : AllLanguages.length > 0 ? (
                    AllLanguages.map(language => (
                      <div className="form-check" key={language.value}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={language.value}
                          id={`language-${language.value}`}
                          checked={selectedLanguages.includes(language.value)}
                          onChange={() => handleLanguageChange(language.value)}
                        />
                        <label className="form-check-label" htmlFor={`language-${language.value}`}>
                          {language.label}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Không có ngôn ngữ nào để hiển thị.</p>
                  )}
                </div>
                <hr className="line" />
                <div className="card-header-catagory">HÌNH THỨC</div>
                <div className="list-check">
                  {isLoadingFormat ? (
                    <LoadingComponent />
                  ) : AllFormat.length > 0 ? (
                    AllFormat.map(format => (
                      <div className="form-check" key={format.value}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={format.value}
                          id={`format-${format.value}`}
                          checked={selectedFormats.includes(format.value)}
                          onChange={() => handleFormatChange(format.value)}
                        />
                        <label className="form-check-label" htmlFor={`format-${format.value}`}>
                          {format.label}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Không có hình thức nào để hiển thị.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="card-catagory">
                <h4 style={{ marginTop: '-5px', marginBottom: '15px' }}>
                  {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Sắp xếp theo:'}
                </h4>
                {sortButtons}
                <div style={{ backgroundColor: '#F9F6F2' }}>
                  <CardComponent bodyContent={BookInfo} />
                </div>
                {!searchResults.length && paginationButtons}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatagoryPage;