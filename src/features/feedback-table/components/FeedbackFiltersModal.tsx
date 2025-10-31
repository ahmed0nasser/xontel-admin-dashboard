import React, { useRef, useState } from "react";
import Select, { type MultiValue } from "react-select";
import { type DateFilterMode } from "../types";
import { FaPlus } from "react-icons/fa";
import Modal from "../../../components/ui/Modal";

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
  setNoteKeywords: React.Dispatch<React.SetStateAction<string[]>>;
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
  handleApplyFilters,
}) => {
  const dateMenuRef = useRef<HTMLDivElement>(null);
  const [noteKeyword, setNoteKeyword] = useState<string>("");

  const handleApplyAndClose = () => {
    handleApplyFilters();
    setIsModalOpen(false);
  };

  const handleNewNoteKeyword = () => {
    if (noteKeyword && noteKeyword.trim()) {
      setNoteKeywords((prev) => [...prev, noteKeyword.trim()]);
      setNoteKeyword("");
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Filter Feedback"
    >
      <div className="flex flex-col gap-4">
        {/* Date Filter */}
        <div className="relative" ref={dateMenuRef}>
          <label className="font-semibold">Date</label>
          <div className="flex gap-2 mt-1">
            <select
              value={dateMode}
              onChange={(e) => setDateMode(e.target.value as DateFilterMode)}
              className="focus:outline-blue-500 border border-gray-400/50 hover:border-gray-400/80 duration-150 rounded p-2 w-1/3"
            >
              <option value="at">At</option>
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="focus:outline-blue-500 border border-gray-400/50 hover:border-gray-400/80 duration-150 rounded p-2 w-2/3"
            />
          </div>
        </div>

        {/* Employee Filter */}
        <div>
          <label className="font-semibold">Employee Name</label>
          <Select
            placeholder="Select employees"
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
            placeholder="Select scores"
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
          <div className="mt-1 flex items-center focus:outline-blue-500 border border-gray-400/50 hover:border-gray-400/80 duration-150 rounded-md ">
            <input
              type="text"
              placeholder="Add a keyword"
              value={noteKeyword}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNewNoteKeyword();
                }
              }}
              onChange={(e) => setNoteKeyword(e.target.value)}
              className="focus:outline-none px-2 py-2 w-full"
            />
            <button
              onClick={handleNewNoteKeyword}
              className={`mx-2 my-2 self-end p-1 text-xl text-white bg-brand-blue rounded-full cursor-pointer duration-300 ${
                noteKeyword ? "opacity-100" : "opacity-0"
              }`}
            >
              <FaPlus />
            </button>
          </div>

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
          className="bg-brand-blue hover:bg-brand-blue/80 duration-300 px-4 py-2 rounded-md text-white cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </Modal>
  );
};

export default FeedbackFiltersModal;
