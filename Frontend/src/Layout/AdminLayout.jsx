
import { Outlet } from "react-router-dom";
import { AdminHeader } from "../Admin/AdminHeader";

export const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <AdminHeader />
    <main className="">
        <Outlet/>
    </main>
    
  </div>
);