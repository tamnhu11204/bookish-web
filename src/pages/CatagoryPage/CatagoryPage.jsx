import React, { useMemo, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import './CatagoryPage.css'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import CardProductComponent from '../../components/CardProductComponent2/CardProductComponent2'
import CardComponent from '../../components/CardComponent2/CardComponent2'
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent'
import * as PublisherService from '../../services/OptionService/PublisherService'
import * as ProductService from '../../services/ProductService'
import * as CategoryService from '../../services/CategoryService'
import * as FormatService from "../../services/OptionService/FormatService";
import { useLocation } from 'react-router-dom';


const CatagoryPage = () => {


  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Số sản phẩm trên mỗi trang
  const [totalPages, setTotalPages] = useState(1); // Khởi tạo giá trị totalPages

  const getAllProduct = async () => {
    try {
      const res = await ProductService.getAllProduct();
      console.log('fdsdas', res);  // Kiểm tra xem có nhận được dữ liệu không
      return res.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi gọi API:', error);
    }
  };


  const { isLoading: isLoadingPro, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProduct(),
  });

  const handleOnClickProduct = (id) => {
    navigate(`/product-detail/${id}`);
  }

  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res.data;
  };


  const { isLoading: isLoadingCategory, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategory,

  });

  const AllCategory = Array.isArray(categories)
    ? categories.map((categorie) => ({
      value: categorie._id,
      label: categorie.name,
    }))
    : [];

  const location = useLocation();
  //const [selectedCategories, setSelectedCategories] = useState([]);

  // Nhận danh mục được chọn từ state
  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setSelectedCategories([location.state.selectedCategory]);
    }
  }, [location.state]);

  const getAllPublisher = async () => {
    const res = await PublisherService.getAllPublisher();
    return res.data;
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

  // Nhận nhà xuất bản được chọn từ state
  useEffect(() => {
    if (location.state && location.state.selectedPublisher) {
      setSelectedPublishers([location.state.selectedPublisher]);
    }
  }, [location.state]);


  const getAllFormat = async () => {
    const res = await FormatService.getAllFormat();
    return res.data;
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


  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((value) => value !== categoryValue)
        : [...prev, categoryValue]
    );
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
  };





  const Sort = [
    { value: 'price-asc', label: 'Giá từ thấp đến cao' },
    { value: 'price-desc', label: 'Giá từ cao đến thấp' },
    { value: 'sold', label: 'Lượt bán sản phẩm' },
  ];
  const [selectedSort, setSelectedSort] = useState("");

  const handleOnChangeSort = (e) => {
    setSelectedSort(e.target.value);
  };

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000); // Giả sử giá tối đa là 1 triệu
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value, 10);
    if (type === 'min') {
      setMinPrice(value);
      setPriceRange([value, priceRange[1]]);
    } else {
      setMaxPrice(value);
      setPriceRange([priceRange[0], value]);
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
  const sortProducts = (products, selectedSort) => {
    if (!selectedSort || products.length === 0) return products;

    const sortedProducts = [...products]; // Tạo bản sao để tránh thay đổi mảng gốc

    switch (selectedSort) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price); // Sắp xếp giá từ thấp đến cao
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price); // Sắp xếp giá từ cao đến thấp
        break;
      case 'sold':
        sortedProducts.sort((a, b) => b.sold - a.sold); // Sắp xếp lượt bán giảm dần
        break;
      default:
        break; // Không sắp xếp nếu không có lựa chọn
    }

    return sortedProducts;
  };


  useEffect(() => {
    if (products && products.length > 0) {
      let filtered = products.filter((product) => {
        const categoryMatch = selectedCategories.length
          ? selectedCategories.includes(product.category)
          : true;
        const publisherMatch = selectedPublishers.length
          ? selectedPublishers.includes(product.publisher)
          : true;
        const formatMatch = selectedFormats.length
          ? selectedFormats.includes(product.format)
          : true;
        const priceAfterDiscount = (product.price * (100 - product.discount)) / 100;
        const priceMatch =
          priceAfterDiscount >= priceRange[0] && priceAfterDiscount <= priceRange[1];

        return categoryMatch && publisherMatch && formatMatch && priceMatch;
      });


      filtered = sortProducts(filtered, selectedSort);
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
      setFilteredProducts(filtered);

    }
  }, [
    products,
    selectedCategories,
    selectedPublishers,
    selectedFormats,
    priceRange,
    selectedSort,
    currentPage,
  ]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Cập nhật trang hiện tại
  };

  const paginationButtons = (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
      )}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? "active" : ""}
        >
          {index + 1}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => handlePageChange(currentPage + 1)}>Tiếp theo</button>
      )}
    </div>
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [currentPage, filteredProducts]);

  const BookInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
        {isLoadingPro ? (
          <LoadingComponent />
        ) : paginatedProducts && paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <CardProductComponent
              key={product._id}
              img={product.img[0]}
              proName={product.name}
              currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
              sold={product.sold}
              star={product.star}
              feedbackCount={product.feedbackCount}
              onClick={() => handleOnClickProduct(product._id)}
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
      {/* Hiển thị nút phân trang */}
      {paginationButtons}
    </>
  )


  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div class="container" >
        <div className="row">
          <div className="col-3">

            {/* Các checkbox để lọc sách */}
            <div className="card-catagory" >
              <div className="card-header-catagory">DANH MỤC SẢN PHẨM</div>
              <div className="list-check">
                {/* Checkbox All */}
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

                {/* Danh mục sản phẩm */}
                {AllCategory.length > 0 ? (
                  AllCategory.map((category) => (
                    <div className="form-check" key={category.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category.value}`}
                        value={category.value}
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => handleCategoryChange(category.value)}
                      />
                      <label className="form-check-label" htmlFor={`category-${category.value}`}>
                        {category.label}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>Không có danh mục nào để hiển thị.</p>
                )}
              </div>
              <hr className="line" />
              <div className="card-header-catagory">NHÀ XUẤT BẢN</div>
              <div className="list-check">
                {AllPub.length > 0 ? (
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
                {/* Dùng radio button thay vì checkbox */}
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
                  </label>                                </div>
              </div>
              {/* Phần chọn giá */}
              <div className="price-filter" style={{ fontSize: '16px', padding:'0 10px' }}>

                <div className="card-header-catagory">Hoặc tự chọn mức giá</div>
                <div className="d-flex gap-2 mb-2">
                  <input style={{ fontSize: '16px' }}
                    type="number"
                    className="form-control"
                    value={minPrice}
                    onChange={(e) => handlePriceChange(e, 'min')}
                  />
                  <span>-</span>
                  <input style={{ fontSize: '16px' }}
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
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 'min')}
                />
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  className="mt-2"
                />
                <div>
                  <small>Khoảng giá: {priceRange[0].toLocaleString()} đ - {priceRange[1].toLocaleString()} đ</small>
                </div>
              </div>
              <hr className="line" />



              <div className="card-header-catagory">HÌNH THỨC</div>
              <div className="list-check">
                {AllFormat.length > 0 ? (
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

          <div className="col-9" >
            <div className="card-catagory" style={{ padding:'0 10px' }}>

              <h4 style={{marginTop:'10px'}}>   Sắp xếp theo : </h4>
              <div className="col-md-4 mb-3">

                <FormSelectComponent
                  options={Sort}
                  selectedValue={selectedSort}
                  onChange={handleOnChangeSort}
                  required={false}
                />
              </div>
              <div style={{ backgroundColor: '#F9F6F2' }}>

                  <CardComponent
                    //title="Sách mới"
                    bodyContent={BookInfo}
                  //icon="bi bi-book"
                  />
              </div>




            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatagoryPage