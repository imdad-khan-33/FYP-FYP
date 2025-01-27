import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore, setDoc, doc, collection, query, where, getDocs} from "firebase/firestore"
import {toast} from 'react-toastify';

// Firebase configuration object containing the project's credentials
const firebaseConfig = {
    apiKey: "AIzaSyDdj1bRW8yJ-_6RKvbA_wl77L69H2kq_jU",
    authDomain: "fyp-project-88056.firebaseapp.com",
    projectId: "fyp-project-88056",
    storageBucket: "fyp-project-88056.firebasestorage.app",
    messagingSenderId: "154642620401",
    appId: "1:154642620401:web:8c550958489bce7d61ee50"
};

// Initialize Firebase app, authentication, and Firestore database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to handle user signup
const signup= async(username, email, password)=>{
    try{
        // Create a new user with email and password
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        // Store user details in Firestore database
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey there, I am using Chat App",
            lastSeen: Date.now()
        });
        
        // Initialize an empty chat data document for the user
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })
    }catch(error){
        console.error(error);
        // Display error message if signup fails
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

// Function to handle user login
const login = async (email, password)=>{
    try {
        // Sign in the user with email and password
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        // Display error message if login fails
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
} 

// Function to handle user logout
const logout = async ()=>{
    try {
        // Sign out the user
        await signOut(auth);
    } catch (error) {
        console.log(error);
        // Display error message if logout fails
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

// Function to handle password reset
const resetPass = async (email)=>{
    if(!email){
        // Display error message if email is not provided
        toast.error("Enter your email");
        return null;
    }
    try {
        // Query Firestore database to check if the email exists
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            // Send password reset email if the email exists
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");
        }else{
            // Display error message if the email doesn't exist
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        // Display error message if password reset fails
        toast.error(error.message);
    }
}

// Export functions and variables for use in other parts of the application
export {signup, login, logout, auth, db, resetPass}