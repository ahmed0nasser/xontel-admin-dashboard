import React, { useState } from "react";
import { employeeData, type Employee } from "../../data/employees";

interface EmployeeListProps {
  onSelectEmployee: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onSelectEmployee, selectedEmployee }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employeeData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-soft-gray p-4 rounded-lg shadow text-charcoal h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Employees</h2>
      <input
        type="text"
        placeholder="Search employees..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid gap-4">
        {filteredEmployees.map((employee: Employee) => (
          <div
            key={employee.id}
            className={`flex items-center p-3 rounded-lg shadow-md cursor-pointer transition-colors duration-200 ${selectedEmployee?.id === employee.id ? 'bg-brand-blue text-white' : 'hover:bg-light-blue'}`}
            onClick={() => onSelectEmployee(employee)}
          >
            <img src={employee.picture} alt={employee.name} className="h-10 w-10 rounded-full mr-3" />
            <div>
              <p className="font-semibold">{employee.name}</p>
              <p className="text-sm text-gray-600">{employee.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
