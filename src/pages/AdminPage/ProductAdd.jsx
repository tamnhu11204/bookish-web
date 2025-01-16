import { useQuery } from "@tanstack/react-query";
import Compressor from 'compressorjs';
import React, { useEffect, useState } from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as CategoryService from "../../services/CategoryService";
import * as FormatService from "../../services/OptionService/FormatService";
import * as LanguageService from "../../services/OptionService/LanguageService";
import * as PublisherService from "../../services/OptionService/PublisherService";
import * as SupplierService from "../../services/OptionService/SupplierService";
import * as UnitService from "../../services/OptionService/UnitService";
import * as ProductService from "../../services/ProductService";
import TextEditor from "./partials/TextEditor";

const AddProductForm = ({isOpen,onCancel}) => {

  // State lưu trữ thông tin sản phẩm
  const [product1, setProduct] = useState({
    name: "",
    author: "",
    publishDate: "",
    weight: "",
    height: "",
    width: "",
    length: "",
    page: "",
    description: "",
    price: "",
    img: [], // Đổi img thành mảng
    star: "",
    favorite: "",
    score: "",
    hot: "",
    view: "",
  });

  const [name, setName] = useState('');
  const [pubdate, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [weight, setWeight] = useState('');
  const [page, setPage] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [price, setPrice] = useState(0);
  const [img, setImage] = useState([]); // Đổi img thành mảng
  const [description, setDescription] = useState('');
  const [discount,setDiscount] = useState(0);
  const [  priceEntry, setPriceEntry] = useState(0);
  const handleOnChangePriceEntry = (value) => setPriceEntry(value);

  const handleOnChangeName = (value) => setName(value);
  const handleOnChangeDate = (value) => setDate(value);
  const handleOnChangeAuthor = (value) => setAuthor(value);
  const handleOnChangeWeight = (value) => setWeight(value);
  const handleOnChangePage = (value) => setPage(value);
  const handleOnChangeHeight = (value) => setHeight(value);
  const handleOnChangeWidth = (value) => setWidth(value);
  const handleOnChangeLength = (value) => setLength(value);
  const handleOnChangeDescription = (value) => setDescription(value);
  const handleOnChangePrice = (value) => {setPrice(value);
    const calculatedPriceEntry = (value * (100-discount)) / 100;
    setPriceEntry(calculatedPriceEntry)
   };

  const mutation = useMutationHook(data => ProductService.addProduct(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    console.log("Dữ liệu gửi đi: ", product1); // Kiểm tra dữ liệu gửi đi
    console.log(isSuccess);
    if (isSuccess && data?.status !== 'ERR') {
      message.success();
      alert('Thêm sản phẩm mới thành công!');
    }
    if (isError) {
      message.error();
    }
  }, [isSuccess, isError, data?.status]);

  const onSave = async () => {
    if (
      author === "" || name === "" || price === ""
    ) {
      alert('Cần nhập đầy đủ thông tin!');
    }
    else {
      const productData = {
        name,
        author,
        publishDate: pubdate,
        weight,
        height,
        width,
        length,
        page,
        description,
        price,
        img,
        star: 0,
        favorite: 0,
        score: 0,
        hot: false,
        view: 0,
        publisher: selectedPublisher,
        supplier: selectedSupplier,
        language: selectedLanguage,
        format: selectedFormat,
        unit: selectedUnit,
        category: selectedCategory,
      };
      setProduct(name, author, pubdate, weight, "", "", "", page, "", price, img, "", "", "", "", "");
      mutation.mutate(productData); // Add new product
      alert('Thêm sản phẩm mới thành công!');
      onCancel();
    }
  };

  // Xử lý chọn ảnh và nén ảnh
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Lấy nhiều file ảnh
    if (files.length > 0) {
      files.forEach((file) => {
        new Compressor(file, {
          quality: 0.6,
          maxWidth: 800,
          maxHeight: 800,
          success(result) {
            const reader = new FileReader();
            reader.onload = () => {
              setImage((prevImg) => [...prevImg, reader.result]); // Thêm ảnh vào mảng
            };
            reader.readAsDataURL(result); // Đọc ảnh đã nén dưới dạng base64
          },
          error(err) {
            console.error(err);
          }
        });
      });
    }
  };

  const handleRemoveImage = (imageIndex) => {
    setImage((prevImg) => prevImg.filter((_, index) => index !== imageIndex)); // Xóa ảnh khi nhấn
  };


  //Xử lý nhà xuất bản
  const [selectedPublisher, setSelectedPublisher] = useState("");

  const handleOnChangePublisher = (e) => {
    setSelectedPublisher(e.target.value);
  };

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

  console.log('nbas', AllPub)


  //Xử lý ngôn ngữ
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleOnChangeLanguage = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const getAllLanguage = async () => {
    const res = await LanguageService.getAllLanguage();
    return res.data;
  };


  const { isLoading: isLoadingLanguage, data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: getAllLanguage,

  });

    const AllLang = Array.isArray(languages) && languages.length > 0
    ? languages.map((language) => ({
        value: language._id,
        label: language.name,
      }))
    : [];
  

  //Xử lý Format
  const [selectedFormat, setSelectedFormat] = useState("");

  const handleOnChangeFormat = (e) => {
    setSelectedFormat(e.target.value);
  };

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


  //Xử lý nhà cung cấp
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const handleOnChangeSupplier = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const getAllSupplier = async () => {
    const res = await SupplierService.getAllSupplier();
    return res.data;
  };


  const { isLoading: isLoadingSupplier, data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getAllSupplier,

  });

  const AllSupplier = Array.isArray(suppliers)
    ? suppliers.map((supplier) => ({
      value: supplier._id,
      label: supplier.name,
    }))
    : [];


  //Xử lý đơn vị
  const [selectedUnit, setSelectedUnit] = useState("");

  const handleOnChangeUnit = (e) => {
    setSelectedUnit(e.target.value);
  };

  const getAllUnit = async () => {
    const res = await UnitService.getAllUnit();
    return res.data;
  };


  const { isLoading: isLoadingUnit, data: units } = useQuery({
    queryKey: ['units'],
    queryFn: getAllUnit,

  });

  const AllUnit = Array.isArray(units)
    ? units.map((unit) => ({
      value: unit._id,
      label: unit.name,
    }))
    : [];

  //Xử lý danh mục
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOnChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

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

    const handleOnChangeDiscount = (value) => { setDiscount(value);
      const calculatedPriceEntry = (price * (100-value)) / 100;
      setPriceEntry(calculatedPriceEntry)};




  // Xử lý khi nhấn nút Lưu sản phẩm


  if (!isOpen) return null;
  return (
    <div className="container my-4">
      <h4>Thêm sản phẩm mới</h4>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>

          <FormComponent
            id="nameLanguageInput"
            label="Tên sản phẩm"
            type="text"
            placeholder="Nhập tên sản phẩm"
            value={name}
            onChange={handleOnChangeName}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-6 text-end">
          <ButtonComponent
            textButton="Hủy bỏ"
            onClick={onCancel}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Tác giả"
            type="text"
            placeholder="Nhập tên tác giả"
            value={author}
            onChange={handleOnChangeAuthor}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Nhà xuất bản"
            placeholder={"Chọn nhà xuất bản"}
            options={AllPub}
            selectedValue={selectedPublisher}
            onChange={handleOnChangePublisher}
            required={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Năm xuất bản"
            type="date"
            placeholder="Nhập năm xuất bản"
            value={pubdate}
            onChange={handleOnChangeDate}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Ngôn ngữ"
            placeholder={"Chọn ngôn ngữ"}
            options={AllLang}
            selectedValue={selectedLanguage}
            onChange={handleOnChangeLanguage}
            required={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Trọng lượng"
            type="text"
            placeholder="Nhập trọng lượng (ví dụ: 100g)"
            value={weight}
            onChange={handleOnChangeWeight}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Chiều cao"
            type="number"
            placeholder="Nhập chiều cao (cm)"
            value={height}
            onChange={handleOnChangeHeight}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Chiều rộng"
            type="number"
            placeholder="Nhập chiều rộng"
            value={width}
            onChange={handleOnChangeWidth}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Chiều dài"
            type="number"
            placeholder="Nhập chiều dài (cm)"
            value={length}
            onChange={handleOnChangeLength}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Số trang"
            type="number"
            placeholder="Nhập số trang"
            value={page}
            onChange={handleOnChangePage}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Hình thức"
            placeholder={"Chọn hình thức"}
            options={AllFormat}
            selectedValue={selectedFormat}
            onChange={handleOnChangeFormat}
            required={true}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Nhà cung cấp"
            placeholder={"Chọn nhà cung cấp"}
            options={AllSupplier}
            selectedValue={selectedSupplier}
            onChange={handleOnChangeSupplier}
            required={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Danh mục"
            placeholder={"Chọn danh mục"}
            options={AllCategory}
            selectedValue={selectedCategory}
            onChange={handleOnChangeCategory}
            required={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Đơn vị"
            placeholder={"Chọn đơn vị"}
            options={AllUnit}
            selectedValue={selectedUnit}
            onChange={handleOnChangeUnit}
            required={true}
          />
        </div>

        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <p style={{ fontSize: '16px' }}>Mô tả sản phẩm</p>
          <TextEditor value={description} onChange={handleOnChangeDescription} />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label" style={{ fontSize: '16px' }}>Hình ảnh</label>
          <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "200px", overflow: "hidden" }}>
            {img.length > 0 ? (
              img.map((image, index) => (
                <div key={index} className="position-relative d-inline-block me-2" style={{ width: '100px', height: '100px', margin: '5px' }}>
                  <img
                    src={image}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // Giữ tỷ lệ hình ảnh
                    }}
                  />
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0"
                    onClick={() => handleRemoveImage(index)}
                  ></button>
                </div>
              ))
            ) : (
              <span className="text-muted">Chọn hình ảnh</span>
            )}
          </div>
          <input
            type="file"
            id="image"
            className="form-control mt-2"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>


        <div className="col-md-4 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Giá"
            type="number"
            placeholder="Nhập giá"
            value={price}
            onChange={handleOnChangePrice}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="discount"
                  label="Giảm giá"
                  type="number"
                  placeholder="Nhập giảm giá"
                  value={discount}
                  onChange={handleOnChangeDiscount}
                  required={true}
                  enable = {true}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="PriceEntry"
                  label="Giá sau giảm"
                  type="number"
                  placeholder=""
                  value={priceEntry}
                  onChange={handleOnChangePriceEntry}
                  required={true}
                  enable = {false}
          />
        </div>
      </div>
      <div className="text-end">
        <td>
          <ButtonComponent
            textButton="Lưu sản phẩm"
            onClick={onSave}
          />
        </td>
      </div>
    </div>
  );
};

export default AddProductForm;
