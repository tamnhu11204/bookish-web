import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ListAddressService from "../../services/ListAddressService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as message from "../../components/MessageComponent/MessageComponent";
import * as UserService from '../../services/UserService';
import Compressor from 'compressorjs';

// Khung chứa các địa chỉ
const AddressItem = ({ phone, province, district, commune, specificAddress, isDefault, onEdit, onDelete }) => {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-center" style={formStyle}>
      <div>
        {isDefault ? (
          <p style={{ color: 'red' }}>Mặc định</p>
        ) : (
          <p></p>
        )}
        <p>{phone}</p>
        <p className="mb-0 text-muted">{specificAddress}, {commune}, {district}, {province}</p>
      </div>
      <div>
        <button
          className="btn btn-sm btn-primary me-2"
          style={{ marginBottom: "5px", fontSize: "16px" }}
          onClick={onEdit}
        >
          <i className="bi bi-pencil-square"></i>
        </button>
        <button
          className="btn btn-sm btn-danger"
          style={{ marginBottom: "5px", fontSize: "16px" }}
          onClick={onDelete}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
};

const formStyle = {
  fontSize: "16px",
};

const AddressTab = () => {
  // Lấy dữ liệu user từ Redux
  const getUser = useSelector((state) => state.user);

  const getAllListAddress = async (user) => {
    const res = await UserService.getAllListAddress(user);  // Gọi API với user và token
    return res.data;
  };

  const { isLoading: isLoadingListAddress, data: listAddressesData } = useQuery({
    queryKey: ["listAddressesData", getUser.id],
    queryFn: () => getAllListAddress(getUser?.id),
    enabled: !!getUser?.id
  });

  const [addressDetails, setAddressDetails] = useState([]);

  useEffect(() => {
    if (listAddressesData) {
      const fetchDetails = async () => {
        const updatedAddresses = await Promise.all(listAddressesData.map(async (address) => {
          const { province, district, commune } = address;

          if (!province || !district || !commune) {
            return address;
          }

          try {
            const provinceDetail = await ListAddressService.getProvinceDetail(province);
            const districtDetail = await ListAddressService.getDistrictDetail(district);
            const communeDetail = await ListAddressService.getCommuneDetail(commune);
            return {
              ...address,
              provinceName: provinceDetail.data.data.name,
              districtName: districtDetail.data.data.name,
              communeName: communeDetail.data.data.name
            };
          } catch (error) {
            console.error("Error fetching address details for:", address, error);
            return address;
          }
        }));

        setAddressDetails(updatedAddresses); // Update state with the detailed addresses
      };

      fetchDetails();
    }
  }, [listAddressesData]);

  console.log('addressDetails', addressDetails)

  // Các state quản lý form
  const [phone, setPhone] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setPhone("");
    setSpecificAddress("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedCommune("");
    setIsDefault(false);
  };

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

  const handleOnChangeIsDefault = (event) => setIsDefault(event.target.checked);
  const handleOnChangePhone = (value) => setPhone(value);
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

  // Mutation để thêm address
  const mutation = useMutationHook((data) => ListAddressService.addListAddress(data));

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.status !== 'ERR') {
      message.success();
      alert("Thêm địa chỉ mới thành công!");
      resetForm();
      setShowModal(false);
    }
    if (mutation.isError) {
      message.error();
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data?.status]);

  const handleAddListAddress = () => setShowModal(true);

  const onSave = async () => {
    const addressData = {
      user: getUser?.id,
      phone,
      isDefault,
      province: selectedProvince,
      district: selectedDistrict,
      commune: selectedCommune,
      specificAddress,
    };

    try {
      await mutation.mutateAsync(addressData);
    } catch (error) {
      console.error("Error while adding address: ", error.response ? error.response.data : error);
      alert("Đã xảy ra lỗi khi thêm địa chỉ, vui lòng thử lại sau.");
    }
  };

  const onCancel = () => {
    alert("Hủy thao tác!");
    resetForm();
    setShowModal(false);
  };

  // State quản lý chỉnh sửa
  const [editModal, setEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editPhone, setEditPhone] = useState("");
  const [editSpecificAddress, setEditSpecificAddress] = useState("");
  const [editIsDefault, setEditIsDefault] = useState(false);

  const handleEditAddress = (address) => {
    setEditModal(true);
    setSelectedAddress(address);
    setEditPhone(address.phone);
    setEditSpecificAddress(address.specificAddress);
    setEditIsDefault(address.isDefault);
    setSelectedProvince(address.province);
    setSelectedDistrict(address.district);
    setSelectedCommune(address.commune);
  };

  const handleOnChangeIsDefaultEdit = (event) => setEditIsDefault(event.target.checked);
  const handleOnChangePhoneEdit = (value) => setEditPhone(value);
  const handleOnChangeSpecificAddressEdit = (value) => setEditSpecificAddress(value);

  const handleSaveEdit = async () => {
    const updatedAddress = {
      phone: editPhone,
      isDefault: editIsDefault,
      province: selectedProvince,
      district: selectedDistrict,
      commune: selectedCommune,
      specificAddress: editSpecificAddress,
    };
  
    try {
      const response = await UserService.updateListAddress(
        getUser?.id,
        selectedAddress._id,
        updatedAddress,
        getUser?.access_token
      );
      if (response.status === 'OK') {
        alert("Cập nhật địa chỉ thành công!");
        setEditModal(false);
      } else {
        alert("Lỗi khi cập nhật địa chỉ.");
      }
    } catch (error) {
      console.error("Error updating address: ", error.response ? error.response.data : error);
      alert("Đã xảy ra lỗi khi cập nhật địa chỉ.");
    }
    
  };

  const onCancel2 = () => {
    alert("Hủy thao tác!");
    resetForm();
    setEditModal(false);
  };

  ///////xóa
  const handleDeleteAddress = async (addressId) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirmed = confirm("Bạn có chắc chắn muốn xóa địa chỉ này?");
        if (isConfirmed) {
          await UserService.deleteListAddress(getUser?.id,addressId._id,getUser?.access_token);
          alert("Xóa địa chỉ thành công!");
        }
    } catch (error) {
      console.error("Error deleting address: ", error);
      alert("Đã xảy ra lỗi khi xóa địa chỉ.");
    }
  };

  return (
    <div className="container mt-4" style={formStyle}>
      <div className="title-section">
        <h3 className="text mb-0">ĐỊA CHỈ</h3>
      </div>
      <div className="content-section" style={{ marginTop: "30px",  marginBottom: "30px" }}>

            <ButtonComponent textButton="Thêm địa chỉ" icon={<i className="bi bi-plus-circle"></i>} onClick={handleAddListAddress} />

      </div>

      <div className="list-group">
        {isLoadingListAddress ? (
          <p>Đang tải...</p>
        ) : addressDetails?.length === 0 ? (
          <p>Chưa có địa chỉ nào.</p>
        ) : (
          addressDetails.map((item) => (
            <AddressItem
              key={item._id}
              phone={item.phone}
              province={item.provinceName || ""}
              district={item.districtName || ""}
              commune={item.communeName || ""}
              specificAddress={item.specificAddress}
              isDefault={item.isDefault}
              onEdit={() => handleEditAddress(item)}
              onDelete={() => handleDeleteAddress(item)}
              //onDelete={() => handleDeleteAddress(item._id)}
            />
          ))
        )}
      </div>

      {/* Modal thêm địa chỉ */}
      <ModalComponent
        isOpen={showModal}
        title="THÊM ĐỊA CHỈ MỚI"
        body={
          <>
            <FormComponent
              id="phoneInput"
              label="Số điện thoại"
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={handleOnChangePhone}
              required={true}
              enable={true}
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
              enable={true}
            />
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="defaultAddressCheck"
                checked={isDefault}
                onChange={handleOnChangeIsDefault}
              />
              <label className="form-check-label" htmlFor="defaultAddressCheck">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </>
        }
        textButton1="Thêm"
        onClick1={onSave}
        onClick2={onCancel}
      />

      {/* Modal chỉnh sửa địa chỉ */}
      <ModalComponent
        isOpen={editModal}
        title="CẬP NHẬT ĐỊA CHỈ"
        body={
          <>
            <FormComponent
              id="editPhoneInput"
              label="Số điện thoại"
              type="text"
              placeholder="Nhập số điện thoại"
              value={editPhone}
              onChange={handleOnChangePhoneEdit}
              enable={true}
            />
            <FormSelectComponent
              label="Tỉnh/Thành phố"
              options={allProvinces}
              selectedValue={selectedProvince}
              onChange={handleOnChangeProvince}
            />
            <FormSelectComponent
              label="Quận/Huyện"
              options={allDistricts}
              selectedValue={selectedDistrict}
              onChange={handleOnChangeDistrict}
            />
            <FormSelectComponent
              label="Xã/Phường"
              options={allCommunes}
              selectedValue={selectedCommune}
              onChange={handleOnChangeCommune}
            />
            <FormComponent
              id="editSpecificAddressInput"
              label="Địa chỉ cụ thể"
              type="text"
              placeholder="Nhập địa chỉ cụ thể"
              value={editSpecificAddress}
              onChange={handleOnChangeSpecificAddressEdit}
              enable={true}
            />
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="editDefaultAddressCheck"
                checked={editIsDefault}
                onChange={handleOnChangeIsDefaultEdit}
              />
              <label className="form-check-label" htmlFor="editDefaultAddressCheck">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </>
        }
        textButton1="Cập nhật"
        onClick1={handleSaveEdit}
        onClick2={onCancel2}
      />
    </div>
  );
};

export default AddressTab;
