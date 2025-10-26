import React, { useRef } from "react";
import Select, { type MultiValue } from "react-select";
import { type Filter, type DateFilterMode } from "../types";
import Modal from "../../../components/ui/Modal";
import { ACCENT_COLOR } from "../constants";

interface FeedbackFiltersProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  dateMode: DateFilterMode;
  setDateMode: (mode: DateFilterMode) => void;
  dateValue: string;
  setDateValue: (value: string) => void;
  employeeNames: string[];
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  selectedScores: number[];
  setSelectedScores: (scores: number[]) => void;
  noteKeywords: string[];
  setNoteKeywords: (keywords: string[]) => void;
  handleNoteKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  isModalOpen,
  setIsModalOpen,
  filters,
  setFilters,
  dateMode,
  setDateMode,
  dateValue,
  setDateValue,
  employeeNames,
  selectedEmployees,
  setSelectedEmployees,
  selectedScores,
  setSelectedScores,
  noteKeywords,
  setNoteKeywords,
  handleNoteKeyPress,
  handleApplyFilters,
  handleResetFilters,
}) => {
  const dateMenuRef = useRef<HTMLDivElement>(null);

  const handleApplyAndClose = () => {
    handleApplyFilters();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, idx) => {
            let label = "";
            let color = ACCENT_COLOR;

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
        <div className="flex gap-2">
          {filters.length > 0 && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-md text-white bg-red-500"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 border rounded-md"
            style={{ borderColor: ACCENT_COLOR }}
          >
            Filters
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Filter Feedbacks"
      >
        <div className="flex flex-col gap-4">
          {/* Date Filter */}
          <div className="relative" ref={dateMenuRef}>
            <label className="font-semibold">Date</label>
            <div className="flex gap-2 mt-1">
              <select
                value={dateMode}
                onChange={(e) => setDateMode(e.target.value as DateFilterMode)}
                className="border rounded p-2 w-1/3"
              >
                <option value="at">At</option>
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="border rounded p-2 w-2/3"
              />
            </div>
          </div>

          {/* Employee Filter */}
          <div>
            <label className="font-semibold">Employee Name</label>
            <Select
              placeholder="Select employees..."
              isMulti
              options={employeeNames.map((name) => ({
                value: name,
                label: name,
              }))}
              value={selectedEmployees.map((e) => ({ value: e, label: e }))}
              onChange={(
                selected: MultiValue<{ value: string; label: string }>
              ) => setSelectedEmployees(selected.map((s) => s.value))}
            />
          </div>

          {/* Score Filter */}
          <div>
            <label className="font-semibold">Score</label>
            <Select
              placeholder="Select scores..."
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
            />
          </div>

          {/* Notes Filter */}
          <div>
            <label className="font-semibold">Notes Keyword</label>
            <input
              type="text"
              placeholder="Press Enter to add a keyword"
              onKeyDown={handleNoteKeyPress}
              className="border rounded-md px-2 py-2 w-full mt-1"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {noteKeywords.map((keyword, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-2 py-1 rounded-full text-sm text-white bg-purple-500"
                >
                  {keyword}
                  <button
                    onClick={() =>
                      setNoteKeywords(noteKeywords.filter((_, i) => i !== idx))
                    }
                    className="ml-1 text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button
            onClick={handleApplyAndClose}
            className="px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            Apply Filters
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FeedbackFilters;
