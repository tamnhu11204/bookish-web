import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from "react";
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import FormSelectComponent from "../FormSelectComponent/FormSelectComponent"; 
import FormComponent from "../FormComponent/FormComponent";
import "./EnhancedModalComponent.css";
import * as OrderService from '../../services/OrderService'
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from '../../hooks/useMutationHook';
import * as OrderActiveListService from '../../services/OrderActiveListService';


const EnhancedModalComponent = ({
    isOpen,
    title,
    selectedOrder, // Mã đơn hàng
    allActives, // Danh sách trạng thái
    initialStatus = "", // Trạng thái ban đầu
    onClick1, // Hàm submit
    onClick2, // Hàm hủy
    textButton1,
    isLoading,
}) => {
    // State nội bộ
    const [selectedActive, setSelectedActive] = useState(initialStatus);
    const [shippingCode, setShippingCode] = useState("");

    // Reset shippingCode khi trạng thái không phải "Đang vận chuyển"
    useEffect(() => {
        if (selectedActive !== "Đang vận chuyển") {
            setShippingCode("");
        }
    }, [selectedActive]);

    // Xử lý thay đổi trạng thái
    const handleOnChangeActive = (e) => {
        setSelectedActive(e.target.value);
    };

    // Xử lý thay đổi mã vận chuyển
    const handleShippingCodeChange = (e) => {
        setShippingCode(e);
    };

    

     const mutation = useMutationHook(({ orderId, data }) =>
            OrderActiveListService.updateOrderActive(orderId, data)
        );
    
        const { data: mutationData, isSuccess, isError } = mutation;
    
        useEffect(() => {
            if (isSuccess && mutationData?.status !== 'ERR') {
                message.success();
                alert('Cập nhật trạng thái thành công!');
                onClick2();
                
            } else if (isError) {
                message.error();
            }
        }, [mutationData, isError, isSuccess]);
    
        const onSave = async () => {
        const payload = { active: selectedActive, date: new Date() ,shipmentCode: shippingCode};
        console.log('Payload sent:', { orderId: selectedOrder, data: payload });
        mutation.mutate({ orderId: selectedOrder, data: payload });
    
        try {
            const response = await OrderService.updateActiveOrderNow(selectedOrder, payload);
            console.log('Order updated successfully:', response);
            if (response.emailSent) {
                alert('Email đã được gửi thành công!');
            } else if (response.emailError) {
                alert('Gửi email thất bại: ' + response.emailError);
            } else {
                alert('Trạng thái đơn hàng đã được cập nhật!');
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }};

    if (!isOpen) return null;

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <div style={{ marginBottom: "5px" }}>
                        <button
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClick2}
                            disabled={isLoading}
                        ></button>
                    </div>
                </div>
                <div className="modal-body" >
                    <FormComponent
                        id="idInput"
                        label="Mã đơn hàng"
                        type="text"
                        value={selectedOrder}
                        enable={false}
                    />
                    <FormSelectComponent
                        label="Trạng thái đơn hàng"
                        placeholder={isLoading ? "Đang tải..." : "Chọn trạng thái đơn hàng"}
                        options={allActives}
                        selectedValue={selectedActive}
                        onChange={handleOnChangeActive}
                        required={true}
                        name="status"
                    />
                    {selectedActive === "Đang vận chuyển" && (
                        <FormComponent
                            id="shippingCodeInput"
                            label="Mã vận chuyển"
                            type="text"
                            value={shippingCode}
                            onChange={handleShippingCodeChange}
                            placeholder="Nhập mã vận chuyển (VD: 123456789)"
                            enable={true}
                            required={true}
                        />
                    )}
                </div>
                <div className="modal-footer">
                    <ButtonComponent
                        textButton={textButton1}
                        onClick={onSave}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default EnhancedModalComponent;