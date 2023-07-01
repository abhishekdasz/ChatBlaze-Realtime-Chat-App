import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
import { onAuthStateChanged, signOut as authSignOut  } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = async () => {
        try
        {
            // for setting status to offline
            if(currentUser)
            {
                await updateDoc(doc(db, "users", currentUser.uid),{
                    isOnline: false
                });
            }

            setCurrentUser(null);
            setIsLoading(false);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    // from authStateChanged method of firebase we are getting the user
    const authStateChanged = async (user) =>{
        setIsLoading(true);

        if(!user)
        {
            clear();
            return;
        }

        // for online status
        const userDoExist = await getDoc(doc(db, "users", user.uid));
        if(userDoExist.exists())
        {
            await updateDoc(doc(db, "users", user.uid),{
                isOnline: true
            });
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));

        setCurrentUser(userDoc.data());
        setIsLoading(false);
        // console.log(user);
        console.log(userDoc.data());
    }

    const signOut = () =>{
        authSignOut(auth).then(()=> clear());
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unsubscribe();
    },[]);

    return(
        <UserContext.Provider value={{
            currentUser, 
            setCurrentUser,
            isLoading, 
            setIsLoading,
            signOut
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext);