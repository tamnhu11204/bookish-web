import React, { useState } from "react";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import img4 from '../../assets/img/img4.png';

const BestSellingBooksSubTab = () => {
    const [filters, setFilters] = useState({ year: "2024", month: "" });

    const bookSalesData = [
        { id: "B001", month: "January", year: 2024, name: "Book A", quantitySold: 50, totalRevenue: 50000, image: img4},
        { id: "B002", month: "February", year: 2024, name: "Book B", quantitySold: 30, totalRevenue: 30000, image: img4 },
        { id: "B003", month: "March", year: 2024, name: "Book C", quantitySold: 40, totalRevenue: 40000, image: img4 },
        { id: "B004", month: "April", year: 2024, name: "Book D", quantitySold: 70, totalRevenue: 70000, image: img4 },
        { id: "B005", month: "May", year: 2024, name: "Book E", quantitySold: 20, totalRevenue: 20000, image: img4},
        { id: "B006", month: "June", year: 2024, name: "Book F", quantitySold: 60, totalRevenue: 60000, image: img4 },
    ];

    const yearOptions = [
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
    ];

    const monthOptions = [
        { value: "", label: "All" },
        { value: "January", label: "January" },
        { value: "February", label: "February" },
        { value: "March", label: "March" },
        { value: "April", label: "April" },
        { value: "May", label: "May" },
        { value: "June", label: "June" },
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Lọc dữ liệu theo năm và tháng
    const filteredData = bookSalesData.filter((item) => {
        return (
            item.year.toString() === filters.year &&
            (filters.month === "" || item.month === filters.month)
        );
    });

    return (
        <div className="container mt-5">
            {/* Bộ lọc */}
            <div className="mb-4">
                <form className="row">
                    <div className="col-md-6">
                        <FormSelectComponent
                            label="Năm"
                            placeholder="Chọn năm"
                            options={yearOptions}
                            event={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    year: e.target.value,
                                }))
                            }
                            values={filters.year}
                        />
                    </div>
                    <div className="col-md-6">
                        <FormSelectComponent
                            label="Tháng"
                            placeholder="Chọn tháng"
                            options={monthOptions}
                            event={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    month: e.target.value,
                                }))
                            }
                            values={filters.month}
                        />
                    </div>
                </form>
            </div>

            {/* Bảng dữ liệu */}
            <table className="table table-striped" style={{ fontSize: "16px" }}>
                <thead>
                    <tr>
                        <th scope="col" style={{ width: "10%" }}>Mã sách</th>
                        <th scope="col" style={{ width: "10%" }}>Hình ảnh</th>
                        <th scope="col" style={{ width: "30%" }}>Tên sản phẩm</th>
                        <th scope="col" style={{ width: "10%" }}>Số lượng bán</th>
                        <th scope="col" style={{ width: "15%" }}>Doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: "50px", height: "auto" }}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.quantitySold.toLocaleString()}</td>
                            <td>{item.totalRevenue.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BestSellingBooksSubTab;
