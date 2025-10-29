import React, { useState, useEffect } from "react";
import { useFeedbackFilters } from "../hooks/useFeedbackFilters";
import { useFeedbackPagination } from "../hooks/useFeedbackPagination";
import FeedbackFiltersModal from "./FeedbackFiltersModal";
import FeedbackTable from "./FeedbackTable";
import FeedbackPagination from "./FeedbackPagination";
import { type Feedback } from "../../../types";
import "../styles.css";
import { ACCENT_COLOR } from "../constants";
import { LuSettings2 } from "react-icons/lu";
import { RxReset } from "react-icons/rx";
import Tooltip from "../../../components/ui/Tooltip";
import { subscribeToFeedbacks } from "../../../services/firebase";

const FeedbackTableContainer: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToFeedbacks(setFeedbacks);
    return () => unsubscribe();
  }, []);
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
  } = useFeedbackFilters(feedbacks);

  const { currentPage, setCurrentPage, totalPages, paginatedFeedback } =
    useFeedbackPagination(filteredFeedback);

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
                label = `${
                  filter.mode[0].toUpperCase() + filter.mode.slice(1)
                } ${filter.value.date.toISOString().split("T")[0]}`;
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
        <div className="flex gap-4 px-4 ">
          {filters.length > 0 && (
            <Tooltip text="Reset Filters">
              <button
                onClick={handleResetFilters}
                className="-mb-2 text-3xl text-red-500 hover:text-red-700 cursor-pointer duration-300"
              >
                <RxReset />
              </button>
            </Tooltip>
          )}
          <Tooltip text="Filter Feedbacks">
            <button
              onClick={() => setIsModalOpen(true)}
              className="-mb-2 text-3xl text-gray-600/70 hover:text-brand-blue cursor-pointer duration-300"
            >
              <LuSettings2 />
            </button>
          </Tooltip>
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
      <FeedbackTable feedbacks={paginatedFeedback} />
      <FeedbackPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default FeedbackTableContainer;