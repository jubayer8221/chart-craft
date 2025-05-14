"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { TbExchange } from "react-icons/tb";
import { AuthContext } from "@/components/context/AuthContext";

type User = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
  blood: string;
};

// Dummy user data
const userData: User[] = [
  {
    id: 1,
    studentId: "STU001",
    name: "Jubayer Al Mahmud",
    email: "jubayer8221@gmail.com",
    photo: "/image/mainuser.png",
    phone: "01903008221",
    grade: 10,
    class: "Science A",
    address: "Khilkhet, Dhaka",
    blood: "AB+",
  },
  {
    id: 2,
    studentId: "STU002",
    name: "Nurul Islam",
    email: "nurulislam@gmail.com",
    photo: "/image/mainuser.png",
    phone: "+1987654321",
    grade: 11,
    class: "Math B",
    address: "456 Oak Ave, Rivertown",
    blood: "A-",
  },
];

// Initialize localStorage with dummy data if empty
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("userData");
  if (!stored) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
}

const UserProfile = () => {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    grade: "",
    class: "",
    blood: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Map token to user ID (simplified for demo; in reality, decode token or use API)
  const userId = token === "fake-jwt-token" ? 1 : 2;

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    const UsersList = stored ? JSON.parse(stored) : userData;
    const data = UsersList.find((c: User) => c.id === userId);
    if (data) {
      setForm({
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
        address: data.address,
        photo: data.photo,
        grade: String(data.grade),
        class: data.class,
        blood: data.blood,
      });
      setPreviewImage(data.photo);
    } else {
      setErrors({ general: "User profile not found" });
    }
  }, [userId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.grade.trim()) newErrors.grade = "Grade is required";
    else if (isNaN(Number(form.grade)) || Number(form.grade) < 1)
      newErrors.grade = "Grade must be a positive number";
    if (!form.class.trim()) newErrors.class = "Project is required";
    if (!form.blood.trim()) newErrors.blood = "Blood group is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (form.phone && !/^\+?\d{10,15}$/.test(form.phone))
      newErrors.phone = "Invalid phone number";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setPreviewImage(imageData);
        setForm({ ...form, photo: imageData });
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
      return;
    }

    const stored = localStorage.getItem("userData");
    const UserList = stored ? JSON.parse(stored) : userData;
    const updatedData = UserList.map((cus: User) =>
      cus.id === userId ? { ...cus, ...form, grade: Number(form.grade) } : cus
    );

    // Save to localStorage and dispatch event to notify Header
    localStorage.setItem("userData", JSON.stringify(updatedData));
    window.dispatchEvent(new Event("storageUpdated"));

    setSuccessMessage("Profile updated successfully!");

    // Redirect after a short delay to show success message
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  if (errors.general)
    return (
      <p className="text-center mt-20 text-lg text-red-500">{errors.general}</p>
    );

  if (!form.name)
    return <p className="text-center mt-20 text-lg">Loading profile...</p>;

  return (
    <div className="w-full mx-auto h-full">
      <div className="w-full bg-white dark:bg-[#312c4a] dark:text-white rounded-md shadow-2xl p-8 lg:p-10 transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center dark:text-white text-[#0A3A66] mb-10 tracking-wide">
          Edit Your Profile
        </h2>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Profile Image Upload */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Profile Preview"
                width={100}
                height={100}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-lg mb-4 border-4 border-white"
              />
            )}
            <label className="relative cursor-pointer">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 w-full h-full z-10 cursor-pointer"
              />
              <span className="inline-block px-6 py-2 bg-white border dark:border-gray-700 dark:text-white dark:bg-gray-800 border-gray-200 rounded-full text-sm text-gray-700 hover:bg-[#E0F2FE] transition shadow-sm">
                Upload New Photo
              </span>
            </label>
            {errors.photo && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                {errors.photo}
              </p>
            )}
          </div>

          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            error={errors.email}
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <div className="md:col-span-2">
            <Input
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>
          <Input
            label="Grade"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            error={errors.grade}
          />
          <Input
            label="Project"
            name="class"
            value={form.class}
            onChange={handleChange}
            error={errors.class}
          />
          <Input
            label="Blood Group"
            name="blood"
            value={form.blood}
            onChange={handleChange}
            error={errors.blood}
          />

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 flex items-center gap-2 text-lg font-semibold bg-white bg-opacity-70 border border-gray-300 dark:border-gray-700 dark:text-white dark:bg-gray-800 rounded-md shadow-lg hover:scale-105 hover:bg-opacity-100 hover:text-[#0A3A66] dark:hover:text-white transition duration-300 backdrop-blur-md"
            >
              <TbExchange className="text-xl" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
};

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}: InputProps) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      className={`px-4 py-2 rounded-lg border dark:border-gray-700 dark:text-white border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0A3A66] focus:border-transparent transition ${
        error ? "border-red-500" : ""
      }`}
      required
    />
    {error && (
      <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
    )}
  </div>
);

export default UserProfile;
