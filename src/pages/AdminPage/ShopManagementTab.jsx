import { useQuery } from '@tanstack/react-query';
import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import * as ListAddressService from '../../services/ListAddressService';
import * as ShopProfileService from '../../services/ShopProfileService';
import TextEditor from './partials/TextEditor';

const ShopManagementTab = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [phone, setPhone] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [imageSrcs, setImageSrcs] = useState([]);
  const [facebook, setFacebook] = useState('');
  const [insta, setInsta] = useState('');
  const [policy, setPolicy] = useState('');
  const [instruction, setInstruction] = useState('');

  // Hiển thị địa chỉ lên dropdown
  const getProvinces = async () => {
    const res = await ListAddressService.getProvinces();
    return res?.data || [];
  };

  const { isLoading: isLoadingProvince, data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
  });

  const getDistricts = async (province) => {
    if (!province) return [];
    const res = await ListAddressService.getDistricts(province);
    return res?.data || [];
  };

  const { isLoading: isLoadingDistrict, data: districts, refetch: refetchDistricts } = useQuery(
    ["districts", selectedProvince],
    () => getDistricts(selectedProvince),
    { enabled: !!selectedProvince }
  );

  const getCommunes = async (district) => {
    if (!district) return [];
    const res = await ListAddressService.getCommunes(district);
    return res?.data || [];
  };

  const { isLoading: isLoadingCommune, data: communes, refetch: refetchCommunes } = useQuery(
    ["communes", selectedDistrict],
    () => getCommunes(selectedDistrict),
    { enabled: !!selectedDistrict }
  );

  useEffect(() => {
    if (selectedProvince) {
      refetchDistricts();
    }
  }, [selectedProvince, refetchDistricts]);

  useEffect(() => {
    if (selectedDistrict) {
      refetchCommunes();
    }
  }, [selectedDistrict, refetchCommunes]);

  const allProvinces = Array.isArray(provinces?.data)
    ? provinces.data.map((province) => ({
      value: province._id,
      label: province.name,
    }))
    : [];

  const allDistricts = Array.isArray(districts?.data)
    ? districts.data.map((district) => ({
      value: district._id,
      label: district.name,
    }))
    : [];

  const allCommunes = Array.isArray(communes?.data)
    ? communes.data.map((commune) => ({
      value: commune._id,
      label: commune.name,
    }))
    : [];

  /////////-----show detail------/////////
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await ShopProfileService.getDetailShop();
        const data = response.data;
  
        console.log("Email từ dữ liệu fetched:", data.email);
  
        setEmail(data.email || '');
        setName(data.name || '');
        setSlogan(data.slogan || '');
        setPhone(data.phone || '');
        setLogo(data.logo || '');
        setDescription(data.description || '');
        setSpecificAddress(data.specificAddress || '');
        setSelectedProvince(data.province || '');
        setSelectedDistrict(data.district || '');
        setSelectedCommune(data.commune || '');
        setImageSrcs(data.imageSrcs || []);  // Check data.imageSrcs
        setFacebook(data.facebook || '');
        setInsta(data.insta || '');
        setPolicy(data.policy || '');
        setInstruction(data.instruction || '');
      } catch (error) {
        console.error('Error fetching shop details:', error);
      }
    };
  
    fetchShopDetails();
  }, []);
  

  console.log("Dữ liệu ảnh slide: ", imageSrcs);


  //////////----update------/////////////
  const handleOnChangeName = (value) => setName(value);
  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangeSlogan = (value) => setSlogan(value);
  const handleOnChangePolicy = (value) => setPolicy(value);
  const handleOnChangeFacebook = (value) => setFacebook(value);
  const handleOnChangeInsta = (value) => setInsta(value);
  const handleOnChangeInstruction = (value) => setInstruction(value);
  const handleOnChangePhone = (value) => setPhone(value);
  const handleOnChangeDescription = (value) => setDescription(value);
  const handleOnChangeCommune = (e) => setSelectedCommune(e.target.value);
  const handleOnChangeDistrict = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedCommune("");
  };
  const handleOnChangeProvince = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedCommune("");
  };
  const handleOnChangeSpecificAddress = (value) => setSpecificAddress(value);

  const handleRemoveImage = (index) => {
    const newImageSrcs = [...imageSrcs];
    newImageSrcs.splice(index, 1);
    setImageSrcs(newImageSrcs);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log(files); // Check if files are being selected
    files.forEach((file) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 800,
        maxHeight: 800,
        success(result) {
          const compressedImage = URL.createObjectURL(result);
          setImageSrcs(prevImages => [...prevImages, compressedImage]);
        },
        error(err) {
          console.error(err);
        }
      });
    });
  };
  

  const handleUpdateClick = async () => {

    const updateData = {
      email,
      name,
      slogan,
      phone,
      logo,
      description,
      specificAddress,
      province: selectedProvince,
      disrict: selectedDistrict,
      commune: selectedCommune,
      img: imageSrcs,
      facebook,
      insta,
      policy,
      instruction,
    };

    try {
      const response = await ShopProfileService.updateShop(updateData);
      if (response.status === 'OK') {
        alert("Cập nhật hồ sơ cửa hàng thành công!");
      } else {
        alert("Lỗi khi cập nhật hồ sơ cửa hàng.");
      }
    } catch (error) {
      console.error("Error updating shop: ", error.response ? error.response.data : error);
      alert("Đã xảy ra lỗi khi cập nhật hồ sơ cửa hàng.");
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <div className="title-section">
        <h3 className="text mb-0">HỒ SƠ CỬA HÀNG</h3>
      </div>
      <h3 className="title-profile">Profile</h3>
      <div className="card-profile" style={{ padding: "0 20px" }}>
        <div className="avatar-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '10px', marginTop: '10px' }}>
          <img
            src={logo || 'https://via.placeholder.com/100'}
            alt="Avatar"
            className="avatar-img"
            style={{
              width: '200px',  // Tăng kích thước logo theo yêu cầu
              height: '100px',  // Hình chữ nhật
              borderRadius: '10px', // Nếu bạn muốn có một chút bo góc
              border: '3px solid #ffffff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '10px',
            }}
          />

          <ButtonComponent
            textButton="Chọn logo"
            onClick={() => document.getElementById('fileInput').click()}
          />
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <FormComponent
          id="nameInput"
          label="Tên cửa hàng"
          type="text"
          placeholder="Nhập tên cửa hàng"
          value={name}
          onChange={handleOnChangeName}
        />

        <FormComponent
          id="sloganInput"
          label="Slogan cửa hàng"
          type="text"
          placeholder="Nhập slogan cửa hàng"
          value={slogan}
          onChange={handleOnChangeSlogan}
        />

        <FormComponent
          id="emailInput"
          label="Email"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={handleOnChangeEmail}
        />

        <FormComponent
          id="phoneInput"
          label="Số điện thoại liên hệ"
          type="tel"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={handleOnChangePhone}
        />

        <FormComponent
          id="descriptionInput"
          label="Giới thiệu cửa hàng"
          type="text"
          placeholder="Nhập giới thiệu cửa hàng"
          value={description}
          onChange={handleOnChangeDescription}
        />

        <FormSelectComponent
          label="Tỉnh/Thành phố"
          placeholder={isLoadingProvince ? "Đang tải..." : "Chọn tỉnh/Thành phố"}
          options={allProvinces}
          selectedValue={selectedProvince}
          onChange={handleOnChangeProvince}
          required={true}
        />
        <FormSelectComponent
          label="Quận/Huyện"
          placeholder={isLoadingDistrict ? "Đang tải..." : "Chọn quận/Huyện"}
          options={allDistricts}
          selectedValue={selectedDistrict}
          onChange={handleOnChangeDistrict}
          required={true}
        />
        <FormSelectComponent
          label="Xã/Phường"
          placeholder={isLoadingCommune ? "Đang tải..." : "Chọn xã/Phường"}
          options={allCommunes}
          selectedValue={selectedCommune}
          onChange={handleOnChangeCommune}
          required={true}
        />
        <FormComponent
          id="specificAddressInput"
          label="Địa chỉ cụ thể"
          type="text"
          placeholder="Nhập địa chỉ cụ thể"
          value={specificAddress}
          onChange={handleOnChangeSpecificAddress}
        />
      </div>

      <h3 className="title-profile">Ảnh slide</h3>
      <div className="card-profile" style={{ padding: "0 20px" }}>
        <div className="input" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <input type="file" multiple onChange={handleImageUpload} />
          {imageSrcs.length > 0 && (
  <div>
    <h3>Preview Images</h3>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {imageSrcs.map((src, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <img
            src={src}
            alt={`Uploaded preview ${index}`}
            style={{
              width: '500px',
              height: 'auto',
              margin: '10px',
              objectFit: 'cover',
            }}
          />
          <button
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => handleRemoveImage(index)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>
)}


        </div>
      </div>

      <h3 className="title-profile">Thông tin mạng xã hội</h3>
      <div className="card-profile" style={{ padding: "0 20px" }}>
        <FormComponent
          id="facebookInput"
          label="Facebook"
          type="url"
          placeholder="Nhập URL Facebook"
          value={facebook}
          onChange={handleOnChangeFacebook}
        />
        <FormComponent
          id="instaInput"
          label="Instagram"
          type="url"
          placeholder="Nhập URL Instagram"
          value={insta}
          onChange={handleOnChangeInsta}
        />
      </div>

      <h3 className="title-profile">Chính sách và hướng dẫn</h3>
      <div className="card-profile" style={{ padding: "0 20px" }} >
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <h4 className="label">Chính sách cửa hàng</h4>
          <TextEditor
            value={policy}
            onChange={handleOnChangePolicy}
            placeholder="Nhập chính sách cửa hàng"
          />

          <h4 className="label" style={{ marginTop: '20px' }}>Chính sách cửa hàng</h4>
          <TextEditor
            value={instruction}
            onChange={handleOnChangeInstruction}
            placeholder="Nhập hướng dẫn mua hàng"
          />
        </div>
      </div>

      <div className="button-container" style={{ marginTop: '20px' }}>
        <ButtonComponent
          textButton="Lưu thay đổi"
          onClick={handleUpdateClick}
        />
      </div>
    </div>
  );
};

export default ShopManagementTab;
