"use client"
import React, { useEffect, useState } from 'react'
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io"
import Link from 'next/link';
import { auth } from '@/firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/context/contextAuth';
import { useRouter } from 'next/router';
import ToastMessage from '@/Components/ToastMessage';
import { toast } from 'react-toastify';

const login = () => {

  const [email, setEmail] = useState("");

  const router = useRouter();
  const { currentUser, isLoading } = useAuth();


  const gProvider = new GoogleAuthProvider();

  useEffect(()=>{
    if(!isLoading && currentUser)
    {
      // it means user logged in
      router.push("/");
    }
  }, [currentUser, isLoading])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email);
    try
    {
      await signInWithEmailAndPassword(auth, email, password);
    }
    catch(error)
    {
      console.error(error);
    }
  }

  const signInWithGoogle = async () =>
  {
    try
    {
      await signInWithPopup(auth, gProvider);
    }
    catch(error)
    {
      console.log(error);
    }
  }

  const resetPassword = async () =>
  {
    try
    {
      toast.promise(async () =>{
        // our logic
        await sendPasswordResetEmail(auth, email);
      },
      {
        pending: 'Generating reset link',
        success: 'Reset email send to registerred email ID 👌',
        error: 'You may have enetered wrong email ID 🤯'
      },
      )
    }
    catch(error)
    {
      console.log(error);
    }
  }

  return isLoading || (!isLoading && currentUser) ? 'Loader...' : (
    <div className="login-sec">
      <ToastMessage/>
      <div className="login-container">
        <div className="login-intro">
          <h1> Login to Your Account </h1>
          <p> Connect and chat with anyone, anywhere </p>
        </div>
        <div className="login-btns">
          <button className="btn" onClick={signInWithGoogle} >
            <IoLogoGoogle className="symb" /> Login with Google
          </button>
          <button className="btn">
            {" "}
            <IoLogoFacebook className="symb" /> Login with Facebook{" "}
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
                type="email"
                placeholder="Email"
                className="inputs"
                autoComplete="off"
                onChange={ (e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="inputs"
                autoComplete="off"
              />
              <div className="fpwd">
                <span onClick={resetPassword} > Forgot Password? </span>
              </div>
              <button> Log In Your Account </button>
            </form>
          </div>
        </div>

        <div className='redirect'>
          <span> Not a member yet? </span>
          <Link href='register'> Register Now </Link>
        </div>
      </div>
    </div>
  );
}

export default login
