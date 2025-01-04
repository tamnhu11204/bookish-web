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

const ProductDetailForm = (isOpen, IDProduct) => {
  // State lưu trữ thông tin sản phẩm
  const [product1, setProduct] = useState({
    name: "Vợ nhặt",
    author: "Kim Lân",
    publisher: "NXB Văn học",
    publishYear: "2024",
    language: "Tiếng Việt",
    weight: "100g",
    dimensions: "26×20×0,5cm",
    pages: "100 trang",
    coverType: "Bìa mềm",
    series: "Không có",
    supplier: "An Nam",
    unit: "Quyển",
    description: `Tác phẩm "Vợ nhặt" của tác giả Kim Lân (1921-2007). Ông là một trong những cây bút viết truyện ngắn xuất sắc nhất của văn học Việt Nam hiện đại. Với "Vợ nhặt", tác giả viết về cái đói, khi con người ta tưởng như khánh kiệt và chỉ muốn chết. Nhưng không, khi đói người ta không nghĩ đến con đường chết mà chỉ nghĩ đến con đường sống.`,
    price: 100000,
    discount: 50,
    discountedPrice: 50000,
    category: "Văn học > Văn học Việt Nam",
    stock: 12,
    sold: 12,
  });

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


   const mutation = useMutationHook(data => ProductService.addProduct(data));
   const { data, isSuccess, isError } = mutation;

   useEffect(() => {
    console.log("Dữ liệu gửi đi: ", product1); // Kiểm tra dữ liệu gửi đi
    console.log(isSuccess);
           if (isSuccess && data?.status !== 'ERR') {
               message.success();
               alert('Thêm sản phẩm mới thành công!');
               //resetForm();
               //set(false);
           }
           if (isError) {
               message.error();
           }
       }, [isSuccess, isError, data?.status]);

   const onSave = async () => {
     if (
      author == "" || name == "" || price == "" ||  
      stock == "" 
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
        setProduct(name,author,pubdate,weight,"","","",page,"",price,priceEntry,discount,stock,img,"","","","","");
        mutation.mutate(productData); // Add new product
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

  //Lấy thông tin product
  const getDetailProduct = async (id) => {
    const detail = await ProductService.getDetailProduct(id);
    return detail.data;
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

  const AllPub =  publishers.map((publisher) => ({

   value: publisher._id,
   label : publisher.name,
     } ));

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


  const { isLoading: isLoadingFormat, data:formats } = useQuery({
    queryKey: ['formats'],
    queryFn: getAllFormat,
    
    });

  const AllFormat=  formats.map((format) => ({

   value: format._id,
   label :format.name,
     } ));

    
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

  const AllSupplier=  suppliers.map((supplier) => ({

   value: supplier._id,
   label : supplier.name,
     } ));


     //Xử lý đơn vị
  const [selectedUnit, setSelectedUnit] = useState("");

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

  const AllUnit=  units.map((unit) => ({

   value: unit._id,
   label : unit.name,
     } ));

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

 const AllCategory =  categories.map((category) => ({

  value: category._id,
  label : category.name,
    } ));
  
  

 


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
          />
        </div>
        <div className="col-6 text-end">
          <ButtonComponent
              textButton="Hủy bỏ"
              //onClick={handleAddLanguage}
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
                  type="text"
                  placeholder="Nhập năm xuất bản"
                  value={pubdate}
                  onChange={handleOnChangeDate}
                  required={true}
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
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="nameLanguageInput"
                  label="Kích thước"
                  type="text"
                  placeholder="Nhập kích thước (ví dụ: 26×20×0,5cm)"
                  value={size}
                  onChange={handleOnChangeSize}
                  required={true}
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
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="nameLanguageInput"
                  label="Giảm giá (%)"
                  type="number"
                  placeholder="Nhập phần trăm giảm giá"
                  value={discount}
                  onChange={handleOnChangeDiscount}
                  required={true}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="nameLanguageInput"
                  label="Giá sau giảm"
                  type="number"
                  placeholder="Tự động tính toán hoặc nhập giá sau giảm"
                  value={priceEntry}
                  //onChange={handleOnChangeName}
                  required={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="nameLanguageInput"
                  label="Tồn kho"
                  type="number"
                  placeholder="Nhập số lượng tồn kho"
                  value={stock}
                  onChange={handleOnChangeStock}
                  required={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="nameLanguageInput"
                  label="Đã bán"
                  type="number"
                  placeholder="Nhập số lượng đã bán"
                  value={0}
                  //onChange={handleOnChangeName}
                  required={true}
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