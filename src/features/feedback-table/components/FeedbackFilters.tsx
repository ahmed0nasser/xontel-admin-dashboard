import React, { useState, useRef, useEffect } from "react";
import Select, { type MultiValue } from "react-select";
import { type Filter, type DateFilterMode } from "../types";

interface FeedbackFiltersProps {
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
  handleNoteKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  accentColor?: string;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
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
  handleNoteKeyPress,
  handleApplyFilters,
  handleResetFilters,
  accentColor = "#007bff",
}) => {
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const dateMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
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
    </>
  );
};

export default FeedbackFilters;
