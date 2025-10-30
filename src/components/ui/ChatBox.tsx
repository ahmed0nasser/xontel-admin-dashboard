import React, { useState, useEffect, useRef } from "react";
import { type Employee, type Message } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { IoMdChatboxes } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { subscribeToMessages, sendMessage } from "../../services/firebase";
import { formatMessageTime } from "../../utils/formatters";
import { IoIosArrowBack } from "react-icons/io";

interface ChatBoxProps {
  employee: Employee | null;
  onGoBack: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ employee, onGoBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (employee) {
      const unsubscribe = subscribeToMessages(employee.id, (newMessages) => {
        setMessages(newMessages);
      });

      return () => unsubscribe();
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
      sendMessage(employee.id, messageInput.trim(), user.id);
      setMessageInput("");
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
    <div className="bg-slate-200/90 h-full max-h-[89vh] sm:max-h-full lg:border-l border-gray-300/70 flex flex-col">
      <div className="flex items-center bg-white border-b border-gray-300/70">
        <button onClick={onGoBack} className="text-xl lg:hidden p-2">
          <IoIosArrowBack />
        </button>
        <h2 className="text-lg font-bold mb-2 pl-4">
          Chat with {`${employee.firstName} ${employee.lastName}`}
        </h2>
      </div>
      <div className="grow p-8 overflow-y-auto">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex items-end ${
              user && message.senderId === user.id
                ? "justify-end"
                : "justify-start"
            } mb-4`}
          >
            {user && message.senderId !== user.id && employee && (
              <img
                src={employee.profilePictureUrl}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="h-8 w-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg max-w-[75%] wrap-break-word ${
                user && message.senderId === user.id
                  ? "bg-brand-blue text-white"
                  : "bg-gray-300/70"
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap wrap-break-word">
                {message.text}
              </p>
              <p
                className={`text-xs mt-1 text-right ${
                  user && message.senderId === user.id
                    ? "text-white/70"
                    : "text-gray-600/80"
                }`}
              >
                {formatMessageTime(message.timestamp)}
              </p>
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
        <div ref={messagesEndRef} />
      </div>
      <div className="m-4 p-1 border border-gray-300 bg-gray-200 items-end rounded-3xl flex space-x-2">
        <textarea
          ref={textareaRef}
          rows={1}
          className="min-h-8 lg:min-h-10 max-h-30 w-full px-4 py-2 focus:outline-none resize-none overflow-y-auto wrap-break-word text-sm md:text-base placeholder:text-sm md:placeholder:text-base"
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
          className={`text-xl md:text-2xl lg:text-base flex items-center space-x-2 h-fit text-white px-2 lg:px-4 py-2 rounded-3xl font-semibold cursor-pointer transition-colors duration-300
            ${
              messageInput
                ? "hover:bg-brand-blue/80 bg-brand-blue"
                : "bg-zinc-400/50"
            } `}
        >
          <span className="hidden lg:block">Send</span>
          <BsFillSendFill />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
