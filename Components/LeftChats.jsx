import { useChatContext } from '@/context/chatContext';
import { useAuth } from '@/context/contextAuth';
import { db } from '@/firebase/firebase';
import { Timestamp, collection, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect } from 'react'
import Avatar from './Avatar';
import { formateDate } from '@/utils/helpers';

const LeftChats = () => {

  const { currentUser } = useAuth();
  const { 
    users,
    setUsers, 
    chats,
    setChats, 
    selectedChat,
    setSelectedChat, 
    dispatch } = useChatContext();

  useEffect(()=>{
    onSnapshot(collection(db, "users"),
    (snapshot)=>{
        const updatedUsers = {};
        snapshot.forEach((doc) => {
            updatedUsers[doc.id] = doc.data();
            console.log(doc.data());
        })
        setUsers(updatedUsers);
    });
  }, []);

  // to get the chats in left handside
  useEffect(()=>{
    const getChats = () => {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), 
        (doc)=>{
            if(doc.exists())
            {
              const data = doc.data();
              setChats(data);
            }
        });

        return () => {
            unsub();
        };
    };
    currentUser.uid && getChats();
  }, [] )

  const filteredChats = Object.entries(chats || {}).sort((a,b) => b[1].date - a[1].date);
  console.log(filteredChats);





  const handleSideChatSelect = (user, selectedChatId) =>{
    setSelectedChat(user);
    dispatch({type:'CHANGE_USER', payload: user});
  }

  return (
    <div className='sideBarChats-sec'>
      <div className="chat-sec">

        <div className='searchUser'>
          <input type="text" placeholder='Search a user' />
        </div>


        {Object.keys(users || {}).length > 0 && filteredChats?.map((chat)=>{
        const user = users[chat[1].userInfo.uid];

        const timestamp = new Timestamp(
          chat[1].date?.seconds,
          chat[1].date?.nanoseconds,
        )
        const date = timestamp.toDate();
        
        return (
          // chat[0] is chatid
          <div className={`chat-container ${selectedChat?.uid === user.uid ? "selected-chat" : ""}`} key={chat[0]} onClick={()=> handleSideChatSelect(user, chat[0])}> 
            <Avatar user={user} />
            <div className="chats">
              <div className="name-date">
                <p> {user.displayName} </p>
                <p className='date'> {formateDate(date)} </p>
              </div>
              <div className="msg-notific">
                <p className='lmsg'> {chat[1]?.lastMessage?.text ||(chat[1]?.lastMessage?.img && "image") || "Send first message"} </p>
                <span className='noti'> 5 </span>
              </div>
            </div>
          </div>
        )
      })}

      </div>
    </div>
  )
}

export default LeftChats
