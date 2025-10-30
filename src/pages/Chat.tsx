import React, { useState } from "react";
import ConversationList from "../components/ui/ConversationList";
import ChatBox from "../components/ui/ChatBox";
import type { Employee } from "../types";
import { markMessagesAsRead } from "../services/firebase";

const Chat: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isChatboxVisible, setIsChatboxVisible] = useState(false);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    markMessagesAsRead(employee.id);
    setIsChatboxVisible(true);
  };

  const handleGoBack = () => {
    setIsChatboxVisible(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="bg-slate-200/90 sm:bg-white pt-4 flex h-full">
      <div
        className={`w-full lg:w-1/3 ${
          isChatboxVisible ? "hidden lg:block" : "block"
        }`}
      >
        <ConversationList
          onSelectEmployee={handleSelectEmployee}
          selectedEmployee={selectedEmployee}
        />
      </div>
      <div
        className={`w-full ${isChatboxVisible ? "block" : "hidden lg:block"}`}
      >
        <ChatBox employee={selectedEmployee} onGoBack={handleGoBack} />
      </div>
    </div>
  );
};

export default Chat;
