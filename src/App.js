import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as UserService from './../src/services/UserService';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { updateUser } from './redux/slides/UserSlide';
import { routes } from './routes';
import { isJsonString } from './utils';
import LoadingComponent from './components/LoadingComponent/LoadingComponent';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);  // Mặc định là true để bắt đầu loading

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    } else {
      setIsLoading(false);
    }

    // GỬI DỮ LIỆU SANG CHATBOT IFRAME
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("access_token"));

    const sendMessageToChatbot = () => {
      const iframe = document.querySelector("iframe[src*='localhost:8000']");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: "USER_DATA",
            payload: {
              user,
              token,
            },
          },
          "*"
        );
      }
    };

    // Delay chút để iframe render xong
    setTimeout(sendMessageToChatbot, 1000);
  }, []);


  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers['token'] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setIsLoading(false);  // Đảm bảo setIsLoading luôn được gọi sau khi lấy dữ liệu
    }
  };

  return (
    <div>
      <LoadingComponent isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const isCheckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader || route.isShowFooter ? DefaultComponent : Fragment;

              return (
                <Route
                  key={route.path}
                  path={isCheckAuth ? route.path : undefined}
                  element={
                    <Layout isShowFooter={routes.isShowFooter}>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </LoadingComponent>
    </div>
  );

}

export default App;
