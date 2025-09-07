import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img1 from '../../assets/img/img1.png';
import CardComponent from '../../components/CardComponent2/CardComponent2';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as CategoryService from '../../services/CategoryService';
import * as AuthorService from '../../services/AuthorService';
import * as FormatService from '../../services/OptionService/FormatService';
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as ProductService from '../../services/ProductService';
import './CatagoryPage.css';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';

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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState('');
  const [openedCategories, setOpenedCategories] = useState([]);
  const [authorSearch, setAuthorSearch] = useState('');

  // Lấy tất cả sản phẩm
  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
      console.log('Product API response:', res);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      throw error;
    }
  };

  const { isLoading: isLoadingPro, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProduct,
  });

  // Lấy danh mục dạng cây
  const getTreeCategory = async () => {
    try {
      const res = await CategoryService.getTreeCategory();
      console.log('Category tree:', res.data);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      throw error;
    }
  };

  const { isLoading: isLoadingCategory, data: categoryTree } = useQuery({
    queryKey: ['categoryTree'],
    queryFn: getTreeCategory,
  });

  // Lấy danh mục phẳng để hỗ trợ select all
  const getAllCategory = async () => {
    try {
      const res = await CategoryService.getAllCategory();
      console.log('All categories:', res.data);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      throw error;
    }
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategory,
  });

  const AllCategory = Array.isArray(categories)
    ? categories.map((categorie) => ({
      value: categorie._id,
      label: categorie.name,
    }))
    : [];

  // Lấy nhà xuất bản
  const getAllPublisher = async () => {
    try {
      const res = await PublisherService.getAllPublisher();
      console.log('All publishers:', res.data);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy nhà xuất bản:', error);
      throw error;
    }
  };

  const { isLoading: isLoadingPublisher, data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: getAllPublisher,
  });

  const AllPub = Array.isArray(publishers)
    ? publishers.map((publisher) => ({
      value: publisher._id,
      label: publisher.name,
    }))
    : [];

  // Lấy tác giả
  const getAllAuthor = async () => {
    try {
      const res = await AuthorService.getAllAuthor();
      console.log('All authors:', res.data);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy tác giả:', error);
      throw error;
    }
  };

  const { isLoading: isLoadingAuthor, data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: getAllAuthor,
  });

  const AllAuthors = Array.isArray(authors)
    ? authors.map((author) => ({
      value: author._id,
      label: author.name,
    }))
    : [];

  const filteredAuthors = AllAuthors.filter((author) =>
    author.label.toLowerCase().includes(authorSearch.toLowerCase())
  );

  // Lấy ngôn ngữ
  const getAllLanguage = async () => {
    try {
      const res = await LanguageService.getAllLanguage();
      console.log('All languages:', res.data);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy ngôn ngữ:', error);
      throw error;
    }
  };

  const { isLoading: isLoadingLanguage, data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: getAllLanguage,
  });

  const AllLanguages = Array.isArray(languages)
    ? languages.map((language) => ({
      value: language._id,
      label: language.name,
    }))
    : [];

  // Lấy hình thức
  const getAllFormat = async () => {
    try {
      const res = await FormatService.getAllFormat();
      console.log('All formats:', res.data);
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lấy hình thức:', error);
      throw error;
    }
  };

  const { isLoading: isLoadingFormat, data: formats } = useQuery({
    queryKey: ['formats'],
    queryFn: getAllFormat,
  });

  const AllFormat = Array.isArray(formats)
    ? formats.map((format) => ({
      value: format._id,
      label: format.name,
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
    const traverse = (cats) => {
      cats.forEach((cat) => {
        if (selectedIds.includes(cat._id)) {
          allIds.add(cat._id);
          if (cat.children && cat.children.length > 0) {
            cat.children.forEach((child) => {
              allIds.add(child._id);
            });
            traverse(cat.children);
          }
        } else {
          if (cat.children) {
            traverse(cat.children);
          }
        }
      });
    };
    traverse(categories);
    const result = Array.from(allIds);
    console.log('All category IDs for filtering:', result, 'Selected:', selectedIds);
    return result;
  };

  // Toggle mở/đóng category
  const toggleCategory = (categoryId) => {
    setOpenedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Render danh mục dạng cây với +/- bên phải
  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((cat) => (
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
              className='plus_minus'
            >
              {openedCategories.includes(cat._id) ? '-' : '+'}
            </span>
          )}
        </div>
        {cat.children && openedCategories.includes(cat._id) && renderCategoryTree(cat.children, level + 1)}
      </div>
    ));
  };

  // Xử lý sự kiện
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((value) => value !== categoryValue)
        : [...prev, categoryValue]
    );
    setSelectAllCategories(false);
    setCurrentPage(1);
  };

  const handlePublisherChange = (publisherValue) => {
    setSelectedPublishers((prev) =>
      prev.includes(publisherValue)
        ? prev.filter((value) => value !== publisherValue)
        : [...prev, publisherValue]
    );
    setCurrentPage(1);
  };

  const handleAuthorChange = (authorValue) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorValue)
        ? prev.filter((value) => value !== authorValue)
        : [...prev, authorValue]
    );
    setCurrentPage(1);
  };

  const handleLanguageChange = (languageValue) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageValue)
        ? prev.filter((value) => value !== languageValue)
        : [...prev, languageValue]
    );
    setCurrentPage(1);
  };

  const handleFormatChange = (formatValue) => {
    setSelectedFormats((prev) =>
      prev.includes(formatValue)
        ? prev.filter((value) => value !== formatValue)
        : [...prev, formatValue]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range) => {
    const rangeStr = `${range[0]}-${range[1] === Infinity ? 'Infinity' : range[1]}`;
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeStr)
        ? prev.filter((r) => r !== rangeStr)
        : [...prev, rangeStr]
    );
    setCurrentPage(1);
  };

  const handleSelectAllCategoriesChange = () => {
    if (!selectAllCategories) {
      const allCategoryValues = AllCategory.map((category) => category.value);
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
        setSelectedCategories((prev) => prev.filter((v) => v !== value));
        break;
      case 'price':
        setSelectedPriceRanges((prev) => prev.filter((v) => v !== value));
        break;
      case 'author':
        setSelectedAuthors((prev) => prev.filter((v) => v !== value));
        break;
      case 'publisher':
        setSelectedPublishers((prev) => prev.filter((v) => v !== value));
        break;
      case 'language':
        setSelectedLanguages((prev) => prev.filter((v) => v !== value));
        break;
      case 'format':
        setSelectedFormats((prev) => prev.filter((v) => v !== value));
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setCurrentPage(1);
  };

  const sortProducts = (products, selectedSort) => {
    if (!selectedSort || products.length === 0) return products;
    const sortedProducts = [...products];
    switch (selectedSort) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - b.price);
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'sold':
        sortedProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case 'new':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    return sortedProducts;
  };

  // Lọc sản phẩm
  useEffect(() => {
    if (products && products.length > 0 && categoryTree) {
      const allCategoryIds = getAllCategoryIds(categoryTree, selectedCategories);

      let filtered = products.filter((product) => {
        const productCategoryId = product.category?._id || product.category;
        const categoryMatch = selectedCategories.length === 0
          ? true
          : allCategoryIds.includes(productCategoryId);

        console.log(`Product ${product._id}: category object=${JSON.stringify(product.category)}, categoryId='${productCategoryId}', allCategoryIds includes? ${allCategoryIds.includes(productCategoryId)}, match: ${categoryMatch}`);

        const publisherMatch = selectedPublishers.length === 0
          ? true
          : selectedPublishers.includes(product.publisher?._id || product.publisher);
        const authorMatch = selectedAuthors.length === 0
          ? true
          : selectedAuthors.includes(product.author?._id || product.author);
        const languageMatch = selectedLanguages.length === 0
          ? true
          : selectedLanguages.includes(product.language?._id || product.language);
        const formatMatch = selectedFormats.length === 0
          ? true
          : selectedFormats.includes(product.format?._id || product.format);
        const priceAfterDiscount = (product.price * (100 - (product.discount || 0))) / 100;
        const priceMatch = selectedPriceRanges.length === 0
          ? true
          : selectedPriceRanges.some((rangeStr) => {
            const [min, max] = rangeStr.split('-').map((num) => num === 'Infinity' ? Infinity : Number(num));
            return priceAfterDiscount >= min && priceAfterDiscount <= (isFinite(max) ? max : Infinity);
          });

        return categoryMatch && publisherMatch && authorMatch && languageMatch && formatMatch && priceMatch;
      });

      console.log('Filtered products count:', filtered.length, 'Total products:', products.length);

      filtered = sortProducts(filtered, selectedSort);
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
      setTotalPages(1);
    }
  }, [products, categoryTree, selectedCategories, selectedPublishers, selectedAuthors, selectedLanguages, selectedFormats, selectedPriceRanges, selectedSort]);

  const handleOnClickProduct = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [currentPage, filteredProducts]);

  const paginationButtons = (
    <div className="pagination-category d-flex justify-content-center gap-2">
      {currentPage > 1 && (
        <ButtonComponent2
          textButton="Trước"
          onClick={() => setCurrentPage(currentPage - 1)}
        />
      )}
      {[...Array(totalPages)].map((_, index) => (
        <ButtonComponent2
          key={index}
          textButton={String(index + 1)}
          onClick={() => setCurrentPage(index + 1)}
        />
      ))}
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
      {isLoadingPro ? (
        <LoadingComponent />
      ) : paginatedProducts.length > 0 ? (
        paginatedProducts.map((product) => (
          <CardProductComponent
            key={product._id}
            img={product.img?.[0] || img1}
            proName={product.name}
            currentPrice={((product.price * (100 - (product.discount || 0))) / 100).toLocaleString()}
            sold={product.sold || 0}
            star={product.star || 0}
            feedbackCount={product.feedbackCount || 0}
            view={product.view || 0}
            onClick={() => handleOnClickProduct(product._id)}
          />
        ))
      ) : (
        <div>Không có sản phẩm nào để hiển thị.</div>
      )}
    </div>
  );

  const selectedFiltersDisplay = (
    <div className="selected-filters mb-3">
      {selectedCategories.map((id) => {
        const label = AllCategory.find((c) => c.value === id)?.label || 'Unknown Category';
        return (
          <span key={`cat-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('category', id)}>×</button>
          </span>
        );
      })}
      {selectedPriceRanges.map((range) => {
        const displayRange = range.replace('-', 'đ - ').replace('Infinity', 'trở lên') + 'đ';
        return (
          <span key={`price-${range}`} className="badge bg-secondary me-2">
            Giá {displayRange} <button type="button" onClick={() => removeFilter('price', range)}>×</button>
          </span>
        );
      })}
      {selectedAuthors.map((id) => {
        const label = AllAuthors.find((a) => a.value === id)?.label || 'Unknown Author';
        return (
          <span key={`auth-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('author', id)}>×</button>
          </span>
        );
      })}
      {selectedPublishers.map((id) => {
        const label = AllPub.find((p) => p.value === id)?.label || 'Unknown Publisher';
        return (
          <span key={`pub-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('publisher', id)}>×</button>
          </span>
        );
      })}
      {selectedLanguages.map((id) => {
        const label = AllLanguages.find((l) => l.value === id)?.label || 'Unknown Language';
        return (
          <span key={`lang-${id}`} className="badge bg-secondary me-2">
            {label} <button type="button" onClick={() => removeFilter('language', id)}>×</button>
          </span>
        );
      })}
      {selectedFormats.map((id) => {
        const label = AllFormat.find((f) => f.value === id)?.label || 'Unknown Format';
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
      <button
        type="button"
        onClick={() => handleSortChange('name-asc')}
        className={selectedSort === 'name-asc' ? 'active' : ''}
      >
        Tên A-Z
      </button>
      <button
        type="button"
        onClick={() => handleSortChange('name-desc')}
        className={selectedSort === 'name-desc' ? 'active' : ''}
      >
        Tên Z-A
      </button>
      <button
        type="button"
        onClick={() => handleSortChange('new')}
        className={selectedSort === 'new' ? 'active' : ''}
      >
        Hàng mới
      </button>
      <button
        type="button"
        onClick={() => handleSortChange('price-asc')}
        className={selectedSort === 'price-asc' ? 'active' : ''}
      >
        Giá thấp đến cao
      </button>
      <button
        type="button"
        onClick={() => handleSortChange('price-desc')}
        className={selectedSort === 'price-desc' ? 'active' : ''}
      >
        Giá cao đến thấp
      </button>
      <button
        type="button"
        onClick={() => handleSortChange('sold')}
        className={selectedSort === 'sold' ? 'active' : ''}
      >
        Bán chạy
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div className="card-catagory">
              {selectedFiltersDisplay}
              {selectedCategories.length + selectedPriceRanges.length + selectedAuthors.length + selectedPublishers.length + selectedLanguages.length + selectedFormats.length === 0 && (
                <span className="text-muted">Chưa chọn bộ lọc nào</span>
              )}
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
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
              />
              <div className="list-check" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {isLoadingAuthor ? (
                  <LoadingComponent />
                ) : filteredAuthors.length > 0 ? (
                  filteredAuthors.map((author) => (
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
                  AllPub.map((publisher) => (
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
                  AllLanguages.map((language) => (
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
                  AllFormat.map((format) => (
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
              <h4 style={{ marginTop: '-5px', marginBottom: "15px" }}>Sắp xếp theo:</h4>
              {sortButtons}
              <div style={{ backgroundColor: '#F9F6F2' }}>
                <CardComponent bodyContent={BookInfo} />
              </div>
              {paginationButtons}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatagoryPage;