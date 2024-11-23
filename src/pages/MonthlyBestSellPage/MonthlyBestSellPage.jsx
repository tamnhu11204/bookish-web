import React, { useState } from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import img3 from '../../assets/img/img3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

const MonthlyBestSellPage = () => {
    const books = [
        {
            id: 1,
            title: "Trốn lên mái nhà để khóc - Tặng kèm bookmark",
            author: "Lâm",
            price: 100000,
            originalPrice: 200000,
            discount: 50,
            points: 2222,
            sold: 11,
            publisher: "Nhà xuất bản Dân Trí",
            description:
                "Những cơn gió heo may len lỏi vào từng góc phố nhỏ, mùa thu về gợi nhớ bao yêu thương đông đầy...",
            image: img3,
        },
        {
            id: 2,
            title: "Đèn nhờ và những đứa con của biển",
            author: "Nguyễn Văn A",
            price: 100000,
            originalPrice: 150000,
            discount: 33,
            points: 2100,
            sold: 11,
            publisher: "Nhà xuất bản Dân Trí",
            description: "Cuốn sách là những câu chuyện cảm động về đời sống biển cả...",
            image: img3,
        },
        {
            id: 3,
            title: "Cuốn sách thứ 3",
            author: "Nguyễn Văn B",
            price: 150000,
            originalPrice: 180000,
            discount: 17,
            points: 1800,
            sold: 20,
            publisher: "Nhà xuất bản Trẻ",
            description: "Một cuốn sách đầy cảm xúc và trải nghiệm thú vị...",
            image: img3,
        },
    ];

    const [selectedBook, setSelectedBook] = useState(books[0]);

    const info = (
        <>
            <div style={{ backgroundColor: '#198754', height: '40px', marginTop: '-10px' }}>
                <div className="btn-group" role="group">
                    <ButtonComponent textButton="All" />
                    <ButtonComponent textButton="Văn học" />
                </div>
            </div>

            <div className="row" style={{ marginTop: '30px' }}>
                {/* Left Column: Book List */}
                <div className="col-6">
                    <div className="book-list">
                        {books.map((book, index) => (
                            <div
                                key={book.id}
                                className="d-flex align-items-center mb-3 p-2 book-item"
                                style={{
                                    cursor: "pointer",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    backgroundColor:
                                        selectedBook.id === book.id ? "#f8f9fa" : "white",
                                }}
                                onMouseEnter={() => setSelectedBook(book)}
                            >
                                <p style={{ marginRight: '20px' }}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</p>
                                <div className="me-3">
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        style={{
                                            width: "60px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                                <div>
                                    <h6 className="mb-1" style={{ fontSize: '20px' }}>
                                        {book.title}
                                    </h6>
                                    <p className="mb-0 text-danger fw-bold">
                                        {book.price.toLocaleString()}đ
                                    </p>
                                    <small className="text-muted">
                                        Đã bán: {book.sold} | {book.points} điểm
                                    </small>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Book Details */}
                <div className="col-6">
                    <div className="card p-3">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={selectedBook.image}
                                alt={selectedBook.title}
                                style={{
                                    width: "120px",
                                    height: "160px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                                className="me-3"
                            />
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <h5 style={{ fontSize: '20px', color: '#198754' }}>{selectedBook.title}</h5>
                            <p className="mb-1">
                                <strong>Tác giả:</strong> {selectedBook.author}
                            </p>
                            <p className="mb-1">
                                <strong>Nhà xuất bản:</strong> {selectedBook.publisher}
                            </p>
                            {/* <p className="mb-1 text-danger">
                                <strong>
                                    {selectedBook.price.toLocaleString()}đ{" "}
                                    <span className="text-decoration-line-through text-muted">
                                        {selectedBook.originalPrice.toLocaleString()}đ
                                    </span>
                                </strong>
                            </p>
                            <p className="mb-1">
                                <strong>Giảm giá:</strong> -{selectedBook.discount}%
                            </p> */}
                            <div className="row">
                                <div className="col-4">
                                    <p style={{ color: 'red', fontSize: '25px' }}>{selectedBook.price.toLocaleString()}đ{" "}</p>
                                </div>
                                <div className="col-2">
                                    <div class="badge text-wrap" style={{ width: 'fit-content', fontSize: '16px', backgroundColor: '#E4F7CB', marginTop: '5px', color: '#198754' }}>
                                    -{selectedBook.discount}%
                                    </div>
                                </div>
                                <div className="col" >
                                </div>
                            </div>
                            <p class="text-decoration-line-through" style={{ fontSize: '16px', marginTop: '-20px' }}>{selectedBook.originalPrice.toLocaleString()}đ</p>

                            {/* Đánh giá và lượt bán */}
                            <div className="mt-3 text-muted" style={{ fontSize: "14px" }}>
                                <span>
                                    <strong>4,5/5⭐</strong> (2000 đánh giá) | 3200 lượt bán | 1200 điểm
                                </span>
                            </div>
                        </div>


                        <p>{selectedBook.description}</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div style={{ backgroundColor: '#F9F6F2' }}>
                <div className="container">
                    <div style={{ marginTop: '30px' }}>
                        <SliderComponent arrImages={[img1, img2]} />
                    </div>
                </div>
            </div>

            <div className="container">
                <div style={{ marginTop: '30px' }}>
                    <CardComponent
                        title="Sách bán chạy trong tháng"
                        bodyContent={info}
                        icon="bi bi-arrow-up-right-square"
                    />
                </div>
            </div>
        </div>
    );
};

export default MonthlyBestSellPage;
