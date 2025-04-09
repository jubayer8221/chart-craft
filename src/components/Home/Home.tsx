import React from 'react'
import UserCard from './UserCard'

const MainPage = () => {
  return (
    <>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* left side  */}
        <div className='w-full lg:w-2/3'>
            <div className='flex justify-between gap-4 flex-wrap'>
                <UserCard type='Products' />
                <UserCard type='Product types' />
                <UserCard type='Staff' />
                <UserCard type='NJ' />
            </div>
        </div>
        {/* right side  */}
        <div className='w-full lg:w-1/3'>
            right
        </div>
      </div>
    </>
  )
}

export default MainPage
