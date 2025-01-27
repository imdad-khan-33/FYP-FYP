import React, { useContext, useEffect, useState } from 'react'; 
// React aur uske hooks (`useContext`, `useEffect`, `useState`) import karte hain.

import './ChatBox.css'; 
// CSS file ko styling ke liye import karte hain.

import assets from '../../assets/assets'; 
// Asset files (e.g., icons, images) ko import karte hain.

import { AppContext } from '../../context/AppContext'; 
// Global context import karte hain jo user aur chat data ko manage karta hai.

import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'; 
// Firebase Firestore se CRUD operations aur real-time updates ke liye functions import karte hain.

import { db } from '../../config/firebase'; 
// Firebase configuration file import karte hain.

import { toast } from 'react-toastify'; 
// Notifications ke liye `react-toastify` library import karte hain.

import upload from '../../lib/upload'; 
// File upload ke liye custom library import karte hain.

const ChatBox = () => { 
  // `ChatBox` functional component define karte hain.

  const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible } = useContext(AppContext); 
  // Context se user aur chat related data ko destructure karte hain.

  const [input, setInput] = useState(''); 
  // `input` state manage karta hai jo user ke message ko store karta hai.

  const sendMessage = async () => { 
    // Function jo message ko Firestore mein save karta hai.
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id, // Sender ID
            text: input, // Message text
            createdAt: new Date() // Message timestamp
          })
        });

        const userIds = [chatUser.rId, userData.id]; 
        // Dono user ke IDs ko array mein store karte hain.

        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id); 
          // Firestore se user chats ka reference banate hain.

          const userChatsSnapShot = await getDoc(userChatsRef); 
          // User ke chat data ko fetch karte hain.

          if (userChatsSnapShot.exists()) {
            const userChatData = userChatsSnapShot.data(); 
            // Chat data ko variable mein store karte hain.

            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId); 
            // Current chat index ko find karte hain.

            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30); 
            // Last message ko update karte hain.

            userChatData.chatsData[chatIndex].updatedAt = Date.now(); 
            // Chat ke update time ko set karte hain.

            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false; 
              // Agar current user receiver hai, toh message ko unseen mark karte hain.
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData 
              // Updated chat data ko Firestore mein save karte hain.
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message); 
      // Error message show karte hain.
    }
    setInput(''); 
    // Message input ko reset karte hain.
  };

  const sendImage = async (e) => { 
    // Function jo image upload aur send karta hai.
    try {
      const fileUrl = await upload(e.target.files[0]); 
      // Image ko upload karte hain aur URL lete hain.

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id, // Sender ID
            image: fileUrl, // Image URL
            createdAt: new Date() // Timestamp
          })
        });
      }

      const userIds = [chatUser.rId, userData.id]; 
      // User IDs ko process karte hain.

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, 'chats', id); 
        // Firestore chats ka reference banate hain.

        const userChatsSnapShot = await getDoc(userChatsRef); 
        // User chat data fetch karte hain.

        if (userChatsSnapShot.exists()) {
          const userChatData = userChatsSnapShot.data(); 
          const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId); 

          userChatData.chatsData[chatIndex].lastMessage = "Image"; 
          // Last message ko "Image" set karte hain.

          userChatData.chatsData[chatIndex].updatedAt = Date.now(); 
          // Updated timestamp set karte hain.

          if (userChatData.chatsData[chatIndex].rId === userData.id) {
            userChatData.chatsData[chatIndex].messageSeen = false; 
            // Message ko unseen mark karte hain agar user receiver hai.
          }

          await updateDoc(userChatsRef, {
            chatsData: userChatData.chatsData 
            // Updated chats ko Firestore mein save karte hain.
          });
        }
      });
    } catch (error) {
      toast.error(error.message); 
      // Error message show karte hain.
    }
  };

  const convertTimeStamp = (timeStamp) => { 
    // Timestamp ko human-readable time mein convert karta hai.
    let date = timeStamp.toDate(); 
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM"; 
    } else {
      return hour + ":" + minute + " AM"; 
    }
  };

  useEffect(() => {
    // Real-time messages ke liye Firestore ka listener.
    if (messagesId) {
      const unsub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().messages.reverse()); 
        // Messages ko reverse order mein set karte hain (latest first).
      });
      return () => {
        unsub(); 
        // Cleanup function to remove listener.
      };
    }
  }, [messagesId]); 

  return chatUser ? ( 
    // Agar chatUser hai, toh chat box render hota hai.
    <div className={`chat-box ${!chatVisible && "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" /> 
        {/* User avatar */}
        <p>{chatUser.userData.name}{Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}</p>
        {/* User name aur online status */}
        <img src={assets.help_icon} className='help' alt="" />
        <img onClick={() => setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg["image"] ? <img className='msg-img' src={msg.image} alt='' /> : <p className="msg">{msg.text}</p>}
            {/* Message text ya image */}
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
              {/* Sender avatar aur time */}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    // Agar chatUser nahi hai, toh welcome screen render hota hai.
    <div className={`chat-welcome ${!chatVisible && "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox; 
// Component export karte hain.
