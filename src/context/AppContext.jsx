import React from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [chatVisible, setChatVisible] = useState(false);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);

            if (userData?.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            // Update last seen time
            await updateDoc(userRef, {
                lastSeen: Date.now(),
            });

            // Periodically update lastSeen
            const intervalId = setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);

            return () => clearInterval(intervalId); // Cleanup interval on unmount
        } catch (error) {
            console.error("Error loading user data: ", error);
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unsub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.exists() ? res.data().chatsData : [];
                if (!chatItems || chatItems.length === 0) {
                    console.warn("No chats found");
                    setChatData([]);
                    return;
                }

                try {
                    const tempData = await Promise.all(
                        chatItems.map(async (item) => {
                            const userRef = doc(db, 'users', item.rId);
                            const userSnap = await getDoc(userRef);
                            const userData = userSnap.exists() ? userSnap.data() : null;
                            return { ...item, userData };
                        })
                    );

                    setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
                } catch (error) {
                    console.error("Error fetching chat data: ", error);
                    setChatData([]);
                }
            });

            return () => {
                unsub();
            };
        }
    }, [userData]);

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,
        setMessages,
        messagesId,
        setMessagesId,
        chatUser,
        setChatUser,
        chatVisible,
        setChatVisible,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
