
import { Header } from "../Pages/Header";
import { Footer } from "../Pages/Footer";
import { Outlet } from "react-router-dom";
import { Navbar } from "../Pages/Navbar";

export const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Navbar/>
    <main className="">
         <Outlet /> 
    </main>
    <Footer />
  </div>
);