import React, { useState } from "react";
import { useFeedbackData } from "../hooks/useFeedbackData";
import FeedbackFiltersModal from "./FeedbackFiltersModal";
import FeedbackTable from "./FeedbackTable";
import FeedbackPagination from "./FeedbackPagination";
import { type Feedback } from "../types";
import "../styles.css";
import { ACCENT_COLOR } from "../constants";

interface FeedbackTableContainerProps {
  feedbacks: Feedback[];
}

const FeedbackTableContainer: React.FC<FeedbackTableContainerProps> = ({
  feedbacks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
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
    filteredFeedback,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useFeedbackData(feedbacks);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Feedback Table</h2>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, idx) => {
              let label = "";
              let color = ACCENT_COLOR;

              if (filter.type === "date") {
                label = `${filter.mode[0].toUpperCase() + filter.mode.slice(
                  1
                )} ${filter.value.date.toISOString().split("T")[0]}`;
                color = "#60a5fa";
              } else if (filter.type === "employee") {
                label = filter.value;
                color = "#34d399";
              } else if (filter.type === "score") {
                label = `${filter.value} star${
                  filter.value !== "1" ? "s" : ""
                }`;
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
      <FeedbackFiltersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        dateMode={dateMode}
        setDateMode={setDateMode}
        dateValue={dateValue}
        setDateValue={setDateValue}
        employeeNames={employeeNames}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
        selectedScores={selectedScores}
        setSelectedScores={setSelectedScores}
        noteKeywords={noteKeywords}
        setNoteKeywords={setNoteKeywords}
        handleNoteKeyPress={handleNoteKeyPress}
        handleApplyFilters={handleApplyFilters}
      />
      <FeedbackTable feedbacks={filteredFeedback} />
      <FeedbackPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default FeedbackTableContainer;
