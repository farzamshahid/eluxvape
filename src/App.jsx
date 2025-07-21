import React, { useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import VerifyAge from './pages/verify';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleClick = () => {
    navigate('/verify');
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/splashrecording.mp4" type="video/mp4" />
      </video>

      <div className="relative z-[2] h-[100%] flex flex-col justify-center items-center text-center px-[16px] text-black">
        <h1 className="text-[24px] font-bold font-manrope text-black mb-2">
          WELCOME!
        </h1>
        <p className="text-[14px] font-manrope font-light mb-6 max-w-md">
          YOU MUST BE 21 YEARS OLD OR ABOVE TO ENTER THIS WEBSITE
        </p>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-black border border-black rounded-full text-white text-[14px] w-20 font-semibold py-2"
            onClick={handleClick}
          >
            21+
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gray-200 border border-black rounded-full text-black font-normal text-[14px] w-20 py-2"
          >
            under 21
          </motion.button>
        </div>
      </div>

      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50"
        aria-label="Toggle chatbot"
      >
        💬
      </button>

      {showChatbot && (
        <div className="fixed bottom-20 right-6 w-80 max-w-sm h-[70vh] bg-white rounded-lg shadow-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-2 bg-black text-white">
            <span className="text-sm font-semibold">Chatbot</span>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white text-sm"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm text-black">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[75%] ${msg.from === 'user' ? 'bg-gray-200 ml-auto text-right' : 'bg-gray-200'
                  }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1 text-sm border rounded-md outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-black text-white px-3 py-1 rounded-md text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/verify" element={<VerifyAge />} />
    </Routes>
  );
};

export default App;
