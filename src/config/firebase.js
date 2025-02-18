import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore, setDoc, doc, collection, query, where, getDocs} from "firebase/firestore"
import {toast} from 'react-toastify';

const firebaseConfig = {
    apiKey: "AIzaSyBxK99oSK8ce9BUL8XnCmfeky3Uz0rNiTI",
    authDomain: "fyp2-19d33.firebaseapp.com",
    projectId: "fyp2-19d33",
    storageBucket: "fyp2-19d33.firebasestorage.app",
    messagingSenderId: "626676216989",
    appId: "1:626676216989:web:c21f62cdc707f15ad75074"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup= async(username, email, password)=>{
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey there, I am using Chat App",
            lastSeen: Date.now()
        });
        
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })
    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const login = async (email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
} 

const logout = async ()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const resetPass = async (email)=>{
    if(!email){
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");
        }else{
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        toast.error(error.message);
    }
}

export {signup, login, logout, auth, db, resetPass}
