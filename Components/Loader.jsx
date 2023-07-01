import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='loader'>
        <Image src='/loader.svg' alt='Loading...' width={100} height={100} />
    </div>
  )
}

export default Loader
