import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    orderItems: [],
    orderItemSelected: [],
    phone: '',
    name: '',
    specificAddress: '',
    province: '',
    district: '',
    commune: '',
    paymentMethod: false,
    itemsPrice: 0,
    shippingPrice: 0,
    discount: 0,
    totalMoney: 0,
    note: '',
    payDate: '',
    payActive: false,
    deliverDate: '',
    deliverActive: false,
    user: '',
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
            if (itemOrder) {
                itemOrder.amount += orderItem?.amount
            } else {
                state.orderItems.push(orderItem)
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
            const itemOrderSelected = state?.orderItemSelected?.filter((item) => item?.product === idProduct)
            state.orderItems = itemOrder
            state.orderItemSelected = itemOrderSelected
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount++
            if (itemOrderSelected) {
                itemOrderSelected.amount++
            }

        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount--
            if (itemOrderSelected) {
                itemOrderSelected.amount--
            }
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload;
            // Default listChecked to an empty array if it's undefined or null
            const checkedItems = listChecked || [];
            const itemOrder = state?.orderItems?.filter((item) => !checkedItems.includes(item.product));
            const itemOrderSelected = state?.orderItems?.filter((item) => !checkedItems.includes(item.product));
            state.orderItems = itemOrder;
            state.orderItemSelected = itemOrderSelected;
        },
        seletedOrder: (state, action) => {
            const { listChecked } = action.payload
            const orderSelected = []
            state.orderItems.forEach((order) => {
                if (listChecked.includes((order.product))) {
                    orderSelected.push(order)
                }
            })
            state.orderItemSelected = orderSelected
        },
    }
})

export const { seletedOrder, removeAllOrderProduct, increaseAmount, decreaseAmount, addOrderProduct, removeOrderProduct } = orderSlide.actions
export default orderSlide.reducer