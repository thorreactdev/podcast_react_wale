import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ headerTitle }) => {
  return (
    <div className='flex items-center justify-between'>
        {headerTitle ? (
            <h1 className='text-[15px] font-semibold'>{headerTitle}</h1>
        ): <div/>}

        <Link to={"/discover"} className='text-[14px] text-orange-1 font-semibold'>
          See all
        </Link>
    </div>
  )
}
export default Header