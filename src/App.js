import 'bootstrap-icons/font/bootstrap-icons.css'
import { jwtDecode } from 'jwt-decode'
import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css"
import * as UserService from './../src/services/UserService'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { updateUser } from './redux/slides/UserSlide'
import { routes } from './routes'


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData)
    }
    console.log('storageData', storageData)
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    // console.log("storageData", storageData);

    let decoded = {};
    if (storageData) {
      try {
        decoded = jwtDecode(storageData);
        console.log("decoded", decoded);
      } catch (error) {
        console.error("Token không hợp lệ", error);
      }
    }
    return { decoded, storageData };
  };
  

   //token hết hạn
   UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        // console.log("decoded?.exp", decoded?.exp);

        try {
          const data = await UserService.refreshToken();
          // localStorage.setItem("access_token", data?.access_token);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } catch (error) {
          console.error("Lỗi khi làm mới token", error);
        }
      }
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
                <Layout>
                  <Page />
                </Layout>} />
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App