import React, { useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import AddAddress from './AddAddress'

const AddressItem = ({ name, phone, address }) => {
    return (
      <div className="list-group-item d-flex justify-content-between align-items-center" style={formStyle}>
        <div>
          <strong>{name}</strong> | {phone}
          <p className="mb-0 text-muted">{address}</p>
        </div>
        <div>
          <button className="btn btn-link text-success" style={formStyle}>Cập nhật</button>
          <button className="btn btn-success" style={formStyle}>Đặt làm mặc định</button>
        </div>
      </div>
    );
  };

  const formStyle = {
    fontSize: "16px", // Tăng cỡ chữ toàn bộ form
  };

  

const AddressTab = () => {
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
    
      const [showModal, setShowModal] = useState(false);
      const [modalTitle, setModalTitle] = useState('');
      const [modalBody, setModalBody] = useState(null);
      const [textButton1, setTextButton1] = useState(''); // Nút Lưu/Cập nhật
      const [onSave, setOnSave] = useState(() => () => {});
      const [onCancel, setOnCancel] = useState(() => () => {});
    
      const handleAddLanguage = () => {
        setModalTitle('THÊM NGÔN NGỮ');
       
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Đã thên địa chỉ!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm địa chỉ!');
            setShowModal(false);
        });
        setShowModal(true);
    }

      return (
        <div className="container mt-4" style={formStyle}>
              <div className="title-section">
                <h3 className="text mb-0">ĐỊA CHỈ</h3>
            </div>
         <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo địa chỉ"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm ngôn ngữ"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddLanguage}
                        />
                    </div>
                </div>
                </div>
          <div className="list-group">
            {addresses.map((item, index) => (
              <AddressItem
                key={index}
                name={item.name}
                phone={item.phone}
                address={item.address}
              />
            ))}

<AddAddress
        isOpen={showModal}
        onClick11={onSave}
        onClick12={onCancel} />
          </div>
        </div>
      );
    };

export default AddressTab;