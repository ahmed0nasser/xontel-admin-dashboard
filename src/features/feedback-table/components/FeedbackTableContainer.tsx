import React from "react";
import { useFeedbackData } from "../hooks/useFeedbackData";
import FeedbackFilters from "./FeedbackFilters";
import FeedbackTable from "./FeedbackTable";
import FeedbackPagination from "./FeedbackPagination";
import { type Feedback } from "../types";

interface FeedbackTableContainerProps {
  feedbacks: Feedback[];
  accentColor?: string;
}

const FeedbackTableContainer: React.FC<FeedbackTableContainerProps> = ({
  feedbacks,
  accentColor = "#007bff",
}) => {
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
      <FeedbackFilters
        filters={filters}
        setFilters={setFilters}
        dateMode={dateMode}
        setDateMode={setDateMode}
        dateValue={dateValue}
        setDateValue={setDateValue}
        employeeNames={employeeNames}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
        selectedScores={selectedScores}
        setSelectedScores={setSelectedScores}
        handleNoteKeyPress={handleNoteKeyPress}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
        accentColor={accentColor}
      />
      <FeedbackTable feedbacks={filteredFeedback} accentColor={accentColor} />
      <FeedbackPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
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

export default FeedbackTableContainer;
