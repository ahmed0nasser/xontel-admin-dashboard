import React, { useState } from "react";
import Select from "react-select";
import { feedbackData } from "../../data/feedback";

const FeedbackTable: React.FC = () => {
  const [filters, setFilters] = useState({
    dates: [] as { type: "before" | "after" | "at"; value: string }[],
    employees: [] as string[],
    scores: [] as number[],
    notes: [] as string[],
  });

  const [activeFilters, setActiveFilters] = useState<typeof filters>({
    dates: [],
    employees: [],
    scores: [],
    notes: [],
  });

  const [showDateModal, setShowDateModal] = useState(false);
  const [dateType, setDateType] = useState<"before" | "after" | "at">("at");
  const [dateValue, setDateValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const uniqueEmployees = Array.from(
    new Set(feedbackData.map((f) => f.employeeName))
  );
  const scoreOptions = [1, 2, 3, 4, 5];

  const handleApplyFilters = () => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ dates: [], employees: [], scores: [], notes: [] });
    setActiveFilters({ dates: [], employees: [], scores: [], notes: [] });
    setCurrentPage(1);
  };

  const removeActiveFilter = (
    type: keyof typeof filters,
    value?: unknown,
    extra?: string
  ) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (type === "dates") {
        newFilters.dates = prev.dates.filter(
          (d) => !(d.value === value && d.type === extra)
        );
      } else if (type === "employees") {
        newFilters.employees = prev.employees.filter((e) => e !== value);
      } else if (type === "scores") {
        newFilters.scores = prev.scores.filter((s) => s !== value);
      } else if (type === "notes") {
        newFilters.notes = prev.notes.filter((n) => n !== value);
      }
      return newFilters;
    });
  };

  const filteredFeedback = feedbackData.filter((feedback) => {
    const { dates, employees, scores, notes } = activeFilters;

    const dateMatch = dates.every((d) => {
      const feedbackDate = new Date(feedback.date);
      const filterDate = new Date(d.value);
      if (d.type === "before") return feedbackDate < filterDate;
      if (d.type === "after") return feedbackDate > filterDate;
      if (d.type === "at")
        return feedbackDate.toISOString().slice(0, 10) === d.value;
      return true;
    });

    const employeeMatch =
      employees.length === 0 || employees.includes(feedback.employeeName);
    const scoreMatch = scores.length === 0 || scores.includes(feedback.score);
    const notesMatch =
      notes.length === 0 ||
      notes.every((kw) =>
        feedback.notes.toLowerCase().includes(kw.toLowerCase())
      );

    return dateMatch && employeeMatch && scoreMatch && notesMatch;
  });

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const currentItems = filteredFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fill empty rows to preserve height
  const filledItems = [
    ...currentItems,
    ...Array.from({ length: itemsPerPage - currentItems.length }).map(
      () => null
    ),
  ];

  const accentColors = {
    date: "bg-blue-100 text-blue-800 border-blue-300",
    employee: "bg-green-100 text-green-800 border-green-300",
    score: "bg-orange-100 text-orange-800 border-orange-300",
    notes: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const openDateModal = () => {
    setDateValue("");
    setDateType("at");
    setShowDateModal(true);
  };

  const addDateFilter = () => {
    if (dateValue)
      setFilters((prev) => ({
        ...prev,
        dates: [...prev.dates, { type: dateType, value: dateValue }],
      }));
    setShowDateModal(false);
  };

  return (
    <div className="bg-soft-gray p-4 rounded-lg shadow text-charcoal space-y-4 relative">
      <h2 className="text-lg font-bold">Feedback Table</h2>

      {/* Filters Section */}
      <div className="space-y-3">
        <p className="font-semibold">Filters</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 items-center">
          {/* Date Filter */}
          <button
            onClick={openDateModal}
            className="border border-blue-400 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            Add Date Filter
          </button>

          {/* Employee Filter */}
          <Select
            isMulti
            placeholder="Employee Name"
            options={uniqueEmployees.map((e) => ({ value: e, label: e }))}
            value={filters.employees.map((e) => ({ value: e, label: e }))}
            onChange={(selected) =>
              setFilters({
                ...filters,
                employees: selected.map((s) => s.value),
              })
            }
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#2B6CB0",
                boxShadow: "none",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#E3F2FD",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "#2B6CB0",
              }),
            }}
          />

          {/* Score Filter */}
          <Select
            isMulti
            placeholder="Score"
            options={scoreOptions.map((s) => ({ value: s, label: `${s}` }))}
            value={filters.scores.map((s) => ({ value: s, label: `${s}` }))}
            onChange={(selected) =>
              setFilters({
                ...filters,
                scores: selected.map((s) => s.value),
              })
            }
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#DD6B20",
                boxShadow: "none",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#FFF7ED",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "#DD6B20",
              }),
            }}
          />

          {/* Notes Filter */}
          <input
            type="text"
            placeholder='Notes keyword e.g. "teamwork"'
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                setFilters((prev) => ({
                  ...prev,
                  notes: [...prev.notes, e.currentTarget.value.trim()],
                }));
                e.currentTarget.value = "";
              }
            }}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleApplyFilters}
            className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Active Filters Section */}
      <div>
        <div className="flex items-center mb-2 space-x-2">
          <span className="font-semibold">Active Filters:</span>
          <button
            onClick={handleResetFilters}
            className="text-red-600 font-semibold hover:underline"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.dates.map((d, i) => (
            <span
              key={`date-${i}`}
              className={`px-3 py-1 rounded-full border text-sm ${accentColors.date} flex items-center gap-2`}
            >
              {`${d.type.charAt(0).toUpperCase() + d.type.slice(1)} ${d.value}`}
              <button
                onClick={() => removeActiveFilter("dates", d.value, d.type)}
              >
                ✕
              </button>
            </span>
          ))}
          {activeFilters.employees.map((e, i) => (
            <span
              key={`emp-${i}`}
              className={`px-3 py-1 rounded-full border text-sm ${accentColors.employee} flex items-center gap-2`}
            >
              {e}
              <button onClick={() => removeActiveFilter("employees", e)}>
                ✕
              </button>
            </span>
          ))}
          {activeFilters.scores.map((s, i) => (
            <span
              key={`score-${i}`}
              className={`px-3 py-1 rounded-full border text-sm ${accentColors.score} flex items-center gap-2`}
            >
              {`${s} star${s > 1 ? "s" : ""}`}
              <button onClick={() => removeActiveFilter("scores", s)}>✕</button>
            </span>
          ))}
          {activeFilters.notes.map((n, i) => (
            <span
              key={`note-${i}`}
              className={`px-3 py-1 rounded-full border text-sm ${accentColors.notes} flex items-center gap-2`}
            >
              “{n}”
              <button onClick={() => removeActiveFilter("notes", n)}>✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* Feedback Table */}
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2">Date</th>
            <th className="pb-2">Employee Name</th>
            <th className="pb-2">Score</th>
            <th className="pb-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {filledItems.map((feedback, i) =>
            feedback ? (
              <tr key={feedback.id} className="border-t">
                <td className="py-2">
                  {new Date(feedback.date).toISOString().slice(0, 10)}
                </td>
                <td className="py-2">{feedback.employeeName}</td>
                <td className="py-2">{feedback.score}</td>
                <td className="py-2">{feedback.notes}</td>
              </tr>
            ) : (
              <tr key={`empty-${i}`} className="border-t h-[48px]">
                <td colSpan={4}></td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="bg-brand-blue text-white px-3 py-1 rounded-l-lg disabled:opacity-50 mr-2"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border-t border-b ${
              currentPage === i + 1
                ? "bg-light-blue text-white"
                : "bg-soft-gray text-charcoal"
            } mx-1`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="bg-brand-blue text-white px-3 py-1 rounded-r-lg disabled:opacity-50 ml-2"
        >
          Next
        </button>
      </div>

      {/* Date Picker Modal */}
      {showDateModal && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-blue-700">
              Add Date Filter
            </h3>
            <select
              className="border p-2 rounded-lg w-full"
              value={dateType}
              onChange={(e) =>
                setDateType(e.target.value as "before" | "after" | "at")
              }
            >
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="at">At</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded-lg w-full"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={addDateFilter}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;
