import { collection, getDocs, getDoc, query, serverTimestamp, setDoc, updateDoc, where, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '@/firebase/firebase';
import Avatar from './Avatar';
import { useAuth } from '@/context/contextAuth';
import { useChatContext } from '@/context/chatContext';


const SideBarChats = () => {

    const [ username, setUsername ] = useState("");
    console.log(username);
    const [ user, setUser ] = useState(null);

    const { currentUser } = useAuth();

    const handleSearch = async () =>{
      const q = query(
        collection(db, "users"), 
        where("displayName", "==", username)
      );

      try
      {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        })
      }
      catch(error)
      {
        console.log(error);
      }
    }

    const handleKey = (e) =>{
      e.code === "Enter" && handleSearch();
    }

    const handleSelect = async () =>{
      // check whether the group(chats in firestore) exists, if not create
      const combinedId = 
        currentUser.uid > user.uid 
        ? currentUser.uid + user.uid 
        : user.uid + currentUser.uid;
        
        try
        {
          const res = await getDoc(doc(db, "chats", combinedId ));

          if(!res.exists())
          {
            // create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId),{ messages: [] });
            // create user chats
            await updateDoc(doc(db, "userChats", currentUser.uid),{
              [combinedId+".userInfo"]: {
                uid: user.uid,
                displayName: user.displayName,
                color: user.color
              },
              [combinedId+".date"]: serverTimestamp()
            })

            await updateDoc(doc(db, "userChats", user.uid),{
              [combinedId+".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
              },
              [combinedId+".date"]: serverTimestamp()
            })

          }
        }
        catch(err)
        {
          console.log(err);
        }
      setUser(null);
      // create user chats
    }






    const [chats, setChats] = useState([])

    useEffect(()=>{
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc)=>{
                setChats(doc.data());
            });
    
            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats();
    }, [ currentUser.uid ] )

    console.log(chats);


    const { dispatch } = useChatContext();

    const handleSelects = (u) =>{
      dispatch({type:"CHANGE_USER", payload: u })
    }


  return (
    <div className='sideBarChats-sec'>
      <div className="chat-sec">

        <div className='searchUser'>
          <input type="text" placeholder='Search a user' onChange={(e)=>{setUsername(e.target.value)}} onKeyDown={handleKey} />
        </div>

        {/* search a user */}
        {
          user && (
          <div className='chat-container' onClick={handleSelect}> 
            <Avatar user={user} />
            <div className="chats">
              <div className="name-date">
                <p> {user.displayName} </p>
                <p className='date'> date </p>
              </div>
              <div className="msg-notific">
                <p className='lmsg'> Send First Message </p>
                <span className='noti'> 5 </span>
              </div>
            </div>
          </div>
        )
        }

        {
          Object.entries(chats)?.map((chat)=>(
          <div className='chat-container' key={chat[0]} onClick={()=>handleSelects(chat[1].userInfo)}> 
            <Avatar user={chat[1].userInfo} />
            <div className="chats">
              <div className="name-date">
                <p> {chat[1].userInfo.displayName} </p>
                <p className='date'> date </p>
              </div>
              <div className="msg-notific">
                <p className='lmsg'> {chat[1].lastMessage?.text} </p>
                <span className='noti'> 5 </span>
              </div>
            </div>
          </div>
        )
        )}
        
      </div>
    </div>
  )
}

export default SideBarChats
