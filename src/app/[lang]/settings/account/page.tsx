"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
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

if (typeof window !== "undefined") {
  const stored = localStorage.getItem("userData");
  if (!stored) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
}

const UserProfile = () => {
  const { token } = useContext(AuthContext);
  const userId = token === "fake-jwt-token" ? 1 : 2;

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
  const [error, setError] = useState("");

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
      setError("User profile not found");
    }
  }, [userId]);

  const router = useRouter();

  if (error)
    return <p className="text-center mt-20 text-lg text-red-500">{error}</p>;
  if (!form.name)
    return <p className="text-center mt-20 text-lg">Loading profile...</p>;

  return (
    <div className="w-full mx-auto h-full">
      <div className="w-full bg-white dark:bg-[#312c4a] dark:text-white rounded-md shadow-2xl p-8 lg:p-10 transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center dark:text-white text-[#0A3A66] mb-10 tracking-wide">
          Your Profile
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Profile Image */}
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
          </div>

          <ReadOnly label="Full Name" value={form.name} />
          <ReadOnly label="Email" value={form.email} />
          <ReadOnly label="Phone" value={form.phone} />
          <div className="md:col-span-2">
            <ReadOnly label="Address" value={form.address} />
          </div>
          <ReadOnly label="Grade" value={form.grade} />
          <ReadOnly label="Project" value={form.class} />
          <ReadOnly label="Blood Group" value={form.blood} />
        </form>
        {/* Submit Button */}
        <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-6">
          <button
            type="submit"
            onClick={() => router.push("/page/userProfile")} // change route as needed
            className="px-6 py-3 flex items-center gap-2 text-lg font-semibold bg-white bg-opacity-70 border border-gray-300 dark:border-gray-700 dark:text-white dark:bg-gray-800 rounded-md shadow-lg hover:scale-105 hover:bg-opacity-100 hover:text-[#0A3A66] dark:hover:text-white transition duration-300 backdrop-blur-md"
          >
            <FiEdit className="text-lg" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

type ReadOnlyProps = {
  label: string;
  value: string;
};

const ReadOnly = ({ label, value }: ReadOnlyProps) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:text-white border-gray-300 shadow-inner bg-gray-50 dark:bg-gray-800 text-gray-800">
      {value || <span className="text-gray-400">Not provided</span>}
    </div>
  </div>
);

export default UserProfile;
