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
import { useDispatch , useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Products } from './Pages/Products'
import { Toaster } from "react-hot-toast";
import { SinglePageProduct } from './Pages/SinglePageProduct'
import { Profile } from './Pages/Profile'
import { fetchCart } from './Redux/cartSlice'
import { fetchWishList } from './Redux/wishListSlice'
import { Checkout } from './Pages/Checkout'
import { Orders } from './Pages/Orders'

function App() {

   const dispatch = useDispatch()
   const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

   useEffect( ()=>{
          dispatch(getMe())
   },[])

   useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart(true));
    }
  }, [isAuthenticated, dispatch]);


  useEffect(() => {
     if (isAuthenticated) {
    dispatch(fetchWishList(true));
     }
  }, [isAuthenticated, dispatch]);


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
        { path: "/products", element: <Products/> },
        {path: "/product/:id" , element: <SinglePageProduct/> },
        {path: "/profile" , element: <Profile/> },
        {path: "/checkout" , element: <Checkout/>},
        {path: "/orders" , element: <Orders/>}
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout/>,
      children: [
        { index: true, element: <AdminAddProduct /> }, 
        { path: "list", element: <AdminAllProductList /> }, 
        { path: "all-orders", element: <AdminAllOrders /> }, 
        { path:"product/edit/:id",  element: <AdminAddProduct /> }
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
    },
   
  ]);

  return (
    <>
       <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  )
}

export default App
