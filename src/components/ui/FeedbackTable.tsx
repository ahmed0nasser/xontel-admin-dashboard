import React, { useState, useEffect, useRef } from "react";
import Select, { type MultiValue } from "react-select";
import { type Feedback } from "../../data/feedback";

type DateFilterMode = "before" | "after" | "at";

type Filter =
  | { type: "date"; mode: DateFilterMode; value: { date: Date } }
  | { type: "employee" | "score" | "notes"; value: string };

interface FeedbackTableProps {
  feedbacks: Feedback[];
  accentColor?: string;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  feedbacks,
  accentColor = "#007bff",
}) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filteredFeedback, setFilteredFeedback] =
    useState<Feedback[]>(feedbacks);

  const [dateMode, setDateMode] = useState<DateFilterMode>("at");
  const [dateValue, setDateValue] = useState<string>("");
  const [employeeNames, setEmployeeNames] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedScores, setSelectedScores] = useState<number[]>([]);
  const [noteKeywords, setNoteKeywords] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const dateMenuRef = useRef<HTMLDivElement>(null);

  // Collect all unique employee names
  useEffect(() => {
    setEmployeeNames(Array.from(new Set(feedbacks.map((f) => f.employeeName))));
  }, [feedbacks]);

  // Close date menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dateMenuRef.current &&
        !dateMenuRef.current.contains(e.target as Node)
      ) {
        setIsDateMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDateMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    const newFilters: Filter[] = [];

    if (dateValue) {
      newFilters.push({
        type: "date",
        mode: dateMode,
        value: { date: new Date(dateValue) },
      });
    }

    selectedEmployees.forEach((emp) =>
      newFilters.push({ type: "employee", value: emp })
    );

    selectedScores.forEach((score) =>
      newFilters.push({ type: "score", value: score.toString() })
    );

    noteKeywords.forEach((note) =>
      newFilters.push({ type: "notes", value: note })
    );

    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters([]);
    setSelectedEmployees([]);
    setSelectedScores([]);
    setNoteKeywords([]);
    setDateValue("");
    setDateMode("before");
  };

  // Filtering logic
  useEffect(() => {
    let result = [...feedbacks];

    if (filters.length > 0) {
      result = result.filter((f) => {
        return filters.every((filter) => {
          switch (filter.type) {
            case "date": {
              const fd = new Date(f.date);
              const fv = filter.value.date;
              if (filter.mode === "before") return fd < fv;
              if (filter.mode === "after") return fd > fv;
              return fd.toDateString() === fv.toDateString();
            }
            case "employee":
              return selectedEmployees.length === 0
                ? true
                : selectedEmployees.includes(f.employeeName);
            case "score":
              return selectedScores.length === 0
                ? true
                : selectedScores.includes(f.score);
            case "notes":
              return f.notes.toLowerCase().includes(filter.value.toLowerCase());
            default:
              return true;
          }
        });
      });
    }

    // Maintain table height
    if (result.length < itemsPerPage) {
      const diff = itemsPerPage - result.length;
      const emptyRows = Array(diff).fill({
        id: -1,
        date: "",
        employee: "",
        score: 0,
        notes: "",
      });
      result = [...result, ...emptyRows];
    }

    setFilteredFeedback(result);
  }, [filters, feedbacks, selectedEmployees, selectedScores]);

  const handleNoteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement | null;
      if (target && target.value.trim()) {
        setNoteKeywords((prev) => [...prev, target.value.trim()]);
        target.value = "";
      }
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedback = filteredFeedback.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  return (
    <div className="p-4">
      {/* Filters Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Date Filter */}
        <div className="relative" ref={dateMenuRef}>
          <button
            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
            className="px-3 py-1.5 border rounded-md"
            style={{ borderColor: accentColor }}
          >
            {dateValue
              ? `${dateMode[0].toUpperCase() + dateMode.slice(1)} ${dateValue}`
              : "Date Filter"}
          </button>

          {isDateMenuOpen && (
            <div
              className="absolute bg-white border rounded-md shadow-md p-2 mt-2 fade-in"
              style={{ minWidth: "200px", zIndex: 50 }}
            >
              <select
                value={dateMode}
                onChange={(e) => setDateMode(e.target.value as DateFilterMode)}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="at">At</option>
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </div>
          )}
        </div>

        {/* Employee Filter */}
        <div className="flex-1 min-w-[180px]">
          <Select
            placeholder="Employee Name"
            isMulti
            options={employeeNames.map((name) => ({
              value: name,
              label: name,
            }))}
            value={selectedEmployees.map((e) => ({ value: e, label: e }))}
            onChange={(
              selected: MultiValue<{ value: string; label: string }>
            ) => setSelectedEmployees(selected.map((s) => s.value))}
            styles={{
              control: (base) => ({ ...base, borderColor: accentColor }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: `${accentColor}22`,
              }),
            }}
          />
        </div>

        {/* Score Filter */}
        <div className="flex-1 min-w-[180px]">
          <Select
            placeholder="Score"
            isMulti
            options={[1, 2, 3, 4, 5].map((s) => ({
              value: s,
              label: `${s} star${s > 1 ? "s" : ""}`,
            }))}
            value={selectedScores.map((s) => ({
              value: s,
              label: `${s} star${s > 1 ? "s" : ""}`,
            }))}
            onChange={(
              selected: MultiValue<{ value: number; label: string }>
            ) => setSelectedScores(selected.map((s) => s.value))}
            styles={{
              control: (base) => ({ ...base, borderColor: accentColor }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: `${accentColor}22`,
              }),
            }}
          />
        </div>

        {/* Notes Filter */}
        <input
          type="text"
          placeholder="Notes keyword"
          onKeyDown={handleNoteKeyPress}
          className="border rounded-md px-2 py-1 flex-1"
          style={{ borderColor: accentColor }}
        />
      </div>

      {/* Apply + Reset + Active Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={handleApplyFilters}
          className="px-3 py-1.5 rounded-md text-white"
          style={{ backgroundColor: accentColor }}
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="px-3 py-1.5 rounded-md text-white bg-red-500 disabled:opacity-50"
          disabled={filters.length === 0}
        >
          Reset
        </button>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter, idx) => {
            let label = "";
            let color = accentColor;

            if (filter.type === "date") {
              label = `${filter.mode[0].toUpperCase() + filter.mode.slice(1)} ${
                filter.value.date.toISOString().split("T")[0]
              }`;
              color = "#60a5fa";
            } else if (filter.type === "employee") {
              label = filter.value;
              color = "#34d399";
            } else if (filter.type === "score") {
              label = `${filter.value} star${filter.value !== "1" ? "s" : ""}`;
              color = "#fb923c";
            } else if (filter.type === "notes") {
              label = `"${filter.value}"`;
              color = "#a855f7";
            }

            return (
              <div
                key={idx}
                className="flex items-center px-2 py-1 rounded-full text-sm text-white"
                style={{ backgroundColor: color }}
              >
                {label}
                <button
                  onClick={() =>
                    setFilters(filters.filter((_, i) => i !== idx))
                  }
                  className="ml-1 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg transition-all duration-300 ease-in-out">
        <table className="min-w-full text-left border-collapse">
          <thead style={{ backgroundColor: `${accentColor}22` }}>
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Employee</th>
              <th className="p-2">Score</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedback.map((f) => (
              <tr key={+f.id !== -1 ? f.id : Math.random()}>
                <td className="p-2 border-t">
                  {f.date ? new Date(f.date).toISOString().split("T")[0] : ""}
                </td>
                <td className="p-2 border-t">{f.employeeName}</td>
                <td className="p-2 border-t">{f.score || ""}</td>
                <td className="p-2 border-t">{f.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-3 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 rounded ${
              currentPage === i + 1 ? "bg-gray-300" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.15s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FeedbackTable;
