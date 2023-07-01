import Image from 'next/image'
import React from 'react'

const Avatar = ({ user }) => {
  return (
    <div className='avatar-div'  >
        <div className='avatar-img' style={{backgroundColor: user?.color}}>
            {user?.photoURL ? (
                
                <div> <Image src={user?.photoURL} alt='User Avatar' width={10} height={10} /> </div>
            ) : (
                <div> {user?.displayName?.charAt(0)} </div>
            ) }
        </div>
    </div>
  )
}

export default Avatar
