import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo trạng thái ban đầu
const initialState = {
  email: '',
  name: '',
  slogan: '',
  phone: '',
  logo: '',
  description: '',
  specificAddress: '',
  selectedProvince: '',
  selectedDistrict: '',
  selectedCommune: '',
  imageSrcs: [],
  facebook: '',
  insta: '',
  policy: '',
  instruction: '',
  bank: '',
  momo: '',
  deliveryFee: 0, 
};

// Tạo slice cho Redux
export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateShop: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetShop: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateShop, resetShop } = shopSlice.actions;

export default shopSlice.reducer;
