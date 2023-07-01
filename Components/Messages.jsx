import { useChatContext } from '@/context/chatContext';
import { useAuth } from '@/context/contextAuth'
import { db } from '@/firebase/firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Message from './Message';

const Messages = () => {

    const { currentUser } = useAuth();
    const { data } = useChatContext();

    const [ messages, setMessages ] = useState([]);

    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "chats", data.chatId),(doc)=>{
            doc.exists() && setMessages(doc.data().messages)
        })

        return () =>{
            unSub();
        }
    }, [data.chatId])

    console.log(messages);
    console.log(messages.userId)

    // const self = messages.senderId === currentUser.uid;

  return (
    <div className='msg'>
        {messages.map(m=>(
            <Message message={m}/>
        ))}
    </div>
  )
}

export default Messages
