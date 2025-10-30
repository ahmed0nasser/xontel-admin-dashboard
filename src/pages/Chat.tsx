import React, { useState } from "react";
import EmployeeList from "../components/ui/EmployeeList";
import ChatBox from "../components/ui/ChatBox";
import type { Employee } from "../types";

const Chat: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  return (
    <div className="px-4 pt-4 flex h-full">
      <div className="w-1/4">
        <EmployeeList
          onSelectEmployee={setSelectedEmployee}
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
