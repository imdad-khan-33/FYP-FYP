import React, { useState } from 'react';
import './LLMChatbot.css';
import assets from '../../assets/assets';
import { toast } from 'react-toastify';

const LLMChatbot = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [...messages, { role: 'user', content: input }],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const botMessage = { text: data.choices[0].message.content, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        toast.error('Invalid response from chatbot.');
      }
    } catch (error) {
      toast.error('Failed to fetch response from the chatbot.');
      console.error(error);
    }

    setInput('');
  };

  // Function to redirect current tab to /chat
  const goBackToChat = () => {
    window.location.href = '/chat'; // Redirect current tab to /chat
    // Note: User will need to close the tab manually after redirection
  };

  return (
    <div className="llm-chatbot">
      <div className="chat-header">
        <img src={assets.logo} alt="LLM Chatbot" />
        <p>LLM Chatbot</p>
        <button className="back-btn" onClick={goBackToChat}>
          Back to Chat
        </button>
        {/* <img onClick={() => window.close()} src={assets.close_icon} alt="Close" className="close-icon" /> */}
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default LLMChatbot;