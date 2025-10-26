import React, { useRef } from "react";
import Select, { type MultiValue } from "react-select";
import { type DateFilterMode } from "../types";
import Modal from "../../../components/ui/Modal";
import { ACCENT_COLOR } from "../constants";

interface FeedbackFiltersModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
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
}

const FeedbackFiltersModal: React.FC<FeedbackFiltersModalProps> = ({
  isModalOpen,
  setIsModalOpen,
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
}) => {
  const dateMenuRef = useRef<HTMLDivElement>(null);

  const handleApplyAndClose = () => {
    handleApplyFilters();
    setIsModalOpen(false);
  };

  return (
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
  );
};

export default FeedbackFiltersModal;