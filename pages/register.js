import React, { useEffect } from 'react'
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io"
import Link from 'next/link';

import { auth, db } from '@/firebase/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { useRouter } from 'next/router';
import { useAuth } from '@/context/contextAuth';
import { doc, setDoc } from 'firebase/firestore';
import { profileColors } from '@/utils/constants';

const Register = () => {

  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if(!isLoading && currentUser)
    {
      router.push("/");
    }
  }, [isLoading, currentUser])

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const colorIndex = Math.floor(Math.random() * profileColors.length)

    try
    {
      const { user } =
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(user, {
        displayName: displayName
      });

      await setDoc(doc(db, "users", user.uid),{
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        color: profileColors[colorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {} );

      router.push("/");
    }
    catch(error)
    {
      console.log(error);
    }
  }

  const gProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () =>
  {
    try
    {
      const {user} =
      await signInWithPopup(auth, gProvider);

      console.log(user);
    }
    catch(error)
    {
      console.log(error);
    }
  }


  return isLoading || (!isLoading && currentUser) ? 'Loader...': (   
  <div className="login-sec">
      <div className="login-container">
        <div className="login-intro">
          <h1> Create New Account </h1>
          <p> Connect and chat with anyone, anywhere </p>
        </div>
        <div className="login-btns">
          <button className="btn" onClick={signInWithGoogle}>
            <IoLogoGoogle className="symb" /> Login with Google
          </button>
          <button className="btn">
            <IoLogoFacebook className="symb" /> Login with Facebook
          </button>
        </div>

        <div className="or-sec">
          <div className="lines">
            <span className="line"></span>
            <span className="or-text"> OR </span>
            <span className="line"></span>
          </div>

          <div className="form-container">
            <form method="POST" className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Display Name"
                    className="inputs"
                    autoComplete="off"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="inputs"
                    autoComplete="off"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="inputs"
                    autoComplete="off"
                />
                <button> Sign Up </button>
            </form>
          </div>
        </div>

        <div className='redirect'>
          <span> Already have an account? </span>
          <Link href='login'> Login </Link>
        </div>
        
      </div>
    </div>
  )
}

export default Register
