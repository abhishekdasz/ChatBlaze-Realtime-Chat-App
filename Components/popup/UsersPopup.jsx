import { useChatContext } from '@/context/chatContext'
import { useAuth } from '@/context/contextAuth'
import { IoClose } from 'react-icons/io5'
import Avatar from '../Avatar'
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase';
import Search from '../Search'
 
const UsersPopup = ({ onHide }) => {

  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  const handleSelect = async (user) =>{
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
      dispatch({type:'CHANGE_USER', payload: user});
      onHide();
    }
    catch(error)
    {
      console.log(error);
    }
  }
 

  return (
    <div className='popup-sec'>
        <div className="glassEffect" onClick={onHide}></div>
        <div className="popup-content">
            <div className="popup-heading"> <h3> Find Users </h3>  <IoClose onClick={onHide} className='close-btn'/> </div>
            <div className="search-user">
              <Search/>
            </div>
            <div className="popup-user">
            {users && Object.values(users).map((user) => (
              <div key={user.uid} className='popup-avatar' onClick={() => handleSelect(user)}>
              {user.isOnline && <span className='online'> </span>}
              <Avatar user={user}/>
              <div className='user-details'>
                <h5> {user.displayName} </h5>
                <p> {user.email} </p>
              </div> 
            </div>
              ))
              }
            </div>
        </div>
    </div>
  )
}

export default UsersPopup
