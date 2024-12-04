import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
 function App() {
  
// console.log('url', process.env.REACT_APP_API_URL_BACKEND)
//   useEffect(()=>{
//     fetchApi()
//   }, [])

//   const fetchApi = async () => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all`);
//     return res.data;
// };

//   const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })

//   console.log('query', query)
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route)=> {
            const Page=route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
                <Layout>
              <Page/>
              </Layout>}/>
            )
            })}
        </Routes>
      </Router>
    </div>
  )
}

export default App