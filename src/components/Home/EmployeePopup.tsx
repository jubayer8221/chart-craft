import Image from "next/image";
import { IoClose } from "react-icons/io5";
import Performance from "./Performance";
import Announcements from "./Announcements";
import Link from "next/link";
// import BigCalendar from "./BigCalendar";
import { useEffect } from "react";
import { RiProjectorLine } from "react-icons/ri";
import { MdOutlineBloodtype } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { TbPhoneRinging } from "react-icons/tb";
import MainClander from "./Calendar/MainClander";

type Employee = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  subjects?: string[];
  grade: number;
  classes: string[];
  address: string;
  blood: string;
};

type EmployeePopupProps = {
  employee: Employee;
  onClose: () => void;
};

const EmployeePopup = ({ employee, onClose }: EmployeePopupProps) => {
  // Default placeholder image for employee photo
  const defaultPhoto = "/assets/default-user.png"; // Replace with your default image path
  const defaultIcon = "/assets/fallback-icon.png"; // Replace with your fallback icon path

  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 "
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div
        className="relative z-50 w-full max-w-6xl bg-zinc-400 dark:bg-[#463f59]
       rounded-lg shadow-lg flex flex-col pb-4"
      >
        <button
          onClick={onClose}
          className="transition-colors p-2 self-end"
          aria-label="Close popup"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
            <IoClose className="text-xl text-gray-600" />
          </div>
        </button>
        {/* employee info  */}
        <div className="flex flex-col xl:flex-row p-4 gap-4 max-h-[90vh] overflow-y-auto scrollbar-hiden ">
          {/* Left Section */}
          <div className="w-full xl:w-2/3">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* User Info Card */}
              <div className="bg-[#C3EBFA] dark:bg-[#312c4a] py-6 px-4 rounded-md w-full sm:w-full md:w-full xl:w-1/2 flex items-center flex-wrap gap-4">
                <div>
                  <Image
                    src={employee.photo || defaultPhoto}
                    alt={`${employee.name}'s profile picture`}
                    width={144}
                    height={144}
                    className="w-36 h-36 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = defaultPhoto)}
                  />
                </div>
                <div className="w-full xl:w-1/2 flex flex-col justify-between">
                  <h1 className="text-xl font-semibold">{employee.name}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                    <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full">
                      <MdOutlineBloodtype className="text-[16px] dark:text-white" />
                      <span>{employee.blood}</span>
                    </div>
                    <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full">
                      <IoCalendarOutline className="text-[16px] dark:text-white" />
                      <span>January 2025</span>
                    </div>
                    <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full">
                      <MdOutlineMail className="text-[16px] dark:text-white" />
                      <span>{employee.email || "N/A"}</span>
                    </div>
                    <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full">
                      <TbPhoneRinging className="text-[16px] dark:text-white"  />
                      <span>
                        {employee.phone ? `+880${employee.phone}` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Cards and shortcuts */}
              <div className="flex gap-4 w-full sm:w-full md:w-full xl:w-1/2">
                <div className="flex gap-4 justify-between flex-wrap w-full sm:w-full md:w-full xl:w-1/2 ">
                  <div className="bg-white dark:bg-[#312c4a] p-3 rounded-md flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/assets/singleAttendance.png"
                        alt="Attendance icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        onError={(e) => (e.currentTarget.src = defaultIcon)}
                      />
                      <h1 className="text-xl font-semibold">90%</h1>
                    </div>
                    <span className="text-sm text-gray-400">
                      Work Attendance
                    </span>
                  </div>
                  <div className="bg-white dark:bg-[#312c4a] p-3 rounded-md flex flex-col gap-2 w-full">
                    <div className="flex gap-4 items-center">
                      <Image
                        src="/assets/singleBranch.png"
                        alt="Branch icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        onError={(e) => (e.currentTarget.src = defaultIcon)}
                      />

                      <h1 className="text-xl font-semibold">2</h1>
                    </div>
                    <span className="text-sm text-gray-400">Branches</span>
                  </div>
                  <div className="bg-white dark:bg-[#312c4a] p-3 rounded-md flex flex-col gap-2 w-full">
                    <div className="flex gap-4 items-center">
                      <RiProjectorLine
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <h1 className="text-xl font-semibold">6</h1>
                    </div>
                    <span className="text-sm text-gray-400">Projects</span>
                  </div>
                  <div className="bg-white dark:bg-[#312c4a] p-3 rounded-md flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/assets/singleLesson.png"
                        alt="Training icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        onError={(e) => (e.currentTarget.src = defaultIcon)}
                      />
                      <h1 className="text-xl font-semibold">3</h1>
                    </div>
                    <span className="text-sm text-gray-400">Trainings</span>
                  </div>
                </div>
                {/* Shortcuts  */}
                <div className="flex flex-col gap-4 w-full sm:w-full md:w-full xl:w-1/2">
                  <h1 className="text-xl font-semibold bg-white dark:bg-[#312c4a] p-3 rounded-md h-[80px]">
                    Shortcuts
                  </h1>
                  <Link href="/" className="bg-white dark:bg-[#312c4a] p-3 rounded-md h-[80px]">
                    Employee&apos;s
                  </Link>
                  <Link href="/" className="p-3 rounded-md dark:bg-[#312c4a] bg-white h-[80px]">
                    Event&apos;s
                  </Link>
                  <Link href="/" className="p-3 rounded-md dark:bg-[#312c4a] bg-white h-[80px]">
                    Announcement&apos;s
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 bg-white dark:bg-[#312c4a] rounded-md p-4">
              <h1 className="text-xl font-semibold">
                Employee&apos;s Schedule
              </h1>
              {/* <BigCalendar /> */}
              <MainClander />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-0 md:gap-4 xl:gap-0 sm:flex-col md:flex-row xl:flex-col w-full xl:w-1/3 h-[100%]">
            <Performance />
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePopup;
