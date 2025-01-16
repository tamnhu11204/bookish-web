import React , { useEffect, useMemo, useState }from 'react'
import { useQuery } from '@tanstack/react-query'
import './ComparisonPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import img4 from '../../assets/img/img4.png'
import TableComparison from '../../components/TableComponent/TableComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { addSelectedProduct, removeSelectedProduct } from '../../redux/slides/ComparisonSlide';
import ProductSearchModal from './ProductSearchModal'; // Đường dẫn tới modal
import * as ProductService from '../../services/ProductService'
import * as FormatService from '../../services/OptionService/FormatService';
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as SupplierService from '../../services/OptionService/SupplierService';
import * as UnitService from '../../services/OptionService/UnitService';
const ComparisonPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

    const openModal = (index) => {
        setModalIndex(index);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
        setModalIndex(null);
      };
    
    
  
    

    const getAllProduct = async () => {
        try {
          const res = await ProductService.getAllProduct();
          return res?.data || []; // Trả về mảng rỗng nếu không có dữ liệu
        } catch (error) {
          console.error('Có lỗi xảy ra khi gọi API:', error);
          return []; // Trả về mảng rỗng trong trường hợp lỗi
        }
      };
      
        
        
          const { isLoading: isLoadingPro, data: products } = useQuery({
            queryKey: ['products'],
            queryFn: () => getAllProduct(),
          });
    
      //const [selectedProduct, setSelectedProduct] = useState(null);
      const useProductDetails = (product) => {
        const { data: publisher } = useQuery({
          queryKey: ['publisher', product?.publisher],
          queryFn: () =>
            product?.publisher
              ? PublisherService.getDetailPublisher(product.publisher).then((res) => res.data)
              : null,
          enabled: !!product?.publisher,
        });
      
        const { data: language } = useQuery({
          queryKey: ['language', product?.language],
          queryFn: () =>
            product?.language
              ? LanguageService.getDetailLanguage(product.language).then((res) => res.data)
              : null,
          enabled: !!product?.language,
        });
      
        const { data: supplier } = useQuery({
          queryKey: ['supplier', product?.supplier],
          queryFn: () =>
            product?.supplier
              ? SupplierService.getDetailSupplier(product.supplier).then((res) => res.data)
              : null,
          enabled: !!product?.supplier,
        });
      
        const { data: format } = useQuery({
          queryKey: ['format', product?.format],
          queryFn: () =>
            product?.format
              ? FormatService.getDetailFormat(product.format).then((res) => res.data)
              : null,
          enabled: !!product?.format,
        });
      
        const { data: unit } = useQuery({
          queryKey: ['unit', product?.unit],
          queryFn: () =>
            product?.unit
              ? UnitService.getDetailUnit(product.unit).then((res) => res.data)
              : null,
          enabled: !!product?.unit,
        });
      
        return { publisher, language, supplier, format, unit };
      };

    
      
     
        const dispatch = useDispatch();
        const selectedProducts = useSelector((state) => state.comparison.selectedProducts) || [];

      const handleRemoveProduct = (index) => {
        dispatch(removeSelectedProduct(index));
      };

      const productDetails1 = useProductDetails(selectedProducts[0]);
      const productDetails2 = useProductDetails(selectedProducts[1]);
      const productDetails3 = useProductDetails(selectedProducts[2]);

      const renderProductSlot = (product, index) => {
        if (product) {
          return (
            <div className="col-3">
              <CardProductComponent
                img={product.img}
                proName={product.name}
                currentPrice={product.price}
                sold={product.sold}
                star={product.star}
                score={product.score}
              />
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => handleRemoveProduct(index)}
              >
                <i className="bi bi-trash"></i> Xóa sản phẩm
              </button>
            </div>
          );
        } else {
          return (
            <div
  className="col-3 d-flex justify-content-center align-items-center"
  style={{ height: '200px', border: '1px solid #ccc', borderRadius: '8px' }}
>
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => openModal(index)} // Mở Modal
  >
    Thêm sản phẩm
  </button>
</div>
          );
        }
      };
      
      


      
      const comparisonData = [
        { criteria: 'Giá bìa', product1: selectedProducts[0]?.price || '-', product2: selectedProducts[1]?.price || '-', product3: selectedProducts[2]?.price || '-' },
        { criteria: 'Giá sau sale', product1: selectedProducts[0]?.price || '-', product2: selectedProducts[1]?.price || '-', product3: selectedProducts[2]?.price || '-' },
        { criteria: 'Lượt yêu thích', product1: selectedProducts[0]?.favorite || '-', product2: selectedProducts[1]?.favorite || '-', product3: selectedProducts[2]?.favorite || '-' },
        { criteria: 'Lượt bán', product1: selectedProducts[0]?.sold || '-', product2: selectedProducts[1]?.sold || '-', product3: selectedProducts[2]?.sold || '-' },
        { criteria: 'Đánh giá', product1: `${selectedProducts[0]?.star}/5 ⭐ (${selectedProducts[0]?.feedbackCount} đánh giá)` || '-', product2: `${selectedProducts[1]?.star}/5 ⭐ (${selectedProducts[1]?.feedbackCount} đánh giá)` || '-', product3: `${selectedProducts[2]?.star}/5 ⭐ (${selectedProducts[2]?.feedbackCount} đánh giá)` || '-' },
        { criteria: 'Lượt xem', product1: selectedProducts[0]?.view || '-', product2: selectedProducts[1]?.view || '-', product3: selectedProducts[2]?.view || '-' },
      ];
    
      const comparisonData1 = [
        { criteria: 'Mã hàng', product1: selectedProducts[0]?._id || '-', product2: selectedProducts[1]?._id || '-', product3: selectedProducts[2]?._id || '-' },
        { criteria: 'Tác giả', product1: selectedProducts[0]?.author || '-', product2: selectedProducts[1]?.author || '-', product3: selectedProducts[2]?.author || '-' },
        { criteria: 'Nhà xuất bản', product1: productDetails1.publisher?.name || '-', product2: productDetails2.publisher?.name|| '-', product3: productDetails3.publisher?.name || '-' },
        { criteria: 'Năm xuất bản', product1: selectedProducts[0]?.publishDate || '-', product2: selectedProducts[1]?.publishDate || '-', product3: selectedProducts[2]?.publishDate || '-' },
        { criteria: 'Ngôn ngữ', product1: productDetails1.language?.name  || '-', product2: productDetails2.language?.name  || '-', product3: productDetails3.language?.name  || '-' },
        { criteria: 'Trọng lượng', product1: selectedProducts[0]?.weight || '-', product2: selectedProducts[1]?.weight || '-', product3: selectedProducts[2]?.weight || '-' },
        { criteria: 'Kích thước', product1: `${selectedProducts[0]?.length}x${selectedProducts[0]?.width}x${selectedProducts[0]?.height}` || '-', product2: `${selectedProducts[1]?.length}x${selectedProducts[1]?.width}x${selectedProducts[1]?.height}` || '-', product3:`${selectedProducts[2]?.length}x${selectedProducts[2]?.width}x${selectedProducts[2]?.height}` || '-' },
        { criteria: 'Số trang', product1: selectedProducts[0]?.page || '-', product2: selectedProducts[1]?.page || '-', product3: selectedProducts[2]?.page || '-' },
        { criteria: 'Hình thức', product1: productDetails1.format?.name || '-', product2: productDetails2.format?.name || '-', product3: productDetails3.format?.name || '-' },
      ];
    //body của card dùng để lọc các thông tin nổi bật
    const comparison1 = (
        <>
            <TableComparison
                data={comparisonData}
                pro1="Sản phẩm 1"
                pro2="Sản phẩm 2"
                pro3="Sản phẩm 3"
            />
        </>
    )

    //body của card dùng để lọc các thông tin chi tiết
    const comparison2 = (
        <>
            <TableComparison
                data={comparisonData1}
                pro1="Sản phẩm 1"
                pro2="Sản phẩm 2"
                pro3="Sản phẩm 3"
            />
        </>
    )

    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div class="container">

                {/* chứa các sản phẩm chọn để so sánh */}
                <div class="card-comparison">
                    <div class="card-body-comparison" >
                        <h5 class="card-title-comparison">So sánh sách</h5>
                        <div className="row">
              <div className="col-3"></div>
              {Array(3)
              .fill(null)
              .map((_, index) =>
                renderProductSlot(selectedProducts[index] || null, index)
              )}
            </div>
                     </div>
                </div>
            </div>
            {/* Modal */}
           
        
            <ProductSearchModal
        isOpen={isModalOpen}
        products={products}
        onClose={closeModal}
        index={modalIndex}
      />
    
            <div class="container" style={{ marginTop: '30px' }}>
                <CardComponent
                    title="Số liệu kinh doanh"
                    bodyContent={comparison1}
                    icon="bi bi-bookmark-star"
                />
            </div>

            <div class="container" style={{ marginTop: '30px' }}>
                <CardComponent
                    title="Thông tin chi tiết của sách"
                    bodyContent={comparison2}
                    icon="bi bi-card-list"
                />
            </div>
 
            
            

        </div>
        
        
    )
}

export default ComparisonPage