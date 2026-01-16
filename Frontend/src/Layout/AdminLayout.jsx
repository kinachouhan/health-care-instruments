
import { Outlet } from "react-router-dom";
import { AdminHeader } from "../Admin/AdminHeader";
import { Footer } from "../Pages/Footer";

export const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <AdminHeader />
    <main className="">
        <Outlet/>
    </main>
    <Footer />
  </div>
);