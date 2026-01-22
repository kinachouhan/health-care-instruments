export const About = () => {
  return (
    <div className="bg-[#faf7f3] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800">
            About Us
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Trusted dental products for professionals across India
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Image Section */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
              alt="Dental Equipment"
              className="rounded-2xl shadow-lg object-cover w-full h-[380px]"
            />
          </div>

          {/* Text Section */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-sky-600 mb-4">
              Who We Are
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              We are an India-based individual seller focused on providing
              high-quality dental equipment, instruments, and consumables
              for dental professionals. Our platform is designed to make
              dental purchasing simple, reliable, and accessible.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Every product is carefully selected to meet daily clinical
              requirements, ensuring reliability, safety, and performance
              for dental clinics and practitioners across India.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="font-semibold text-sky-600">India Only</p>
                <p className="text-gray-600 mt-1">Nationwide Delivery</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="font-semibold text-sky-600">Trusted Quality</p>
                <p className="text-gray-600 mt-1">Carefully Selected Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-md p-10 text-center">
          <h2 className="text-2xl font-semibold text-sky-600 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our mission is to support dental professionals by providing
            dependable dental products at transparent prices, while
            continuously improving our service and expanding our product
            range to meet evolving clinical needs.
          </p>
        </div>

      </div>
    </div>
  );
};
