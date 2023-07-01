import React, { useState } from 'react'
import { BiEdit, BiCheck } from "react-icons/bi"
import { BsFillCheckCircleFill } from "react-icons/bs"
import Avatar from './Avatar'
import { useAuth } from '@/context/contextAuth'

import {FiPlus} from "react-icons/fi"
import {IoLogOutOutline, IoClose} from "react-icons/io5"
import { profileColors } from '@/utils/constants'
import UsersPopup from './popup/UsersPopup'

import { toast } from 'react-toastify';
import ToastMessage from '@/Components/ToastMessage';
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase'
import { updateProfile } from 'firebase/auth'


const LeftNav = () => {
    const { currentUser, setCurrentUser, signOut } = useAuth();
    const [editProfile, setEditProfile] = useState(false);
    const [usersPopup, setUsersPopup] = useState(false);

    const [nameEdited, setNameEdited] = useState(false);

    const onkeyup = (event) =>{
        if(event.target.innerText.trim() != currentUser.displayName)
        {
            // name is edited
            setNameEdited(true);
        }
        else
        {
            // name is not edited
            setNameEdited(false);
        }
    }
    const onkeydown = (event) =>{ 
        if(event.key==="Enter" && event.keyCode===13)
        {
            event.preventDefault();
        }
    }

    const handleUpdateProfile = (type, value) => {
        let obj = {...currentUser};
        switch(type)
        {
            case "name":
                obj.displayName = value;
                break;

            case "color":
                obj.color = value;
                break;
        }

        const authUser = auth.currentUser;
        try 
        {
          toast.promise(
            async () => {
              // our logic
              const userRef = doc(db, "users", currentUser.uid );
              await updateDoc(userRef, obj);
              setCurrentUser(obj);

              if(type === "name")
              {
                await updateProfile(authUser, {
                    displayName: value,
                });
                setNameEdited(false);
              }
            },
            {
              pending: "Updating profile",
              success: "Profile updated successfully 👌",
              error: "Profile update failed 🤯",
            },
            {
                autoClose: 2000,
            }
          );
        } 
        catch (error) 
        {
          console.log(error);
        }
    }

    return (
        <div className='left-nav-sec'>
            {
                editProfile ?
                (
                    <div className='edited'>
                        <div className='leftNav'>
                            <div className="top-icons">
                                <div className="avatars">
                                    <Avatar user={currentUser} className="avatarr"/>
                                    <IoClose onClick={()=>setEditProfile(false)} className='close-icon'/>
                                </div>
                                <div className='user-details'>
                                    <div className='name'> 
                                    <ToastMessage/> 
                                    {!nameEdited && <BiEdit className='edit'/> } 
                                    {nameEdited && <BsFillCheckCircleFill className='save' 
                                    onClick={()=>{handleUpdateProfile("name", document.getElementById("displayNameEdit").innerText)}} />} 
                                    <h1 contentEditable onKeyUp={onkeyup} onKeyDown={onkeydown} id='displayNameEdit' > {currentUser.displayName} </h1> </div>
                                    <p> {currentUser.email} </p>
                                    <div className='prof-colors'>
                                        {
                                            profileColors.map((color, index) => (
                                                <span
                                                    key={index}
                                                    className='prof-span'
                                                    style={{backgroundColor:color}}
                                                    onClick={()=>{handleUpdateProfile("color", color)}}
                                                >
                                                    {color === currentUser.color && (<BiCheck/>)}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='bot-icons'>
                                <span className='icon1' onClick={()=>{setUsersPopup(!usersPopup)}}> <FiPlus/> </span>
                                <span className='icon2' onClick={signOut}> <IoLogOutOutline/> </span>
                            </div>
                        {usersPopup && <UsersPopup onHide={()=>{setUsersPopup(!usersPopup)}}/>}
                        </div>
                    </div>
                ) :
                (
                    <div className='unedited'>
                        {usersPopup && <UsersPopup onHide={()=>{setUsersPopup(!usersPopup)}}/>}
                        <div className='leftNav'>
                            <div class="letter-container">
                                <span class="letter"> <Avatar user={currentUser}/> </span>
                                <span className='online'>  </span>
                                <span class="edit-icon" onClick={() => setEditProfile(true)}> <BiEdit/> </span>
                            </div>
                            <div className='bot-icons'>
                                <span className='icon1' onClick={()=>{setUsersPopup(!usersPopup)}}> <FiPlus/> </span>
                                <span className='icon2' onClick={signOut}> <IoLogOutOutline/> </span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
      )
    }

export default LeftNav;
