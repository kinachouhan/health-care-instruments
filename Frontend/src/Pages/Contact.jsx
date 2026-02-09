import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const Contact = () => {
  return (
    <div className="bg-[#faf7f3] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800">
            Contact Us
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Have questions or need assistance? We’re here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-sky-600 mb-2">
              Get in Touch
            </h2>

            <p className="text-gray-700">
              Feel free to reach out for product inquiries, order support,
              or general questions. We respond as quickly as possible.
            </p>

            <div className="flex items-center gap-4">
              <div className="bg-sky-100 p-3 rounded-full">
                <FaPhoneAlt className="text-sky-600" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">+91 9560888720</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-sky-100 p-3 rounded-full">
                <FaEnvelope className="text-sky-600" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">mihitenterprises18@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-sky-100 p-3 rounded-full">
                <FaMapMarkerAlt className="text-sky-600" />
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">
                  India (Shipping available across India)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-sky-600 mb-6">
              Send a Message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500"
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500"
              />

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-red-500 text-white py-3 rounded-lg font-medium transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-16 text-gray-600 text-sm">
          We usually respond within 24 hours on business days.
        </div>
      </div>
    </div>
  );
};
