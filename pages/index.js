import React, { useEffect } from 'react'
import { useAuth } from '@/context/contextAuth'
import { useRouter } from 'next/router';
import Loader from '@/Components/Loader';
import LeftNav from '@/Components/LeftNav';
import SideBarChats from '@/Components/SideBarChats';
import LeftChats from '@/Components/LeftChats';
import Chats from '@/Components/Chats';
import { useChatContext } from '@/context/chatContext';

const index = () => {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  const { data } = useChatContext();

  useEffect(()=>{
    if(!isLoading && !currentUser )
    {
      router.push('/login');
    }
  },[currentUser, isLoading])


  return !currentUser ? (
    <Loader/>
    ) : (
    <div className='home-sec'>
      <div className="left-navigations">
        <LeftNav/>
      </div>
      <div className="right-chat">

        <div className="sidebar">
          <LeftChats/>
          {/* <SideBarChats/> */}
        </div>

        <div className="Chat">
          { data.user && <Chats/> }
          {/* <Chat/> */}
        </div>
      </div>
    </div>
  )
}

export default index
