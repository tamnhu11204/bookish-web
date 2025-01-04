import { createSlice } from '@reduxjs/toolkit';

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
  bank:'',
  momo:'',
  deliveryFee:0
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateShop: (state, action) => {
      const {
        email ,
        name,
        slogan ,
        phone ,
        logo ,
        description ,
        specificAddress ,
        selectedProvince ,
        selectedDistrict ,
        selectedCommune ,
        imageSrcs ,
        facebook ,
        insta ,
        policy ,
        instruction ,
        bank,
        momo,
        deliveryFee
      } = action.payload;

      state.email = email;
      state.name = name;
      state.slogan = slogan;
      state.phone = phone;
      state.logo = logo;
      state.description = description;
      state.specificAddress = specificAddress;
      state.selectedProvince = selectedProvince;
      state.selectedDistrict = selectedDistrict;
      state.selectedCommune = selectedCommune;
      state.imageSrcs = imageSrcs;
      state.facebook = facebook;
      state.insta = insta;
      state.policy = policy;
      state.instruction = instruction;
      state.bank = bank;
      state.momo = momo;
      state.deliveryFee = deliveryFee;
    },
    resetShop: (state) => {
      state.email = '';
      state.name = '';
      state.slogan = '';
      state.phone = '';
      state.logo = '';
      state.description = '';
      state.specificAddress = '';
      state.selectedProvince = '';
      state.selectedDistrict = '';
      state.selectedCommune = '';
      state.imageSrcs = [];
      state.facebook = '';
      state.insta = '';
      state.policy = '';
      state.instruction = '';
      state.bank = '';
      state.momo = '';
      state.deliveryFee = '';
    }
  }
});

export const { updateShop, resetShop } = shopSlice.actions;

export default shopSlice.reducer;
