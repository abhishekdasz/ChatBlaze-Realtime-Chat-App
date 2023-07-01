import { db } from '@/firebase/firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react'
import Avatar from './Avatar';
import { useAuth } from '@/context/contextAuth';
import { useChatContext } from '@/context/chatContext';

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const onkeyp = async (e) => {
        if (e.code === "Enter" && !!username) {
            try {
                setErr(false);
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("displayName", "==", username));

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    setErr(true);
                    setUser(null);
                } else {
                    querySnapshot.forEach((doc) => {
                        setUser(doc.data());
                    });
                }
            } catch (error) {
                console.error(error);
                setErr(error);
            }
        }
    };




    // same as UserPopup.jsx
    const { currentUser } = useAuth();
    const { dispatch } = useChatContext();

    const handleSelect = async () =>{
        console.log(user.uid);
        try
        {
          const combinedId = currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid
    
          const res = await getDoc(doc(db, "chats", combinedId));
    
          if(!res.exists())
          {
            // chat document doesn't exist
            await setDoc(doc(db, "chats", combinedId), { messages:[] });
    
            const currentUserChatRef = await getDoc(doc(db, "userChats", currentUser.uid));
            const userChatRef = await getDoc(doc(db, "userChats", user.uid))
    
            if(!currentUserChatRef.exists())
            {
              await setDoc(doc(db, "userChats", currentUser.uid), {});
            }
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [combinedId + ".userInfo"]: {
                uid: user.uid,
                displayName:user.displayName,
                photoURL: user.photoURL || null,
                color: user.color
              },
              [combinedId + ".date"]: serverTimestamp()
            });
    
            if(!userChatRef.exists())
            {
              await setDoc(doc(db, "userChats", user.uid), {})
            }
            await updateDoc(doc(db, "userChats", user.uid), {
              [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName:currentUser.displayName,
                photoURL: currentUser.photoURL || null,
                color: currentUser.color
              },
              [combinedId + ".date"]: serverTimestamp()
            });
          }
          else
          {
            // chat document exists
          }
        //   newwwwwwwwwwwwwwwwwww
        setUser(null);
        setUsername("");
          dispatch({type:'CHANGE_USER', payload: user});
        //   onHide();
        }
        catch(error)
        {
          console.log(error);
        }
      }
  return (
    <div className='search'>
        <input type="search" name="search" autoComplete='off' onChange={(e)=>{setUsername(e.target.value)}}  onKeyUp={onkeyp} placeholder='Search a user' />

        {err &&
            <div> User Not Found !!! </div>
        }
        {user &&
        <>
            <div key={user.uid} className='popup-avatar' onClick={handleSelect} style={{marginTop:"1rem"}}>
                {user.isOnline && <span className='online'> </span>}
                <Avatar user={user}/>
                <div className='user-details'>
                    <h5> {user.displayName} </h5>
                    <p> {user.email} </p>
                </div> 
            </div> 
            <div className='separator'>  </div> 
        </> 
        }
    </div>
  )
}

export default Search
