import React, { useState, useEffect, useRef } from "react";
import { conversationsData } from "../../data/conversations";
import { type Employee, type Message } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { IoMdChatboxes } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";

interface ChatBoxProps {
  employee: Employee | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ employee }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (employee) {
      const conversation = conversationsData.find((c) => c.id === employee.id);
      setMessages(conversation ? conversation.messages : []);
    } else {
      setMessages([]);
    }
  }, [employee]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    if (messageInput.trim() && employee && user) {
      const newMessage: Message = {
        id: new Date().toISOString(),
        senderId: user.id,
        text: messageInput,
        isRead: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
      // Note: In a real application, you would also update the main
      // conversationsData object and persist the changes.
    }
  };

  if (!employee) {
    return (
      <div className=" p-4 flex flex-col justify-center items-center h-full">
        <div className="text-gray-600/40 text-[20rem]">
          <IoMdChatboxes />
        </div>
        <p className="text-gray-600 text-xl">
          Select an employee to start chatting...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full border-l border-gray-300/70 flex flex-col text-charcoal">
      <h2 className="text-lg font-bold mb-2 pl-2">
        Chat with {`${employee.firstName} ${employee.lastName}`}
      </h2>
      <div className="grow p-8 overflow-y-auto max-h-[78vh]">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex items-end ${
              user && message.senderId === user.id
                ? "justify-end"
                : "justify-start"
            } mb-2`}
          >
            {user && message.senderId !== user.id && employee && (
              <img
                src={employee.profilePictureUrl}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="h-8 w-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg max-w-[75%] wrap-break-word whitespace-pre-wrap ${
                user && message.senderId === user.id
                  ? "bg-brand-blue text-white"
                  : "bg-gray-300/70"
              }`}
            >
              {message.text}
            </div>
            {user && message.senderId === user.id && (
              <img
                src={user.profilePictureUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="m-4 p-1 border border-gray-300 bg-slate-200/90 items-end rounded-3xl flex space-x-2">
        <textarea
          ref={textareaRef}
          rows={1}
          className="min-h-10 max-h-30 w-full px-4 py-2 focus:outline-none resize-none overflow-y-auto wrap-break-word"
          placeholder="Write a message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <button
          onClick={handleSendMessage}
          className="flex items-center space-x-2 h-fit bg-brand-blue text-white px-4 py-2 rounded-3xl font-semibold cursor-pointer hover:bg-brand-blue/80 transition-colors duration-300"
        >
          <span>Send</span>
          <BsFillSendFill />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
