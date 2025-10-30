import React, { useState } from "react";
import ConversationList from "../components/ui/ConversationList";
import ChatBox from "../components/ui/ChatBox";
import type { Employee } from "../types";
import { markMessagesAsRead } from "../services/firebase";

const Chat: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    markMessagesAsRead(employee.id);
  };

  return (
    <div className="px-4 pt-4 flex h-full">
      <div className="w-1/4">
        <ConversationList
          onSelectEmployee={handleSelectEmployee}
          selectedEmployee={selectedEmployee}
        />
      </div>
      <div className="w-full">
        <ChatBox employee={selectedEmployee} />
      </div>
    </div>
  );
};

export default Chat;
