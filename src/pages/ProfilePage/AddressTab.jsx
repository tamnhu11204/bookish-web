import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ListAddressService from "../../services/ListAddressService";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from "@tanstack/react-query";

const AddressItem = ({ phone, address }) => {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-center" style={formStyle}>
      <div>
        {phone}
        <p className="mb-0 text-muted">{address}</p>
      </div>
      <div>
        <button className="btn btn-sm btn-primary me-2" style={{ marginBottom: "5px", fontSize: "16px" }}>
          <i className="bi bi-pencil-square"></i>
        </button>
        <button className="btn btn-sm btn-danger" style={{ marginBottom: "5px", fontSize: "16px" }}>
          <i className="bi bi-trash"></i>
        </button>
        <ButtonComponent textButton="Đặt làm mặc định" />
      </div>
    </div>
  );
};

const formStyle = {
  fontSize: "16px",
};

const AddressTab = () => {
  const [phone, setPhone] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  const resetForm = () => {
    setPhone("");
    setSpecificAddress("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedCommune("");
  };

  // Lấy danh sách tỉnh/thành phố
  const getProvinces = async () => {
    const res = await ListAddressService.getProvinces();
    return res?.data || []; // Trả về mảng rỗng nếu không có dữ liệu
  };

  const { isLoading: isLoadingProvince, data: provinces, error } = useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
  });

  // Lấy danh sách quận/huyện theo tỉnh
  const getDistricts = async (provinceId) => {
    if (!provinceId) return [];
    const res = await ListAddressService.getDistricts(provinceId);
    return res?.data || []; // Trả về mảng rỗng nếu không có dữ liệu
  };

  

  const { isLoading: isLoadingDistrict, data: districts, refetch: refetchDistricts } = useQuery(
    ["districts", selectedProvince],
    () => getDistricts(selectedProvince),
    { enabled: !!selectedProvince } // Chỉ gọi khi có tỉnh
  );

  console.log('Province ID:', selectedProvince);

  // Lấy danh sách xã/phường theo quận
  const getCommunes = async (districtId) => {
    if (!districtId) return [];
    const res = await ListAddressService.getCommunes(districtId);
    return res?.data || []; // Trả về mảng rỗng nếu không có dữ liệu
  };

  const { isLoading: isLoadingCommune, data: communes, refetch: refetchCommunes } = useQuery(
    ["communes", selectedDistrict],
    () => getCommunes(selectedDistrict),
    { enabled: !!selectedDistrict } // Chỉ gọi khi có quận
  );

  // Kiểm tra lỗi nếu có
  useEffect(() => {
    if (error) {
      console.error("Error fetching provinces:", error);
    }
  }, [error]);

  // Chuyển đổi danh sách provinces thành mảng các options
  const allProvinces = Array.isArray(provinces?.data)
    ? provinces.data.map((province) => ({
        value: province._id,
        label: province.name,
      }))
    : [];

  // Chuyển đổi danh sách districts thành mảng các options
  const allDistricts = Array.isArray(districts)
    ? districts.map((district) => ({
        value: district._id,
        label: district.name,
      }))
    : [];

  // Chuyển đổi danh sách communes thành mảng các options
  const allCommunes = Array.isArray(communes)
    ? communes.map((commune) => ({
        value: commune._id,
        label: commune.name,
      }))
    : [];

  // Mutation để thêm address
  const mutation = useMutationHook((data) => ListAddressService.addListAddress(data));

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.status !== "ERR") {
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
      phone,
      provinceId: selectedProvince,
      districtId: selectedDistrict,
      communeId: selectedCommune,
      specificAddress,
    };

    await mutation.mutateAsync(addressData);
  };

  const onCancel = () => {
    alert("Hủy thao tác!");
    resetForm();
    setShowModal(false);
  };

  const addresses = [
    {
      name: "Kim Ngân",
      phone: "0123456xxx",
      address: "Tô Hiến Thành, Thị trấn Vạn Giã, Huyện Vạn Ninh, Tỉnh Khánh Hòa",
    },
    {
      name: "Kim Ngân",
      phone: "0123456xxx",
      address: "Tô Hiến Thành, Thị trấn Vạn Giã, Huyện Vạn Ninh, Tỉnh Khánh Hòa",
    },
    {
      name: "Kim Ngân",
      phone: "0123456xxx",
      address: "Tô Hiến Thành, Thị trấn Vạn Giã, Huyện Vạn Ninh, Tỉnh Khánh Hòa",
    },
  ];

  return (
    <div className="container mt-4" style={formStyle}>
      <div className="title-section">
        <h3 className="text mb-0">ĐỊA CHỈ</h3>
      </div>
      <div className="content-section" style={{ marginTop: "30px" }}>
        <div className="row align-items-center mb-3">
          <div className="col-6">
            <FormComponent id="searchInput" type="text" placeholder="Tìm kiếm theo địa chỉ" />
          </div>

          <div className="col-6 text-end">
            <ButtonComponent textButton="Thêm địa chỉ" icon={<i className="bi bi-plus-circle"></i>} onClick={handleAddListAddress} />
          </div>
        </div>
      </div>

      <div className="list-group">
        {addresses.map((item, index) => (
          <AddressItem key={index} name={item.name} phone={item.phone} address={item.address} />
        ))}

        {/* Modal thêm đơn vị */}
        <ModalComponent
          isOpen={showModal}
          title="THÊM ĐỊA CHỈ MỚI"
          body={
            <>
              <FormComponent
                id="phoneInput"
                label="Số điện thoại"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <FormSelectComponent
                label="Tỉnh/Thành phố"
                placeholder={isLoadingProvince ? "Đang tải..." : "Chọn tỉnh/Thành phố"}
                options={allProvinces} // Chỉ render khi provinces đã có dữ liệu
                selectedValue={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict(""); // Reset quận/huyện khi thay tỉnh
                  setSelectedCommune(""); // Reset xã/phường khi thay tỉnh
                }}
              />
              <FormSelectComponent
                label="Quận/Huyện"
                placeholder={isLoadingDistrict ? "Đang tải..." : "Chọn quận/huyện"}
                options={allDistricts} // Cập nhật danh sách quận
                selectedValue={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedCommune(""); // Reset xã/phường khi thay quận
                }}
              />
              <FormSelectComponent
                label="Xã/Phường"
                placeholder={isLoadingCommune ? "Đang tải..." : "Chọn xã/phường"}
                options={allCommunes} // Cập nhật danh sách xã
                selectedValue={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
              />
              <FormComponent
                id="specificAddressInput"
                label="Địa chỉ cụ thể"
                type="text"
                placeholder="Nhập địa chỉ cụ thể"
                value={specificAddress}
                onChange={(e) => setSpecificAddress(e.target.value)}
              />
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="defaultAddress" />
                <label className="form-check-label" htmlFor="defaultAddress">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </>
          }
          textButton1="Thêm"
          onClick1={onSave}
          onClick2={onCancel}
        />
      </div>
    </div>
  );
};

export default AddressTab;
