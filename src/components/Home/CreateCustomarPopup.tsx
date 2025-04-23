// import { employeesData } from "@/lib/data";
import { Customar } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { VscGitPullRequestCreate } from "react-icons/vsc";


// type Employee = typeof employeesData[0];
// type Customar = {
//     id: string;
//     studetnId: string; // Note: There's a typo in the original code ("studetnId")
//     name: string;
//     email: string;
//     photo: string;
//     phone: string;
//     address: string;
//     grade: number;
//     class: string; // Single string, not an array like in Employee
//     blood: string;
//   };

type customarPopupProps = {
  onClose: () => void;
  onAddCustomar: (customar: Customar) => void; // New prop to pass employee data
};

const CreateCustomarPopup = ({
  onClose,
  onAddCustomar,
}: customarPopupProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    grade: "",
    class: "",
    blood: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "photo") {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file); // Convert image to base64
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate and convert grade
  const grade = parseInt(formData.grade);
  if (isNaN(grade)) {
    alert("Please enter a valid grade number");
    return;
  }

  const newCustomar: Customar = {
    id: Date.now(), // Generates a number (correct for id: number)
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email || undefined, // Handle optional field
    phone: formData.phone || undefined, // Handle optional field
    address: formData.address,
    grade, // Use validated number
    studentId: `C${Math.floor(1000 + Math.random() * 9000)}`, // Fix typo (studetnId -> studentId)
    photo: previewImage || "/default-photo.png", // Use default if no photo
    class: formData.class,
    blood: formData.blood,
  };
    onAddCustomar(newCustomar); // Call the callback to add employee
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative z-50 p-4 bg-zinc-400 rounded-lg shadow-lg flex flex-col w-full max-w-4xl">
        <button
          onClick={onClose}
          className="transition-colors pb-4 self-end"
          aria-label="Close popup"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
            <IoClose className="text-xl text-gray-600" />
          </div>
        </button>

        <div className="bg-white rounded-md shadow-2xl p-6 sm:p-8 lg:p-14 transition-all duration-300 w-full max-h-[90vh] overflow-y-auto scrollbar-hiden">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-[#0A3A66] mb-8 tracking-wide">
            Create Customar 
          </h2>
          {/* Profile Image Upload */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center mb-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg mb-4 border-4 border-white">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  unoptimized
                  width={112}
                  height={112}
                />
              ) : (
                <span className="text-gray-500 text-sm">No Image</span>
              )}
            </div>
            <label className="relative cursor-pointer">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 w-full h-full z-10 cursor-pointer"
              />
              <span className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-[#0A3A66] hover:bg-gray-100 transition shadow-sm">
                Upload New Photo
              </span>
            </label>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <div className="flex flex-col">
              <h3 className="text-5 mx-2 mb-2">First Name</h3>
              <input
                name="firstName"
                placeholder="First name"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-5 mx-2 mb-2">Last Name</h3>
              <input
                name="lastName"
                placeholder="Last name"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-5 mx-2 mb-2">Email</h3>
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-5 mx-2 mb-2">Phone</h3>
              <input
                name="phone"
                type="tel"
                placeholder="Your Number"
                required
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col md:col-span-2 lg:col-span-2">
              <h1 className="text-5 mx-2 mb-2">Address</h1>
              <input
                name="address"
                type="text"
                placeholder="Your address"
                required
                value={formData.address}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-5 mx-2 mb-2">Grade</h1>
              <input
                name="grade"
                type="number"
                placeholder="Your grade"
                required
                value={formData.grade}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-5 mx-2 mb-2">Project</h1>
              <input
                name="class"
                type="text"
                placeholder="Your project (comma-separated)"
                required
                value={formData.class}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-5 mx-2 mb-2">Blood</h1>
              <input
                name="blood"
                type="text"
                placeholder="Your Blood"
                required
                value={formData.blood}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 flex items-center gap-2 text-base sm:text-lg font-semibold bg-white bg-opacity-70 border border-gray-300 rounded-md shadow-lg hover:scale-105 hover:bg-opacity-100 hover:text-[#0A3A66] transition duration-300 backdrop-blur-md"
              >
                <VscGitPullRequestCreate className="text-xl" /> Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomarPopup;
