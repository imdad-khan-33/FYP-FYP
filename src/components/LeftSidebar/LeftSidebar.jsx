"use client"
import React from "react"
import { useContext, useEffect, useState } from "react"
import "./LeftSidebar.css"
import assets from "../../assets/assets"
import { useNavigate } from "react-router-dom"
import {
  arrayUnion,
  collection,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  doc,
  getDoc,
} from "firebase/firestore"
import { db, logout } from "../../config/firebase"
import { AppContext } from "../../context/AppContext"
import { toast } from "react-toastify"

const LeftSidebar = () => {
  const navigate = useNavigate()
  const { userData, chatData, chatUser, setChatUser, setMessagesId, chatVisible, setChatVisible } =
    useContext(AppContext)
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const inputHandler = async (e) => {
    try {
      const input = e.target.value
      if (input) {
        setShowSearch(true)
        const userRef = collection(db, "users")
        const q = query(userRef, where("username", "==", input))
        const querySnap = await getDocs(q)
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false

          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true
            }
          })
          if (!userExist) {
            setUser(querySnap.docs[0].data())
          }
        } else {
          setUser(null)
        }
      } else {
        setShowSearch(false)
      }
    } catch (error) {}
  }

  const addChat = async () => {
    const messagesRef = collection(db, "messages")
    const chatsRef = collection(db, "chats")
    try {
      const newMessageRef = doc(messagesRef)
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      })

      const uSnap = await getDoc(doc(db, "users", user.id))
      const uData = uSnap.data()
      setChat({
        messagesId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData,
      })
      setShowSearch(false)
      setChatVisible(true)
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const setChat = async (item) => {
    setMessagesId(item.messageId)
    setChatUser(item)
    setChatVisible(true)
  }

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        setChatUser((prev) => ({ ...prev, userData: userData }))
      }
    }

    updateChatUserData()
  }, [chatData])

  return (
    <div className={`ls ${chatVisible && "hidden"}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo || "/placeholder.svg"} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon || "/placeholder.svg"} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon || "/placeholder.svg"} alt="" />
          <input onChange={inputHandler} type="text" placeholder="search here..." />
        </div>
      </div>

      {/* LLM Button - Updated with onClick handler */}
      <button className="llm-button" onClick={() => navigate("/chatbot")}>
        Open llm chatbot
      </button>

      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar || "/placeholder.svg"} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div onClick={() => setChat(item)} key={index} className="friends">
              <img src={item.userData.avatar || "/placeholder.svg"} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LeftSidebar

