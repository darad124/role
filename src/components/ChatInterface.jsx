import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-indigo-800 p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[75%] p-3 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-800 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white rounded-full px-6 py-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
