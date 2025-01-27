import React from 'react'; 
import './Chat.css'; 
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'; // Left sidebar component import.
import ChatBox from '../../components/ChatBox/ChatBox'; // Chat box component import.
import RightSidebar from '../../components/RightSidebar/RightSidebar'; // Right sidebar component import.
import { useContext, useState, useEffect } from 'react'; // React hooks import.
import { AppContext } from '../../context/AppContext'; // Global context import.

const Chat = () => {
  const { chatData, userData } = useContext(AppContext); 
  // `chatData` aur `userData` ko global context se fetch karta hai.

  const [loading, setLoading] = useState(true); 
  // `loading` state define karta hai. Default value `true` rakhta hai jab tak data load nahi hota.

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false); 
      // Jab `chatData` aur `userData` available hote hain, loading state ko `false` set karta hai.
    }
  }, [chatData, userData]); 
  // Dependency array mein `chatData` aur `userData`. Jab yeh change hote hain, effect rerun hota hai.

  return (
    <div className='chat'>
      {
        loading ? 
        (
          <p className='loading'>Loading...</p> 
          // Agar `loading` true hai, toh "Loading..." message display karta hai.
        ) : (
          <div className="chat-container">
            <LeftSidebar /> 
            {/* Left sidebar ko render karta hai */}
            <ChatBox /> 
            {/* Chat messages aur input ke liye chat box ko render karta hai */}
            <RightSidebar /> 
            {/* Right sidebar ko render karta hai */}
          </div>
        )
      }
    </div>
  );
};

export default Chat; 
// Component ko export karta hai taaki doosre files mein use kiya ja sake.
