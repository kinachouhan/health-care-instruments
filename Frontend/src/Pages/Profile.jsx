import { useEffect, useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Redux/auth";

export const Profile = () => {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipcode: ""
        }
    });

    /* 🔥 Sync redux user → local form */
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone ? String(user.phone) : "",
                address: {
                    street: user.address?.street || "",
                    city: user.address?.city || "",
                    state: user.address?.state || "",
                    country: user.address?.country || "",
                    zipcode: user.address?.zipcode || ""
                }
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // address fields
        if (["street", "city", "state", "country", "zipcode"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
            }));
        }
        // normal fields
        else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };


    /* ✅ Address fields */
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            phone: formData.phone,
            ...formData.address
        };
        dispatch(updateProfile(payload));
    };

    if (!user) return <p className="text-center mt-20">Loading profile...</p>;

    return (
        <div className="bg-[#faf7f3] min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-10">
                    My Profile & Delivery Info
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-10 rounded-2xl shadow-md space-y-6"
                >
                    {/* Name */}
                    <Input
                        label="Full Name"
                        icon={<FaUser />}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    {/* Email */}
                    <Input
                        label="Email"
                        icon={<FaEnvelope />}
                        value={user.email}
                        disabled
                    />

                    {/* Phone */}
                    <Input
                        label="Mobile Number"
                        icon={<FaPhoneAlt />}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    {/* Address */}
                    <Input
                        label="Street Address"
                        icon={<FaMapMarkerAlt />}
                        name="street"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            name="city"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                        />
                        <Input
                            label="State"
                            name="state"
                            value={formData.address.state}
                            onChange={handleAddressChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Zip Code"
                            name="zipcode"
                            value={formData.address.zipcode}
                            onChange={handleAddressChange}
                        />
                        <Input
                            label="Country"
                            name="country"
                            value={formData.address.country}
                            onChange={handleAddressChange}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-red-500 text-white py-3 rounded-lg font-medium transition"
                    >
                        {loading ? "Saving..." : "Save Delivery Information"}
                    </button>
                </form>
            </div>
        </div>
    );
};

/* Reusable Input */
const Input = ({ label, icon, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            {icon && (
                <span className="absolute left-4 top-4 text-gray-400">{icon}</span>
            )}
            <input
                {...props}
                className={`w-full border border-gray-300 rounded-lg ${icon ? "pl-12" : "pl-4"
                    } pr-4 py-3 focus:outline-none focus:border-sky-500 ${props.disabled && "bg-gray-100 cursor-not-allowed"
                    }`}
            />
        </div>
    </div>
);
