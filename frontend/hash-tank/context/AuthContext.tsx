import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { API } from '@/constants/api.constants';

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // const [user, setUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])
  

  const signup = async (email: string, password: string) => {
    const userCredential = await 
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
      sendEmailVerification(userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        // Email does not exist in Firebase Authentication
        return 'The email address is already in use. Please choose a different email.';
      } else if (error.code === 'auth/email-already-in-use') {
        // Wrong password provided
        return 'The email address is already in use. Please choose a different email.';
      } else {
      // Other error scenarios
        return 'Failed to sign up.';
      }
    })
    
    
    return userCredential;
    
    // .then((userCredential) => {
    //   console.log(userCredential)
    //   sendEmailVerification(userCredential.user);
    //   return userCredential.user.uid;
    // })
    // .catch((error)=>{
    //   console.log(error)
    // })
  }

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
    .then(async (cred)=>{
      // console.log(cred);
      const idToken = await cred.user.getIdToken(true);
      localStorage.setItem("idToken", 'Bearer ' + idToken)
      return cred;
    })
  }

  const verificationLink = async () => {
    sendEmailVerification(currentUser)
  }

  const logout = async () => {
    localStorage.removeItem("idToken");
    return auth.signOut();
  }

  const resetpassword = async (email:string) => {
    return await sendPasswordResetEmail(auth, email);
  }

  const value = {
    currentUser,
    verificationLink,
    login,
    signup,
    logout,
    resetpassword
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
