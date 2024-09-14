// go to firebase.google.com 
// click: go to console
// create a project

// config authentication, firestore database and storage
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCgBD6cRBPv2HcGzVfVF63ZOBob5RbaTYQ",
  authDomain: "chat-app-gs-22a89.firebaseapp.com",
  projectId: "chat-app-gs-22a89",
  storageBucket: "chat-app-gs-22a89.appspot.com",
  messagingSenderId: "995974379418",
  appId: "1:995974379418:web:abaf7475b446aa92e0ec23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, there I am using this chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db, "chats", user.uid),{
            chatsData:[]
        })
    }catch (error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout =  async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
    
}

const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email")
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef,where("email", "==", email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Send.")
        }
        else{
            toast.error("Email doesn't exist.")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}

export {signup,login,logout,auth,db,resetPass}

// then go to react toastify, then find The gist


