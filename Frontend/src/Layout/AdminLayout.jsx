import { Outlet, Navigate } from "react-router-dom";
import { AdminHeader } from "../Admin/AdminHeader";
import { useSelector } from "react-redux";

export const AdminLayout = () => {
  const { user, isAuthenticated, loading  } = useSelector(
    (state) => state.user
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
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
