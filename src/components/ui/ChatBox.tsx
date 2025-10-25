import React, { useState, useEffect } from 'react';
import { messageData, type Message } from '../../data/messages';
import { type Employee } from '../../data/employees';

interface ChatBoxProps {
  employee: Employee | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ employee }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (employee) {
      setMessages(messageData.filter(message => message.employeeId === employee.id));
    }
  }, [employee]);

  const handleSendMessage = () => {
    if (messageInput.trim() && employee) {
      const newMessage: Message = {
        id: Date.now(), // Simple unique ID
        employeeId: employee.id,
        text: messageInput,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
    }
  };

  if (!employee) {
    return (
      <div className="bg-soft-gray p-4 rounded-lg shadow flex items-center justify-center h-full text-charcoal">
        <p className="text-charcoal">Select an employee to start chatting</p>
      </div>
    );
  }

  return (
    <div className="bg-soft-gray p-4 rounded-lg shadow flex flex-col h-full text-charcoal">
      <h2 className="text-lg font-bold mb-2">Chat with {employee.name}</h2>
      <div className="flex-grow border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto">
        {messages.map((message: Message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-brand-blue text-white' : 'bg-light-blue'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage} className="bg-brand-blue text-white px-4 py-2 rounded-r-lg">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
