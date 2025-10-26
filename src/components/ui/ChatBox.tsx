import React, { useState, useEffect, useRef } from "react";
import { messageData, type Message } from "../../data/messages";
import { type Employee } from "../../data/employees";
import { useUser } from "../../context/UserContext";

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
      setMessages(
        messageData.filter((message) => message.employeeId === employee.id)
      );
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
      <div className="bg-soft-gray p-4 rounded-lg flex items-center justify-center h-full text-charcoal">
        <p>Select an employee to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-soft-gray flex flex-col text-charcoal">
      <h2 className="text-lg font-bold mb-2 pl-2">Chat with {employee.name}</h2>
      <div className="grow border border-gray-300 rounded-lg p-4 overflow-y-auto min-h-0">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex items-end ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            {message.sender === "employee" && employee && (
              <img
                src={employee.picture}
                alt={employee.name}
                className="h-8 w-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg max-w-[75%] wrap-break-word whitespace-pre-wrap ${
                message.sender === "user"
                  ? "bg-brand-blue text-white"
                  : "bg-light-blue"
              }`}
            >
              {message.text}
            </div>
            {message.sender === "user" && user && (
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <textarea
          ref={textareaRef}
          rows={1}
          className="min-h-11 grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none resize-none overflow-y-auto wrap-break-word"
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
          className="bg-brand-blue text-white px-4 py-2 rounded-r-lg font-semibold cursor-pointer hover:bg-brand-blue/80 transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
