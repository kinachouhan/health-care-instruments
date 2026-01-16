

export const Home = () => {
  return (
      <div className="bg-gradient-to-r from-sky-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center sm:py-20">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Premium Dental Products, Trusted by Professionals
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Shop top-quality dental tools, hygiene kits, and cosmetic care essentials — all in one place.
          </p>
          <a
            href="/products"
            className="inline-block bg-sky-500 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            Shop Now
          </a>
        </div>
      </div>
  );
};
