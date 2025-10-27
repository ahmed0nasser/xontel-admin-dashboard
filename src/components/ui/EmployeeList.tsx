import React, { useState } from "react";
import { employeeData, type Employee } from "../../data/employees";
import { CiSearch } from "react-icons/ci";

interface EmployeeListProps {
  onSelectEmployee: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  onSelectEmployee,
  selectedEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employeeData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-charcoal h-full overflow-y-auto">
      <div className="w-full px-2">
        <div className="px-2 w-full flex items-center mb-4 rounded-3xl bg-slate-200/90 border border-gray-300 hover:border-gray-400 duration-300">
          <span className="text-2xl">
            <CiSearch />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="p-2 w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        {filteredEmployees.map((employee: Employee) => (
          <div
            key={employee.id}
            className={`flex items-center p-3 border-b border-zinc-400/50 cursor-pointer transition-colors duration-300 ${
              selectedEmployee?.id === employee.id
                ? "bg-brand-blue/80 text-white"
                : "hover:bg-brand-blue/20"
            }`}
            onClick={() => onSelectEmployee(employee)}
          >
            <img
              src={employee.picture}
              alt={employee.name}
              className="h-12 w-12 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{employee.name}</p>
              <p className="text-sm text-zinc-600">{employee.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
