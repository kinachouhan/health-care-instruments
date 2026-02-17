import { Header } from "../Pages/Header";
import { Footer } from "../Pages/Footer";
import { Outlet } from "react-router-dom";
import { Navbar } from "../Pages/Navbar";
import { useSelector } from "react-redux";
import { WhatsAppButton } from "../Components/WhatsappButton";

export const UserLayout = () => {
  const { loading } = useSelector((state) => state.user);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton/>
    </div>
  );
};
