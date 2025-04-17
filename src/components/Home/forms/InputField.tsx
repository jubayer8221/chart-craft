import { UseFormRegister, FieldErrors } from "react-hook-form";

type Inputs = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: Date;
  sex: "male" | "female";
  img: File;
};

interface InputFieldProps {
  label: string;
  name: keyof Inputs;
  type?: string;
  register: UseFormRegister<Inputs>;
  error?: FieldErrors<Inputs>[keyof Inputs];
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  register,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;