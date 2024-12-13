import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  access_token: '',
  phone: '',
  img: '',
  birthday: '',
  gender: '',
  id:''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name='', email='', access_token='', phone='',img='',birthday='',gender='', _id='' } = action.payload
      state.id = _id;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.img = img;
      state.birthday = birthday;
      state.gender = gender;
      state.access_token = access_token
    },
    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.access_token = '';
      state.phone= '';
      state.img='';
      state.birthday= '';
      state.gender= '';
      state.id = '';
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer