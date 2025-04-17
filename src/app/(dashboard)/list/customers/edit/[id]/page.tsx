"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { customarsData } from "@/lib/data";
import Image from "next/image";

import { TbExchange } from "react-icons/tb";

type Customar = {
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

const EditCustomarPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [customar, setCustomar] = useState<Customar | null>(null);
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

  useEffect(() => {
    const data = customarsData.find((c) => c.id === id);
    if (data) {
      setCustomar(data);
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
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setForm({ ...form, photo: file.name });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated data:", { id, ...form });
    router.push("/list/customers");
  };

  if (!customar) return <p className="text-center mt-20 text-lg">Loading customer...</p>;

  return (
    <div className="min-h-screen px-4 py-4 lg:py-4 bg-gradient-to-tr from-[#f4f7ff] to-[#e9ecf3]">
      <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-14 border border-white/40 transition-all duration-300">

        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#0A3A66] mb-10 tracking-wide">
          Edit Customer Profile
        </h2>

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
              <span className="inline-block px-6 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-[#E0F2FE] transition shadow-sm">
                Upload New Photo
              </span>
            </label>
          </div>

          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Input label="Grade" name="grade" value={form.grade} onChange={handleChange} />
          <Input label="Project" name="class" value={form.class} onChange={handleChange} />
          <Input label="Blood Group" name="blood" value={form.blood} onChange={handleChange} />

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 flex items-center gap-2 text-lg font-semibold bg-white bg-opacity-70 border border-gray-300 rounded-full shadow-lg hover:scale-105 hover:bg-opacity-100 hover:text-[#0A3A66] transition duration-300 backdrop-blur-md"
            >
               <TbExchange className="text-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomarPage;

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const Input = ({ label, name, value, onChange, type = "text" }: InputProps) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="px-4 py-2 rounded-lg border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0A3A66] focus:border-transparent transition"
      required
    />
  </div>
);
