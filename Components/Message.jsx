import { useAuth } from '@/context/contextAuth';
import React from 'react'
import Avatar from './Avatar';
import { useChatContext } from '@/context/chatContext';
import { Timestamp } from 'firebase/firestore';
import { formateDate } from '@/utils/helpers';

const Message = ({message}) => {

    const { currentUser } = useAuth();
    const {  users, data } = useChatContext();
    console.log(message);
    const self = message.sender === currentUser.uid;

    const timestamp = new Timestamp(
      message.date?.seconds,
      message.date?.nanoseconds,
    )
    const date = timestamp.toDate();

  return (
    <div className={`${self ? "self-div" : "other-user-div"}`}>
      <Avatar user={self ? currentUser : users[data.user.uid] }/>
      <div className='msg-date'>
        <p> {message.text} </p>
        <h5> {formateDate(date)} </h5> 
      </div>
    </div>
  )
}

export default Message;
