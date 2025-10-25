import React, { useState, useEffect, useRef } from 'react';
import { messageData, type Message } from '../../data/messages';
import { type Employee } from '../../data/employees';
import { useUser } from '../../context/UserContext';

interface ChatBoxProps {
  employee: Employee | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ employee }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (employee) {
      setMessages(messageData.filter(message => message.employeeId === employee.id));
    }
  }, [employee]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    if (messageInput.trim() && employee && user) {
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
          <div key={message.id} className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            {message.sender === 'employee' && employee && (
              <img src={employee.picture} alt={employee.name} className="h-8 w-8 rounded-full mr-2" />
            )}
            <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-brand-blue text-white' : 'bg-light-blue'}`}>
              {message.text}
            </div>
            {message.sender === 'user' && user && (
              <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full ml-2" />
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // Prevent new line on Enter
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage} className="bg-brand-blue text-white px-4 py-2 rounded-r-lg font-bold cursor-pointer hover:bg-complementary-orange transition-colors duration-200">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
