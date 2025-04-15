
import Announcements from '@/components/Home/Announcements'
import BigCalendar from '@/components/Home/BigCalendar'
import Performance from '@/components/Home/Performance'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SingleEmployeePage = () => {
  return (
    <div className='flex-1 flex flex-col md:flex-row p-4 gap-4'>
        {/* left */}
      <div className='w-full xl:w-2/3'>
        {/* top */}
        <div className='flex flex-col lg:flex-row gap-4'>
            {/* user info card */}
            <div className='bg-[#C3EBFA] py-6 px-4 rounded-md flex-1 flex items-center gap-4'>
                <div className=''>
                    <Image src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200" alt='' width={144} height={144} className='w-36 h-36 rounded-full object-cover' />
                </div>
                <div className='w-2/3 flex flex-col justify-between'>
                    <h1 className='text-xl font-semibold'>Dean Guerrero</h1>
                    <p className='text-sm text-gray-500'>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                    <div className='flex items-center justify-between gap-2 flex-wrap text-xs font-medium'>
                        <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full'>
                            <Image src="/assets/blood.png" alt='' width={14} height={14} />
                            <span>A+</span>
                        </div>
                        <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full'>
                            <Image src="/assets/date.png" alt='' width={14} height={14} />
                            <span>Janury 2025</span>
                        </div>
                        <div className='flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-full'>
                            <Image src="/assets/mail.png" alt='' width={14} height={14} />
                            <span>nurul@gmail.ocm</span>
                        </div>
                        <div className='flex gap-2 w-full items-center md:w-1/3 lg:w-full 2xl:w-full'>
                            <Image src="/assets/phone.png" alt='' width={14} height={14} />
                            <span>01786061907</span>
                        </div>
                        {/* w-full md:w-1/3 lg:w-full 2xl:w-full flex items-center gap-2 */}
                    </div>
                </div>
            </div>
            {/* small card */}
            <div className='flex-1 flex gap-2 justify-between flex-wrap'>
                {/* card */}
                <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]'>
                    <Image src="/assets/singleAttendance.png" alt='' width={24} height={24} className='w-6 h-6' />
                    <div>
                        <h1 className='text-xl font-semibold'>90%</h1>
                        <span className='text-sm text-gray-400'>Attendance</span>
                    </div>
                </div>
                {/* card */}
                <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]'>
                    <Image src="/assets/singleBranch.png" alt='' width={24} height={24} className='w-6 h-6' />
                    <div>
                        <h1 className='text-xl font-semibold'>2</h1>
                        <span className='text-sm text-gray-400'>Branches</span>
                    </div>
                </div>
                {/* card */}
                <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]'>
                    <Image src="/assets/singleLesson.png" alt='' width={24} height={24} className='w-6 h-6' />
                    <div>
                        <h1 className='text-xl font-semibold'>9</h1>
                        <span className='text-sm text-gray-400'>Lessons</span>
                    </div>
                </div>
                <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]'>
                    <Image src="/assets/singleClass.png" alt='' width={24} height={24} className='w-6 h-6' />
                    <div>
                        <h1 className='text-xl font-semibold'>9</h1>
                        <span className='text-sm text-gray-400'>Classes</span>
                    </div>
                </div>
            </div>
        </div>

        {/* bottom  */}
        <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
            <h1>Teacher&apos;s Schedule</h1>
            <BigCalendar />
        </div>
      </div>

      {/* right */}
      <div className='w-full xl:w-1/3'>

        <div className='bg-white p-4 rounded-md mb-2'>
            <h1 className='text-xl font-semibold'>Shortcuts</h1>
            <div className='flex flex-wrap items-center gap-2 mt-2'>
                <Link href="/" className='p-3 rounded-md bg-[#C3EBFA]'>Teacher&apos;s Classes</Link>
                <Link href="/" className='p-3 rounded-md bg-[#F1F0FF]'>Teacher&apos;s Students</Link>
                <Link href="/" className='p-3 rounded-md bg-[#FAE27C]'>Teacher&apos;s Lessons</Link>
                <Link href="/" className='p-3 rounded-md bg-pink-50'>Teacher&apos;s Exams</Link>
                <Link href="/" className='p-3 rounded-md bg-[#C3EBFA]'>Teacher&apos;s Assignments</Link>
            </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  )
}

export default SingleEmployeePage
