import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore, setDoc, doc, collection, query, where, getDocs} from "firebase/firestore"
import {toast} from 'react-toastify';


const firebaseConfig = {
  apiKey: "AIzaSyA1czxIURjMnnkIfMdJkq_J-yu1GW-A4Rs",
  authDomain: "fyp3-45fc9.firebaseapp.com",
  projectId: "fyp3-45fc9",
  storageBucket: "fyp3-45fc9.firebasestorage.app",
  messagingSenderId: "703963896453",
  appId: "1:703963896453:web:13eb10757ad651cbb867ec"
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
