import { useChatContext } from '@/context/chatContext'
import React from 'react'
import Avatar from './Avatar';

import { IoEllipsisVerticalSharp } from "react-icons/io5"
import { CgAttachment } from "react-icons/cg"
import { HiOutlineEmojiHappy } from "react-icons/hi"
import { TbSend } from "react-icons/tb"
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/firebase';
import { v4 as uuid } from "uuid";
import { useAuth } from '@/context/contextAuth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Messages from './Messages';

const Chats = () => {
    const { currentUser } = useAuth();
    const { users, data, inputText, setInputText, attachment, setAttachment } = useChatContext();

    const online = users[data.user.uid]?.isOnline;
    const user = users[data.user.uid];

    const handleTyping = (e) =>{
        setInputText(e.target.value);
    }
    const onKeyUp = (e) =>{
        if(e.key === "Enter" && (inputText || attachment ))
        {
            handleSend()
        }
    }
    const handleSend = async () =>{

        if (attachment) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) *
                        100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await updateDoc(doc(db, "chats", data.chatId),{
                                messages: arrayUnion({
                                    id: uuid(),
                                    text: inputText,
                                    sender: currentUser.uid,
                                    date: Timestamp.now(),
                                    read: false,
                                    img: downloadURL
                                })
                            })
                        }
                    );
                }
            );
        }
        else
        {
            await updateDoc(doc(db, "chats", data.chatId),{
                messages: arrayUnion({
                    id: uuid(),
                    text: inputText,
                    sender: currentUser.uid,
                    date: Timestamp.now(),
                    read: false
                })
            })
        }
        let msg = { text: inputText }
        if(attachment)
        {
            msg.img = true;
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]:  msg,
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]:  msg,
            [data.chatId + ".date"]: serverTimestamp(),
        }); 
        setInputText("");
        setAttachment(null);
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
                    <p> {online ? "Online" : "Offline"} </p> 
                </div>
            </div>
            <div className='chat-menu'>
                <IoEllipsisVerticalSharp/>
            </div>
        </div>

        
        <div className="messages-section">
            <Messages/>
        </div>


        <div className="chat-footer">
            <div className='footer-components'>
                <input type="file" name="file" id="file"  style={{display:"none"}}  />
                <label htmlFor="file"> <CgAttachment/> </label>
                    
                <HiOutlineEmojiHappy className='emoji'/>

                <div className="input">
                    <input type="text" name="text"  placeholder='Type a Message' autoComplete='off' value={inputText} onChange={handleTyping} onKeyUp={onKeyUp}/>
                    <div className="send" onClick={handleSend}> <TbSend/> </div>
                </div>
            </div>
        </div>


        </div>
    </div>
  )
}

export default Chats
