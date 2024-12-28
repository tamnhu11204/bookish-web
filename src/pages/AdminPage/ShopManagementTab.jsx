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

  /////////----update------/////////////
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

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        success(result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogo(reader.result); // Set the compressed base64 string for the logo
          };
          reader.readAsDataURL(result); // Convert compressed logo to base64 string
        },
        error(err) {
          console.error("Error compressing logo: ", err);
        },
      });
    }
  };

  const handleUpdateClick = async () => {
    // Cập nhật thông tin cửa hàng (không có ảnh)
    const updateData = {
      email,
      name,
      slogan,
      phone,
      logo,
      description,
      specificAddress,
      province: selectedProvince,
      district: selectedDistrict,
      commune: selectedCommune,
      facebook,
      insta,
      policy,
      instruction,
    };

    try {
      // Cập nhật thông tin cửa hàng
      const response = await ShopProfileService.updateShop(updateData);
      if (response.status !== 'OK') {
        alert("Lỗi khi cập nhật hồ sơ cửa hàng.");
        return;
      }

      alert("Cập nhật hồ sơ cửa hàng thành công!");
    } catch (error) {
      console.error("Error updating shop:", error.response ? error.response.data : error);
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
              width: '200px',
              height: '100px',
              borderRadius: '10px',
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
            onChange={handleLogoUpload}
          />
        </div>

        <FormComponent
          id="nameInput"
          label="Tên cửa hàng"
          type="text"
          placeholder="Nhập tên cửa hàng"
          value={name}
          onChange={handleOnChangeName}
          required={true}
        />

        <FormComponent
          id="sloganInput"
          label="Slogan cửa hàng"
          type="text"
          placeholder="Nhập slogan cửa hàng"
          value={slogan}
          onChange={handleOnChangeSlogan}
          required={true}
        />

        <FormComponent
          id="emailInput"
          label="Email"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={handleOnChangeEmail}
          required={true}
        />

        <FormComponent
          id="phoneInput"
          label="Số điện thoại liên hệ"
          type="tel"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={handleOnChangePhone}
          required={true}
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

      <h3 className="title-profile">Thông tin mạng xã hội</h3>
      <div className="card-profile" style={{ padding: "0 20px" }}>
        <FormComponent
          id="facebookInput"
          label="Facebook"
          type="text"
          placeholder="Nhập link Facebook"
          value={facebook}
          onChange={handleOnChangeFacebook}
          required={true}
        />

        <FormComponent
          id="instaInput"
          label="Instagram"
          type="text"
          placeholder="Nhập link Instagram"
          value={insta}
          onChange={handleOnChangeInsta}
        />
      </div>

      <h3 className="title-profile">Chính sách và hướng dẫn</h3>
      <div className="card-profile" style={{ padding: "0 20px" }}>
      <h3 className="title" style={{ marginTop: "10px" }}>Chính sách</h3>
        <TextEditor value={policy} onChange={setPolicy} />
        <div style={{ marginBottom: "10px", marginTop: "20px"}}>
        <h3 className="title">Hướng dẫn</h3>
        <TextEditor value={instruction} onChange={setInstruction} />
      </div>
      </div>

      <div className="card-footer" style={{ marginTop: "20px"}}>
        <ButtonComponent textButton="Cập nhật" onClick={handleUpdateClick} />
      </div>
    </div>
  );
};

export default ShopManagementTab;