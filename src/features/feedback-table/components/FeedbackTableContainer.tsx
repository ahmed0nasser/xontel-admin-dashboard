import React, { useState } from "react";
import { useFeedbackData } from "../hooks/useFeedbackData";
import FeedbackFilters from "./FeedbackFilters";
import FeedbackTable from "./FeedbackTable";
import FeedbackPagination from "./FeedbackPagination";
import { type Feedback } from "../types";
import "../styles.css";

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
      <FeedbackFilters
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
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
        noteKeywords={noteKeywords}
        setNoteKeywords={setNoteKeywords}
        handleNoteKeyPress={handleNoteKeyPress}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
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
