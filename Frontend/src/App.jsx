import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from './Pages/Home'
import { About } from './Pages/About'
import { Contact } from './Pages/Contact'
import { Cart } from './Pages/Cart'
import { WishList } from './Pages/WishList'
import { AdminAddProduct } from './Admin/AdminAddProduct'
import { AdminAllProductList } from './Admin/AdminAllProductList'
import { AdminAllOrders } from './Admin/AdminAllOrders'
import { UserLayout } from './Layout/UserLayout'
import { AdminLayout } from './Layout/AdminLayout'
import { Login } from './Pages/Login'
import { Signup } from './Pages/Signup'
import { VerifyOtp } from './Pages/VerifyOtp'
import {getMe} from "./Redux/auth"
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

function App() {

   const dispatch = useDispatch()

   useEffect( ()=>{
          dispatch(getMe())
   },[])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout/>,
      children: [
        { path: "/", element: <Home/> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/cart", element: <Cart /> },
        { path: "/wishlist", element: <WishList /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout/>,
      children: [
        { index: true, element: <AdminAddProduct /> }, 
        { path: "list", element: <AdminAllProductList /> }, 
        { path: "all-orders", element: <AdminAllOrders /> }, 
      ],
    },
    {
      path:"/login",
      element: <Login/>
    },
    {
      path:"/signup",
      element: <Signup/>
    },
    {
      path:"/verify-otp",
      element: <VerifyOtp/>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
