import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import img3 from '../../assets/img/img3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import * as PublisherService from '../../services/OptionService/PublisherService'
import * as ProductService from '../../services/ProductService'
import * as CategoryService from '../../services/CategoryService'

const HomePage = () => {
  const navigate = useNavigate();

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
    await ProductService.updateView(id)
    navigate(`/product-detail/${id}`);
  }

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
  

  const catagoryInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {/* {[...Array(5)].map((_, index) => (
          <MiniCardComponent key={index}
            img={img3}
            content="Văn học" />
        ))} */}
        {isLoadingCate ? (
          <LoadingComponent />
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <MiniCardComponent key={category._id}
            img={category.img}
            content={category.name} />
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
  )

  const bookPurchasingTrendInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
      {isLoadingPro ? (
          <LoadingComponent />
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <CardProductComponent
              key={product._id}
              img={product.img[0]}
              proName={product.name}
              currentPrice={(product.price*(100-product.discount)/100).toLocaleString()}
              sold={product.sold}
              star={product.star}
              feedbackCount={product.feedbackCount}
              onClick={()=>handleOnClickProduct(product._id)}
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
  )

  const newBookInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {isLoadingPro ? (
          <LoadingComponent />
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <CardProductComponent
              key={product._id}
              img={product.img[0]}
              proName={product.name}
              currentPrice={(product.price*(100-product.discount)/100).toLocaleString()}
              sold={product.sold}
              star={product.star}
              feedbackCount={product.feedbackCount}
              onClick={()=>handleOnClickProduct(product._id)}
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
  )

  /////////////----------NXB------------///////////

  // Lấy danh sách nhà xb từ API
  const getAllPublisher = async () => {
    const res = await PublisherService.getAllPublisher();
    return res.data;
  };

  const { isLoading: isLoadingPublisher, data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: getAllPublisher,
  });

  const publisherInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {isLoadingPublisher ? (
          <LoadingComponent isLoading={isLoadingPublisher} />
        ) : publishers && publishers.length > 0 ? (
          publishers.map((publisher) => (
            <MiniCardComponent
              key={publisher._id}
              img={publisher.img}
              content={publisher.name}
            />
          ))
        ) : (
          <div className="text-center">
            Không có dữ liệu để hiển thị.
          </div>
        )}
      </div>
    </>
  )


  // const monthlyBestSellInfo = (
  //   <>
  //     <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
  //       {[...Array(10)].map((_, index) => (
  //         <CardProductComponent
  //           key={index}
  //           img={img3}
  //           proName="Ngàn mặt trời rực rỡ"
  //           currentPrice="120000"
  //           sold="12"
  //           star="4.5"
  //           score="210"
  //         />
  //       ))}
  //     </div>
  //   </>
  // )

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
        <div className="container" >
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
            title="Sách mới"
            bodyContent={newBookInfo}
            icon="bi bi-book"
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '50px', marginBottom: '50px' }}>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
        <div className="container" >
          <CardComponent
            title="Nhà xuất bản"
            bodyContent={publisherInfo}
            icon="bi bi-pen"
          />
        </div>
        <div style={{ backgroundColor: '#198754', height: '10px' }}></div>
      </div>

      {/* <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container" style={{ marginTop: '50px'}}>
          <CardComponent
            title="Sách bán chạy trong tháng"
            bodyContent={monthlyBestSellInfo}
            icon="bi bi-arrow-up-right-square"
          />
        </div>
      </div> */}
    </div>
  )
}

export default HomePage