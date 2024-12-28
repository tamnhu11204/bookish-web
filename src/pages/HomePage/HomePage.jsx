import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import img3 from '../../assets/img/img3.jpg'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as PublisherService from '../../services/OptionService/PublisherService';
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'

const HomePage = () => {
  const catagoryInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {[...Array(5)].map((_, index) => (
          <MiniCardComponent key={index}
            img={img3}
            content="Văn học" />
        ))}
      </div>
    </>
  )

  const bookPurchasingTrendInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {[...Array(10)].map((_, index) => (
          <CardProductComponent
            key={index}
            img={img3}
            proName="Ngàn mặt trời rực rỡ"
            currentPrice="120000"
            sold="12"
            star="4.5"
            score="210"
          />
        ))}
      </div>
    </>
  )

  const newBookInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {[...Array(10)].map((_, index) => (
          <CardProductComponent
            key={index}
            img={img3}
            proName="Ngàn mặt trời rực rỡ"
            currentPrice="120000"
            sold="12"
            star="4.5"
            score="210"
          />
        ))}
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
  

  const monthlyBestSellInfo = (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
        {[...Array(10)].map((_, index) => (
          <CardProductComponent
            key={index}
            img={img3}
            proName="Ngàn mặt trời rực rỡ"
            currentPrice="120000"
            sold="12"
            star="4.5"
            score="210"
          />
        ))}
      </div>
    </>
  )

  return (
    <div style={{ backgroundColor: '#F9F6F2' }}>
      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container">
          <div style={{ marginTop: '30px' }}>
            <SliderComponent arrImages={[img1, img2]} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '30px' }}>
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
        <div className="container" style={{ marginTop: '30px' }}>
          <CardComponent
            title="Xu hướng mua sách"
            bodyContent={bookPurchasingTrendInfo}
            icon="bi bi-graph-up-arrow"
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container" style={{ marginTop: '30px' }}>
          <CardComponent
            title="Sách mới"
            bodyContent={newBookInfo}
            icon="bi bi-book"
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#198754', marginTop: '30px' }}>
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

      <div style={{ backgroundColor: '#F9F6F2' }}>
        <div className="container" style={{ marginTop: '30px' }}>
          <CardComponent
            title="Sách bán chạy trong tháng"
            bodyContent={monthlyBestSellInfo}
            icon="bi bi-arrow-up-right-square"
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage