import { useQuery } from "@tanstack/react-query";
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
import * as AuthorService from "../../services/AuthorService";

const flattenCategoryTree = (categories, level = 0) => {
  let result = [];
  categories.forEach((category) => {
    result.push({
      value: category._id,
      label: "-".repeat(level * 2) + " " + category.name, // Thêm dấu "-" để biểu thị cấp
    });
    if (category.children && category.children.length > 0) {
      result = result.concat(flattenCategoryTree(category.children, level + 1));
    }
  });
  return result;
};

const ProductDetailForm = ({ isOpen, IDProduct, onCancel }) => {
  // Xử lý khi thay đổi trường
  const [name, setName] = useState('');
  const [id, setID] = useState('');
  const [pubdate, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [page, setPage] = useState(0);
  const [priceEntry, setPriceEntry] = useState(0);
  const [previewImage, setPreviewImage] = useState([]);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [img, setImage] = useState([]);

  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");



  //Lấy thông tin product

  const [product, setDetailProduct] = useState(null);
  // State lưu trữ thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await ProductService.getDetailProduct(IDProduct);
      setDetailProduct(data.data);
      setID(data?.data.id || "");
      setName(data?.data.name || "");
      setWeight(data?.data.weight || "");
      setWidth(data?.data.width || "");
      setHeight(data?.data.height || "");
      setLength(data?.data.length || "");
      //setDate(data?.data.publishDate || "");
      setPage(data?.data.page || "");
      setPrice(data?.data.price || "");
      setDiscount(data?.data.discount || "");
      setStock(data?.data.stock || "");
      setImage(data?.data.img || []);
      setPreviewImage(data?.data.img || []);
      setSelectedCategory(data?.data.category || "");
      setSelectedFormat(data?.data.format || "");
      setSelectedLanguage(data?.data.language || "");
      setSelectedPublisher(data?.data.publisher || "");
      setSelectedSupplier(data?.data.supplier || "");
      setSelectedUnit(data?.data.unit || "");
      setSelectedAuthor(data?.data.author || "");
      const publishdate = new Date(data?.data.publishDate).toISOString().split('T')[0];
      setDate(publishdate);
    };
    fetchProduct();
  }, [IDProduct, setID]);


  const handleOnChangePriceEntry = (value) => setPriceEntry(value);
  const handleOnChangeName = (value) => setName(value);
  const handleOnChangeDate = (value) => setDate(value);
  const handleOnChangeWeight = (value) => setWeight(value);
  const handleOnChangePage = (value) => setPage(value);
  const handleOnChangeHeight = (value) => setHeight(value);
  const handleOnChangeWidth = (value) => setWidth(value);
  const handleOnChangeLength = (value) => setLength(value);
  const handleOnChangePrice = (value) => {
    setPrice(value);
    const calculatedPriceEntry = (value * (100 - discount)) / 100;
    setPriceEntry(calculatedPriceEntry)
  };
  const handleOnChangeDiscount = (value) => {
    setDiscount(value);
    const calculatedPriceEntry = (price * (100 - value)) / 100;
    setPriceEntry(calculatedPriceEntry)
  };


  const mutation = useMutationHook(data => ProductService.updateProduct(IDProduct, data));
  const { data, isSuccess, isError } = mutation;



  useEffect(() => {
    console.log("Dữ liệu gửi đi: ", product);
    console.log(isSuccess);
    if (isSuccess && data?.status !== 'ERR') {
      message.success();
      alert('Cập nhật sản phẩm thành công!');
      onCancel()
    }
    if (isError) {
      message.error();
    }
  }, [isSuccess, isError, data?.status, product, onCancel]);

  const onSave = async () => {
    if (selectedAuthor === "" || name === "" || price === "") {
      alert("Cần nhập đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("publishDate", pubdate);
    formData.append("weight", weight);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("length", length);
    formData.append("page", page);
    formData.append("description", "");
    formData.append("price", price);
    formData.append("priceEntry", priceEntry);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("star", 0);
    formData.append("favorite", 0);
    formData.append("score", 0);
    formData.append("hot", false);
    formData.append("view", 0);
    formData.append("publisher", selectedPublisher);
    formData.append("language", selectedLanguage);
    formData.append("format", selectedFormat);
    formData.append("unit", selectedUnit);
    formData.append("category", selectedCategory);
    formData.append("author", selectedAuthor);

    // Nếu không có ảnh mới, gửi danh sách ảnh cũ
    if (img.length === 0 && previewImage.length > 0) {
      img.push(...previewImage);  // Giữ lại ảnh cũ
    }

    img.forEach((file) => {
      if (file instanceof File) {
        formData.append("img", file);  // Ảnh mới
      } else {
        formData.append("existingImages", file);  // Ảnh cũ
      }
    });


    try {
      const response = await ProductService.updateProduct(IDProduct, formData);
      console.log("Response từ server:", response);

      if (response?._id) {
        alert("Cập nhật sản phẩm thành công!");
        onCancel();
      } else {
        console.error("Lỗi API trả về:", response);
        alert("Lỗi khi cập nhật sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };


  const handleOnChangeStock = (value) => setStock(value);
  // Xử lý chọn ảnh và nén ảnh
  const handleChangeImg = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setImage((prev) => [...prev, ...files]); // Lưu file ảnh để gửi lên server
      setPreviewImage((prev) => [...prev, ...files.map(file => URL.createObjectURL(file))]); // Hiển thị ảnh preview
    } else {
      console.error("Không có file hợp lệ được chọn!");
    }
  };



  const handleRemoveImage = (index) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
    setPreviewImage((prev) => prev.filter((_, i) => i !== index));
  };





  //Xử lý nhà xuất bản


  const handleOnChangePublisher = (e) => {
    setSelectedPublisher(e.target.value);
  };

  const getAllPublisher = async () => {
    const res = await PublisherService.getAllPublisher();
    return res.data;
  };


  const { data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: getAllPublisher,

  });

  const AllPub = Array.isArray(publishers)
    ? publishers.map((publisher) => ({
      value: publisher._id,
      label: publisher.name,
    }))
    : [];

  //Xử lý ngôn ngữ

  const handleOnChangeLanguage = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const getAllLanguage = async () => {
    const res = await LanguageService.getAllLanguage();
    return res.data;
  };


  const { data: languages } = useQuery({
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

  const handleOnChangeFormat = (e) => {
    setSelectedFormat(e.target.value);
  };

  const getAllFormat = async () => {
    const res = await FormatService.getAllFormat();
    return res.data;
  };


  const { data: formats } = useQuery({
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


  const handleOnChangeSupplier = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const getAllSupplier = async () => {
    const res = await SupplierService.getAllSupplier();
    return res.data;
  };


  const { data: suppliers } = useQuery({
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


  const handleOnChangeUnit = (e) => {
    setSelectedUnit(e.target.value);
  };

  const getAllUnit = async () => {
    const res = await UnitService.getAllUnit();
    return res.data;
  };


  const { data: units } = useQuery({
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

  const handleOnChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const getTreeCategory = async () => {
    const res = await CategoryService.getTreeCategory();
    return res.data;
  };


  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getTreeCategory,

  });

  const AllCategory = Array.isArray(categories)
    ? flattenCategoryTree(categories) // Chuyển cây thành danh sách phẳng
    : [];

  //Xử lý tác giả

  const handleOnChangeAuthor = (e) => {
    setSelectedAuthor(e.target.value);
  };

  const getAllAuthor = async () => {
    const res = await AuthorService.getAllAuthor();
    return res.data;
  };


  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: getAllAuthor,

  });

  const AllAuthor = Array.isArray(authors)
    ? authors.map((unit) => ({
      value: unit._id,
      label: unit.name,
    }))
    : [];

  // Xử lý khi nhấn nút Lưu sản phẩm


  if (!isOpen) return null;
  return (
    <div className="container my-4">
      <h4>Cập nhật sản phẩm</h4>

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
          <FormSelectComponent
            label="Tác giả"
            placeholder={"Chọn tác giả"}
            options={AllAuthor}
            selectedValue={selectedAuthor}
            onChange={handleOnChangeAuthor}
            required={true}

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

        <div className="mb-3">
          <label htmlFor="image" className="form-label" style={{ fontSize: '16px' }}>Hình ảnh</label>
          <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "200px", overflow: "hidden" }}>
            {previewImage.length > 0 ? (
              previewImage.map((image, index) => (
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
            onChange={handleChangeImg}
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
            enable={true}
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
            enable={false}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="Stock"
            label="Tồn kho"
            type="number"
            placeholder="Nhập số lượng tồn"
            value={stock}
            onChange={handleOnChangeStock}
            required={true}
            enable={true}
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

export default ProductDetailForm;