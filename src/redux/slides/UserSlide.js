import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  access_token: '',
  phone: '',
  img: '',
  birthday: '',
  gender: '',
  id:'',
  //isLoggedIn: false,
  isAdmin:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name='', email='', access_token='', phone='',img='',birthday='',gender='', _id='', isAdmin } = action.payload
      state.id = _id;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.img = img;
      state.birthday = birthday;
      state.gender = gender;
      state.access_token = access_token;
      //state.isLoggedIn = !!access_token;
      state.isAdmin = isAdmin
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
      state.access_token = false;
      //state.isLoggedIn = false;
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer