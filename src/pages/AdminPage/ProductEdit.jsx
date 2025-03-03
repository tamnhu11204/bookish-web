import React, { useEffect,useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as PublisherService from "../../services/OptionService/PublisherService";
import * as LanguageService from "../../services/OptionService/LanguageService"
import * as SupplierService from "../../services/OptionService/SupplierService"
import * as FormatService from "../../services/OptionService/FormatService"
import * as UnitService from "../../services/OptionService/UnitService"
import * as ProductService from "../../services/ProductService"
import * as CategoryService from "../../services/CategoryService"
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/MessageComponent";
import Compressor from 'compressorjs';

const ProductDetailForm = ({isOpen, IDProduct,onCancel}) => {
  
  // Xử lý khi thay đổi trường
  const [name, setName] = useState('');
  const [id, setID] = useState('');
  const [pubdate,setDate] = useState('');
  const [author,setAuthor] = useState('');
  const [weight,setWeight] = useState('');
  const [page,setPage] = useState(0);
  const [size, setSize] = useState('');
  const [  priceEntry, setPriceEntry] = useState(0);

  const [height,setHeight] = useState(0);
  const [width,setWidth] = useState(0);
  const [length,setLength] = useState(0);
  const [price,setPrice] = useState(0);
  const [discount,setDiscount] = useState(0);
  const [stock,setStock] = useState(0);
  const [img, setImage] = useState('');

  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");



   //Lấy thông tin product
   
    const [product,setDetailProduct] = useState(null);
  // State lưu trữ thông tin sản phẩm
   useEffect(() => {
      const fetchProduct = async () => {
        const data = await ProductService.getDetailProduct(IDProduct);
        console.log('sá', data)
        setDetailProduct(data.data);
        setID(data?.data.id ||"");
        setName(data?.data.name || ""); 
        setWeight(data?.data.weight ||"");
        setWidth(data?.data.width || "");
        setHeight(data?.data.height || "");
        setLength(data?.data.length || "");
        setAuthor(data?.data.author || "");
        //setDate(data?.data.publishDate || "");
        setPage(data?.data.page || "");
        setPrice(data?.data.price || "");
        setDiscount(data?.data.discount || "");
        setStock(data?.data.stock || "");
        setImage(data?.data.img || "");
        setSelectedCategory(data?.data.category || "");
        setSelectedFormat(data?.data.format || "");
        setSelectedLanguage(data?.data.language || "");
        setSelectedPublisher(data?.data.publisher || "");
        setSelectedSupplier(data?.data.supplier || "");
        setSelectedUnit(data?.data.unit || "");
        const publishdate = new Date(data?.data.publishDate).toISOString().split('T')[0];  // Lấy phần ngày của ISO string
        setDate(publishdate);


      
      };
      fetchProduct();
    }, [IDProduct]);


  

  
  const handleOnChangePriceEntry = (value) => setPriceEntry(value);
  const handleOnChangeName = (value) => setName(value);
  const handleOnChangeSize = (value) => setSize(value)
  const handleOnChangeDate = (value) => setDate(value);
  const handleOnChangeAuthor = (value) => setAuthor(value);
  const handleOnChangeWeight = (value) => setWeight(value);
  const handleOnChangePage = (value) => setPage(value);
  const handleOnChangeHeight = (value) => setHeight(value);
  const handleOnChangeWidth = (value) => setWidth(value);
  const handleOnChangeLength = (value) => setLength(value);
  const handleOnChangePrice = (value) => {setPrice(value);
    const calculatedPriceEntry = (value * (100-discount)) / 100;
    setPriceEntry(calculatedPriceEntry)
   };
  const handleOnChangeDiscount = (value) => { setDiscount(value);
    const calculatedPriceEntry = (price * (100-value)) / 100;
    setPriceEntry(calculatedPriceEntry)};


   const mutation = useMutationHook(data => ProductService.updateProduct(IDProduct,data));
   const { data, isSuccess, isError } = mutation;

   

   useEffect(() => {
    console.log("Dữ liệu gửi đi: ", product); // Kiểm tra dữ liệu gửi đi
    console.log(isSuccess);
           if (isSuccess && data?.status !== 'ERR') {
               message.success();
               alert('Cập nhật sản phẩm thành công!');
               onCancel();
           }
           if (isError) {
               message.error();
           }
       }, [isSuccess, isError, data?.status]);

   const onSave = async () => {
     if (
      author == "" || name == "" || price == "" 
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
      description: "",
      price,
      priceEntry,
      discount,
      stock,
      img,
      star: 0,
      favorite: 0,
      score: 0,
      hot: false,
      view: 0,
      publisher : selectedPublisher,
      language : selectedLanguage,
      format : selectedFormat,
      unit : selectedUnit,
      category : selectedCategory,

       
    };
    const response = await ProductService.updateProduct(IDProduct,productData );
                if (response.status === 'OK') {
                    alert("Cập nhật sản phẩm thành công!");
                    onCancel();
                } else {
                    alert("Lỗi khi cập nhật ưu đãi.");
                }
  }
    
};
    
  const handleOnChangeStock = (value) => setStock(value);
  // Xử lý chọn ảnh và nén ảnh
      const handleImageChange = (event) => {
          const file = event.target.files[0];
          if (file) {
              new Compressor(file, {
                  quality: 0.6,
                  maxWidth: 800,
                  maxHeight: 800,
                  success(result) {
                      const reader = new FileReader();
                      reader.onload = () => {
                          setImage(reader.result); // Cập nhật ảnh đã nén dưới dạng base64
                      };
                      reader.readAsDataURL(result); // Đọc ảnh đã nén dưới dạng base64
                  },
                  error(err) {
                      console.error(err);
                  }
              });
          }
      };

 
  

  //Xử lý nhà xuất bản
 

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

     //Xử lý ngôn ngữ

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

  const handleOnChangeFormat = (e) => {
    setSelectedFormat(e.target.value); 
  };

  const getAllFormat = async () => {
    const res = await FormatService.getAllFormat();
    return res.data;
    };


  const { isLoading: isLoadingFormat, data:formats } = useQuery({
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
  

  const handleOnChangeUnit = (e) => {
    setSelectedUnit(e.target.value); 
  };

  const getAllUnit = async () => {
    const res = await UnitService.getAllUnit();
    return res.data;
    };


  const { isLoading: isLoadingUnit, data:units } = useQuery({
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
        
        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Hình ảnh</label>
                            <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                {img ? (
                                    <img src={img} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                ) : (
                                    <span className="text-muted">Chọn hình ảnh</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="image"
                                className="form-control mt-2"
                                accept="image/*"
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
                  enable = {false}
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
                  enable = {true}
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