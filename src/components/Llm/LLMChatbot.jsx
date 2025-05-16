// "use client"
// import React, { useState, useEffect, useRef } from "react"
// import "./LLMChatbot.css"
// import { toast } from "react-toastify"

// const LLMChatbot = ({ onClose }) => {
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState([])
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
//   const messagesEndRef = useRef(null)

//   useEffect(() => {
//     // Save theme to localStorage when it changes
//     localStorage.setItem("theme", theme)
//     // Apply theme class to document body
//     document.body.className = theme
//   }, [theme])

//   // Scroll to bottom of messages when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light")
//   }

//   const sendMessage = async () => {
//     if (input.trim() === "") return

//     const userMessage = { text: input, sender: "user" }
//     setMessages((prevMessages) => [...prevMessages, userMessage])

//     try {
//       const formattedMessages = messages.map((msg) => ({
//         role: msg.sender === "user" ? "user" : "model",
//         parts: [{ text: msg.text }],
//       }))

//       formattedMessages.push({
//         role: "user",
//         parts: [{ text: input }],
//       })

//       const response = await fetch(
//         "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAbcHL-k-scLVnZ9vSWixsnW_z5kafvMbo",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             contents: formattedMessages,
//             generationConfig: {
//               temperature: 0.7,
//               maxOutputTokens: 1024,
//             },
//           }),
//         }
//       )

//       const data = await response.json()

//       if (
//         data.candidates &&
//         data.candidates.length > 0 &&
//         data.candidates[0].content &&
//         data.candidates[0].content.parts &&
//         data.candidates[0].content.parts.length > 0
//       ) {
//         const botMessage = {
//           text: data.candidates[0].content.parts[0].text,
//           sender: "bot",
//         }

//         setMessages((prevMessages) => [...prevMessages, botMessage])
//       } else {
//         toast.error("Invalid response from chatbot.")
//         console.error("Unexpected response structure:", data)
//       }
//     } catch (error) {
//       toast.error("Failed to fetch response from the chatbot.")
//       console.error(error)
//     }

//     setInput("")
//   }

//   const goBackToChat = () => {
//     window.location.href = "/chat"
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       sendMessage()
//     }
//   }

    


//   return (
//     <div className={`llm-chatbot ${theme}`}>
//       <div className="chat-header">
//         <div className="logo">LLM Chatbot</div>
//         <p>Gemini AI</p>
//         <button className="theme-toggle" onClick={toggleTheme}>
//           {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
//         </button>
//         <button className="back-btn" onClick={goBackToChat}>
//           Back to Chat
//         </button>
//       </div>
//       <div className="chat-messages">
//         {messages.length === 0 && (
//           <div className="empty-state">
//             <p>Send a message to start chatting with Gemini</p>
//           </div>
//         )}
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}`}>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   )
// }

// export default LLMChatbot






"use client"
import React, { useState, useEffect, useRef } from "react"
import "./LLMChatbot.css"
import { toast } from "react-toastify"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const LLMChatbot = ({ onClose }) => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null) // Reference to abort controller for stopping requests
  const streamingTimeoutRef = useRef(null) // Reference to timeouts for simulated streaming

  useEffect(() => {
    // Save theme to localStorage when it changes
    localStorage.setItem("theme", theme)
    // Apply theme class to document body
    document.body.className = theme
  }, [theme])

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts or fetch requests
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Function to stop ongoing streaming
  const stopStreaming = () => {
    // Cancel any pending timeout for simulated streaming
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
      streamingTimeoutRef.current = null;
    }
    
    // Abort any fetch request in progress
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Update UI state
    setIsStreaming(false);
    
    // Add a note that the response was stopped
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.sender === "bot") {
        return prevMessages.map((msg, index) => {
          if (index === prevMessages.length - 1) {
            return { ...msg, text: msg.text + " [Response stopped]" };
          }
          return msg;
        });
      }
      return prevMessages;
    });
    
    toast.info("Response generation stopped");
  }

  const sendMessage = async () => {
    if (input.trim() === "" || isStreaming) return

    const userMessage = { text: input, sender: "user" }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    
    // Add an empty bot message that will be updated with streamed content
    const botMessageId = Date.now().toString()
    setMessages((prevMessages) => [
      ...prevMessages, 
      { id: botMessageId, text: "", sender: "bot" }
    ])
    
    setIsStreaming(true)
    const userInput = input
    setInput("")

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))

      formattedMessages.push({
        role: "user",
        parts: [{ text: userInput }],
      })

      // First attempt - try the non-streaming API to ensure basic connectivity works
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAbcHL-k-scLVnZ9vSWixsnW_z5kafvMbo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: formattedMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
          signal: signal // Add the abort signal to the fetch request
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()

      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        const responseText = data.candidates[0].content.parts[0].text
        
        // Simulate streaming by revealing text character by character
        let displayedText = ""
        const fullText = responseText
        
        const simulateTyping = async (index) => {
          // Check if we should stop
          if (signal.aborted) return;
          
          if (index < fullText.length) {
            displayedText += fullText[index]
            
            // Update message with current text
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, text: displayedText } 
                  : msg
              )
            )
            
            // Schedule next character with a small delay
            streamingTimeoutRef.current = setTimeout(() => {
              simulateTyping(index + 1)
            }, 15)
          } else {
            // Done with simulation
            setIsStreaming(false)
            abortControllerRef.current = null
            streamingTimeoutRef.current = null
          }
        }
        
        // Start the simulation
        simulateTyping(0)
      } else {
        toast.error("Invalid response from chatbot.")
        console.error("Unexpected response structure:", data)
        
        // Update message to show error
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: "Sorry, I couldn't generate a proper response." } 
              : msg
          )
        )
        setIsStreaming(false)
      }
    } catch (error) {
      // Don't show error if it was from aborting
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      
      toast.error("Failed to fetch response from the chatbot.")
      console.error(error)
      
      // Update message to show error
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: "Sorry, I couldn't connect to the AI service. Please check your API key and connection." } 
            : msg
        )
      )
      setIsStreaming(false)
    }
  }

  const goBackToChat = () => {
    window.location.href = "/chat"
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className={`llm-chatbot ${theme}`}>
      <div className="chat-header">
        <div className="logo">LLM Chatbot</div>
        <p>Gemini AI</p>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
        <button className="back-btn" onClick={goBackToChat}>
          Back to Chat
        </button>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Send a message to start chatting with Gemini</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.sender}`}>
            <ReactMarkdown
              children={msg.text}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            />
            {/* <ReactMarkdown>{msg.text}</ReactMarkdown> */}
            {msg.sender === "bot" && isStreaming && msg.id === messages[messages.length - 1].id && (
              <span className="typing-indicator">●●●</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button onClick={stopStreaming} className="stop-btn">
            Stop
          </button>
        ) : (
          <button onClick={sendMessage}>
            Send
          </button>
        )}
      </div>
    </div>
  )
}

export default LLMChatbot




