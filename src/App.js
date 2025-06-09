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
import LoadingComponent from './components/LoadingComponent/LoadingComponent';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    } else {
      setIsLoading(false);
    }

    const sendMessageToChatbot = () => {
      const iframe = document.querySelector("iframe[src*='localhost:8000']");
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("access_token");
      if (iframe && iframe.contentWindow && user && token) {
        iframe.contentWindow.postMessage(
          {
            type: "USER_DATA",
            payload: { user, token },
          },
          "*"
        );
      }
    };

    const timeoutId = setTimeout(sendMessageToChatbot, 1500);

    return () => clearTimeout(timeoutId);
  }, [user]);

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {};
    if (storageData) {
      try {
        decoded = jwtDecode(storageData);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
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
        localStorage.setItem('access_token', data?.access_token);
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
      setIsLoading(false);
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
                    Layout === DefaultComponent ? (
                      <Layout isShowFooter={route.isShowFooter}>
                        <Page />
                      </Layout>
                    ) : (
                      <Fragment>
                        <Page />
                      </Fragment>
                    )
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