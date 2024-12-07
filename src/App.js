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
import { isJsonString } from './utils'


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData)
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    console.log('check', isJsonString(storageData))
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime=new Date()
    const { decoded } = handleDecoded()
    if(decoded?.exp<currentTime.getTime()/1000){
      const data = await UserService.refreshToken()
      config.headers['token']=`Bearer ${data?.access_token}`
    }
    return config;
  },  (err) => {
    return Promise.reject(err);
  })

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