import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CardComponent from '../../components/CardComponent/CardComponent';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import TableComparison from '../../components/TableComponent/TableComponent';
import * as FormatService from '../../services/OptionService/FormatService';
import * as LanguageService from '../../services/OptionService/LanguageService';
import * as PublisherService from '../../services/OptionService/PublisherService';
import * as SupplierService from '../../services/OptionService/SupplierService';
import * as UnitService from '../../services/OptionService/UnitService';
import * as ProductService from '../../services/ProductService';
import './ComparisonPage.css';
import ProductSearchModal from './ProductSearchModal';

const ComparisonPage = () => {
  const { id } = useParams();
  const [selectedProducts, setSelectedProducts] = useState([null, null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

  // Lấy chi tiết sản phẩm đầu tiên dựa trên id
  const { data: firstProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getDetailProduct(id).then((res) => res.data),
    enabled: !!id,
  });

  // Lấy danh sách sản phẩm cho modal
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const res = await ProductService.getAllProduct();
        return res?.data || [];
      } catch (error) {
        console.error('Có lỗi xảy ra khi gọi API:', error);
        return [];
      }
    },
  });

  console.log('firstProduct:', firstProduct);
  console.log('products:', products);
  console.log('selectedProducts:', selectedProducts);

  const openModal = (index) => {
    if (index !== 0) {
      setModalIndex(index);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalIndex(null);
  };

  const handleSelectProduct = (index, product) => {
    console.log('Selected product for index', index, ':', product);
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = product;
    setSelectedProducts(newSelectedProducts);
  };

  const handleRemoveProduct = (index) => {
    if (index !== 0) {
      const newSelectedProducts = [...selectedProducts];
      newSelectedProducts[index] = null;
      setSelectedProducts(newSelectedProducts);
    }
  };

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

  const productDetails1 = useProductDetails(firstProduct);
  const productDetails2 = useProductDetails(selectedProducts[1]);
  const productDetails3 = useProductDetails(selectedProducts[2]);

  const renderProductSlot = (product, index) => {
    console.log(`Rendering slot ${index}:`, product);
    if (index === 0) {
      if (firstProduct && typeof firstProduct === 'object' && firstProduct.name) {
        return (
          <div className="col-3">
            <CardProductComponent
              img={Array.isArray(firstProduct.img) ? firstProduct.img[0] || '' : firstProduct.img || ''}
              proName={firstProduct.name || 'Không có tên'}
              currentPrice={firstProduct.price || 0}
              sold={firstProduct.sold || 0}
              star={firstProduct.star || 0}
              score={firstProduct.score || 0}
            />
          </div>
        );
      } else {
        return (
          <div
            className="col-3 d-flex justify-content-center align-items-center"
            style={{ height: '200px', border: '1px solid #ccc', borderRadius: '8px' }}
          >
            <span>Sản phẩm không tồn tại</span>
          </div>
        );
      }
    }

    if (product && typeof product === 'object' && product.name) {
      return (
        <div className="col-3">
          <CardProductComponent
            img={Array.isArray(product.img) ? product.img[0] || '' : product.img || ''}
            proName={product.name || 'Không có tên'}
            currentPrice={product.price || 0}
            sold={product.sold || 0}
            star={product.star || 0}
            score={product.score || 0}
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
            onClick={() => openModal(index)}
            style={{ backgroundColor: '#198754', color: 'white', borderColor: '#198754', fontSize: '14px' }}
          >
            Thêm sản phẩm
          </button>
        </div>
      );
    }
  };

  const comparisonData = [
    {
      criteria: 'Giá bìa',
      product1: firstProduct?.price || '-',
      product2: selectedProducts[1]?.price || '-',
      product3: selectedProducts[2]?.price || '-',
    },
    {
      criteria: 'Giá sau sale',
      product1: firstProduct?.price || '-',
      product2: selectedProducts[1]?.price || '-',
      product3: selectedProducts[2]?.price || '-',
    },
    {
      criteria: 'Lượt bán',
      product1: firstProduct?.sold || '-',
      product2: selectedProducts[1]?.sold || '-',
      product3: selectedProducts[2]?.sold || '-',
    },
    {
      criteria: 'Đánh giá',
      product1: firstProduct?.star ? `${firstProduct.star}/5 ⭐ (${firstProduct.feedbackCount || 0} đánh giá)` : '-',
      product2: selectedProducts[1]?.star ? `${selectedProducts[1].star}/5 ⭐ (${selectedProducts[1].feedbackCount || 0} đánh giá)` : '-',
      product3: selectedProducts[2]?.star ? `${selectedProducts[2].star}/5 ⭐ (${selectedProducts[2].feedbackCount || 0} đánh giá)` : '-',
    },
    {
      criteria: 'Lượt xem',
      product1: firstProduct?.view || '-',
      product2: selectedProducts[1]?.view || '-',
      product3: selectedProducts[2]?.view || '-',
    },
  ];

  const comparisonData1 = [
    {
      criteria: 'Mã hàng',
      product1: firstProduct?.code || '-',
      product2: selectedProducts[1]?.code || '-',
      product3: selectedProducts[2]?.code || '-',
    },
    {
      criteria: 'Tác giả',
      product1: firstProduct?.author || '-',
      product2: selectedProducts[1]?.author || '-',
      product3: selectedProducts[2]?.author || '-',
    },
    {
      criteria: 'Nhà xuất bản',
      product1: productDetails1.publisher?.name || '-',
      product2: productDetails2.publisher?.name || '-',
      product3: productDetails3.publisher?.name || '-',
    },
    {
      criteria: 'Năm xuất bản',
      product1: firstProduct?.publishDate
        ? new Date(firstProduct.publishDate).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        : '-',
      product2: selectedProducts[1]?.publishDate
        ? new Date(selectedProducts[1].publishDate).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        : '-',
      product3: selectedProducts[2]?.publishDate
        ? new Date(selectedProducts[2].publishDate).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        : '-',
    },
    {
      criteria: 'Ngôn ngữ',
      product1: productDetails1.language?.name || '-',
      product2: productDetails2.language?.name || '-',
      product3: productDetails3.language?.name || '-',
    },
    {
      criteria: 'Trọng lượng',
      product1: firstProduct?.weight || '-',
      product2: selectedProducts[1]?.weight || '-',
      product3: selectedProducts[2]?.weight || '-',
    },
    {
      criteria: 'Kích thước',
      product1: `${firstProduct?.length || '-'}x${firstProduct?.width || '-'}x${firstProduct?.height || '-'}`,
      product2: `${selectedProducts[1]?.length || '-'}x${selectedProducts[1]?.width || '-'}x${selectedProducts[1]?.height || '-'}`,
      product3: `${selectedProducts[2]?.length || '-'}x${selectedProducts[2]?.width || '-'}x${selectedProducts[2]?.height || '-'}`,
    },
    {
      criteria: 'Số trang',
      product1: firstProduct?.page || '-',
      product2: selectedProducts[1]?.page || '-',
      product3: selectedProducts[2]?.page || '-',
    },
    {
      criteria: 'Hình thức',
      product1: productDetails1.format?.name || '-',
      product2: productDetails2.format?.name || '-',
      product3: productDetails3.format?.name || '-',
    },
  ];

  const comparison1 = (
    <TableComparison data={comparisonData} pro1="Sản phẩm 1" pro2="Sản phẩm 2" pro3="Sản phẩm 3" />
  );

  const comparison2 = (
    <TableComparison data={comparisonData1} pro1="Sản phẩm 1" pro2="Sản phẩm 2" pro3="Sản phẩm 3" />
  );

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div className="container">
        <div className="card-comparison">
          <div className="card-body-comparison">
            <h5 className="card-title-comparison">So sánh sách</h5>
            <div className="row gap-3">
              <div className="col-2"></div>
              {Array(3)
                .fill(null)
                .map((_, index) =>
                  renderProductSlot(index === 0 ? firstProduct : selectedProducts[index], index)
                )}
            </div>
          </div>
        </div>
      </div>

      <ProductSearchModal
        isOpen={isModalOpen}
        products={products}
        onClose={closeModal}
        onSelectProduct={handleSelectProduct}
        index={modalIndex}
      />

      <div className="container" style={{ marginTop: '30px' }}>
        <CardComponent title="Số liệu kinh doanh" bodyContent={comparison1} icon="bi bi-bookmark-star" />
      </div>

      <div className="container" style={{ marginTop: '30px', marginBottom: '30px' }}>
        <CardComponent title="Thông tin chi tiết của sách" bodyContent={comparison2} icon="bi bi-card-list" />
      </div>
    </div>
  );
};

export default ComparisonPage;