import React, { useMemo, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import './CatagoryPage.css';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import img1 from '../../assets/img/img1.png';
import img2 from '../../assets/img/img2.png';
import CardProductComponent from '../../components/CardProductComponent2/CardProductComponent2';
import CardComponent from '../../components/CardComponent2/CardComponent2';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as ProductService from '../../services/ProductService';
import * as CategoryService from '../../services/CategoryService';
import * as FormatService from '../../services/OptionService/FormatService';

const CatagoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedSort, setSelectedSort] = useState('');

  // Lấy tất cả sản phẩm
  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
      console.log('Product API response:', res); // Debug
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
      console.log('Category tree:', res.data); // Debug
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
      console.log('All categories:', res.data); // Debug
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
      console.log('All publishers:', res.data); // Debug
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

  // Lấy hình thức
  const getAllFormat = async () => {
    try {
      const res = await FormatService.getAllFormat();
      console.log('All formats:', res.data); // Debug
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
          if (cat.children) {
            cat.children.forEach((child) => allIds.add(child._id));
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

  // Hàm render danh mục dạng cây
  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((cat) => (
      <div key={cat._id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="form-check">
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
        {cat.children && renderCategoryTree(cat.children, level + 1)}
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
    setSelectAll(false);
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

  const handleFormatChange = (formatValue) => {
    setSelectedFormats((prev) =>
      prev.includes(formatValue)
        ? prev.filter((value) => value !== formatValue)
        : [...prev, formatValue]
    );
    setCurrentPage(1);
  };

  const handleSelectAllChange = () => {
    if (!selectAll) {
      const allCategoryValues = AllCategory.map((category) => category.value);
      setSelectedCategories(allCategoryValues);
    } else {
      setSelectedCategories([]);
    }
    setSelectAll(!selectAll);
    setCurrentPage(1);
  };

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value || 0, 10);
    if (type === 'min') {
      if (value <= maxPrice) {
        setMinPrice(value);
        setPriceRange([value, maxPrice]);
      }
    } else {
      if (value >= minPrice) {
        setMaxPrice(value);
        setPriceRange([minPrice, value]);
      }
    }
    setCurrentPage(1);
  };

  const handleRangeSelect = (range) => {
    const [min, max] = range;
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  const Sort = [
    { value: 'price-asc', label: 'Giá từ thấp đến cao' },
    { value: 'price-desc', label: 'Giá từ cao đến thấp' },
    { value: 'sold', label: 'Lượt bán sản phẩm' },
  ];

  const handleOnChangeSort = (e) => {
    setSelectedSort(e.target.value);
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
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'sold':
        sortedProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      default:
        break;
    }
    return sortedProducts;
  };

  // Lọc sản phẩm
  useEffect(() => {
    if (products && products.length > 0 && categoryTree) {
      // Lấy tất cả ID danh mục con
      const allCategoryIds = getAllCategoryIds(categoryTree, selectedCategories);
      console.log('All category IDs for filtering:', allCategoryIds); // Debug

      let filtered = products.filter((product) => {
        const categoryMatch = selectedCategories.length
          ? allCategoryIds.includes(product.category)
          : true;
        const publisherMatch = selectedPublishers.length
          ? selectedPublishers.includes(product.publisher)
          : true;
        const formatMatch = selectedFormats.length
          ? selectedFormats.includes(product.format)
          : true;
        const priceAfterDiscount = (product.price * (100 - (product.discount || 0))) / 100;
        const priceMatch = priceAfterDiscount >= priceRange[0] && priceAfterDiscount <= priceRange[1];

        return categoryMatch && publisherMatch && formatMatch && priceMatch;
      });

      console.log('Filtered products:', filtered); // Debug

      filtered = sortProducts(filtered, selectedSort);
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
      setTotalPages(1);
    }
  }, [products, categoryTree, selectedCategories, selectedPublishers, selectedFormats, priceRange, selectedSort]);

  const handleOnClickProduct = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [currentPage, filteredProducts]);

  const paginationButtons = (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => setCurrentPage(currentPage - 1)}>Trước</button>
      )}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => setCurrentPage(currentPage + 1)}>Tiếp theo</button>
      )}
    </div>
  );

  const BookInfo = (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
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
            onClick={() => handleOnClickProduct(product._id)}
          />
        ))
      ) : (
        <div>Không có sản phẩm nào để hiển thị.</div>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div className="card-catagory"style={{ marginBottom:'25px' }}>
              <div className="card-header-catagory">DANH MỤC SẢN PHẨM</div>
              <div className="list-check">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  <label className="form-check-label" htmlFor="selectAll">
                    All
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
              <div className="card-header-catagory">GIÁ</div>
              <div className="list-check">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    id="range1"
                    onChange={() => handleRangeSelect([0, 100000])}
                  />
                  <label className="form-check-label" htmlFor="range1">
                    0đ - 100.000đ
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    id="range2"
                    onChange={() => handleRangeSelect([100000, 200000])}
                  />
                  <label className="form-check-label" htmlFor="range2">
                    100.000đ - 200.000đ
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    id="range3"
                    onChange={() => handleRangeSelect([200000, 300000])}
                  />
                  <label className="form-check-label" htmlFor="range3">
                    200.000đ - 300.000đ
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    id="range4"
                    onChange={() => handleRangeSelect([300000, 400000])}
                  />
                  <label className="form-check-label" htmlFor="range4">
                    300.000đ - 400.000đ
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    id="range5"
                    onChange={() => handleRangeSelect([400000, 500000])}
                  />
                  <label className="form-check-label" htmlFor="range5">
                    400.000đ - 500.000đ
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceRange"
                    id="range6"
                    onChange={() => handleRangeSelect([500000, 1000000])}
                  />
                  <label className="form-check-label" htmlFor="range6">
                    500.000đ - trở lên
                  </label>
                </div>
              </div>
              <div className="price-filter" style={{ fontSize: '16px', padding: '0 10px' }}>
                <div className="card-header-catagory">Hoặc tự chọn mức giá</div>
<div className="d-flex gap-2 mb-2">
  <input
    style={{ fontSize: '16px' }}
    type="number"
    className="form-control"
    value={minPrice}
    onChange={(e) => handlePriceChange(e, 'min')}
  />
  <span>-</span>
  <input
    style={{ fontSize: '16px' }}
    type="number"
    className="form-control"
    value={maxPrice}
    onChange={(e) => handlePriceChange(e, 'max')}
  />
</div>
<input
  type="range"
  min="0"
  max="1000000"
  step="1000"
  value={minPrice}
  onChange={(e) => handlePriceChange(e, 'min')}
  className="custom-range"
/>
<input
  type="range"
  min="0"
  max="1000000"
  step="1000"
  value={maxPrice}
  onChange={(e) => handlePriceChange(e, 'max')}
  className="custom-range mt-2"
/>
<div>
  <small>
    Khoảng giá: {priceRange[0].toLocaleString()} đ - {priceRange[1].toLocaleString()} đ
  </small>
</div>
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
            <div className="card-catagory" style={{ padding: '0px 10px',marginBottom:'25px' }}>
              <h4 style={{ marginTop: '10px' }}>Sắp xếp theo:</h4>
              <div className="col-md-4 mb-3">
                <FormSelectComponent
                  options={Sort}
                  selectedValue={selectedSort}
                  onChange={handleOnChangeSort}
                  required={false}
                />
              </div>
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