import { Outlet, Navigate } from "react-router-dom";
import { AdminHeader } from "../Admin/AdminHeader";
import { useSelector } from "react-redux";

export const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
