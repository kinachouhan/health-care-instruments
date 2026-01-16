
import { Header } from "../Pages/Header";
import { Footer } from "../Pages/Footer";
import { Outlet } from "react-router-dom";

export const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="">
         <Outlet /> 
    </main>
    <Footer />
  </div>
);