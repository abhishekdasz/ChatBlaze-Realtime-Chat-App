import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { useAuth } from '@/context/contextAuth'
import { IoEllipsisVerticalSharp } from "react-icons/io5"
import { CgAttachment } from "react-icons/cg"
import { HiOutlineEmojiHappy } from "react-icons/hi"
import { TbSend } from "react-icons/tb"
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/firebase/firebase'
import { useChatContext } from '@/context/chatContext'
import { v4 as uuid } from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Messages from './Messages'

const Chat = () => {
    const { currentUser } = useAuth();
    const { data } = useChatContext();

    const [ text, setText ] = useState("");
    const [ img, setImg ] = useState(null);

    const handleSend = async () => {
        if(img)
        {
            const storageRef = ref(storage, uuid);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                (error) => {
                    
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId),{
                            id: uuid(),
                            text,
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            img: downloadURL,
                        })
                    })
                }
            ) 
        }
        else
        {
            await updateDoc(doc(db, "chats", data.chatId ), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            })
        }

        await updateDoc(doc(db, "userChats", currentUser.uid),{
            [data.chatId + ".lastMessage"] : {
                text,
            },
            [data.chatId + ".date"] : serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid),{
            [data.chatId + ".lastMessage"] : {
                text,
            },
            [data.chatId + ".date"] : serverTimestamp(),
        });

        setText("");
        setImg(null);
    }

  return (
    <div className='pers-chat-sec'>
        <div className="pers-chat-container">



            <div className="chat-header">
                <div className="user-details">
                    <div className='avatar'>
                        <Avatar user={data.user} />
                    </div>
                    <div className='user'>
                        <h4> { data.user?.displayName } </h4>
                        <p> Offline </p>
                    </div>
                </div>
                <div className='chat-menu'>
                    <IoEllipsisVerticalSharp/>
                </div>
            </div>


            <Messages/>


            <div className="chat-footer">
                <div className='footer-components'>
                    <input type="file" name="file" id="file" style={{display:"none"}} onChange={e=>setImg(e.target.files[0])} />
                    <label htmlFor="file"> <CgAttachment/> </label>
                    
                    <HiOutlineEmojiHappy className='emoji'/>

                    <div className="input">
                        <input type="text" name="text" value={text} placeholder='Enter Message' onChange={e=>setText(e.target.value)}/>
                        <div className="send" onClick={handleSend}> <TbSend/> </div>
                    </div>
                </div>
            </div>



        </div>
    </div>
  )
}

export default Chat
