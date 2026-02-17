import { FaWhatsapp } from "react-icons/fa";

export const WhatsAppButton = ({ message = "Hello Admin, I have a query." }) => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition duration-300 z-50"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};
