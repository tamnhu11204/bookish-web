import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedProducts: [null, null, null], // 3 vị trí sản phẩm, mặc định là null
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addSelectedProduct: (state, action) => {
      const { index, product } = action.payload;
      state.selectedProducts[index] = product;
    },
    removeSelectedProduct: (state, action) => {
      state.selectedProducts[action.payload] = null; // Xóa sản phẩm tại vị trí được chỉ định
    },
  },
});

export const { addSelectedProduct, removeSelectedProduct } = comparisonSlice.actions;

export default comparisonSlice.reducer;
