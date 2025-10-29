import { useState, useMemo, useEffect } from "react";
import { type Feedback } from "../../../types";
import { ITEMS_PER_PAGE } from "../constants";

export const useFeedbackPagination = (filteredFeedback: Feedback[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(filteredFeedback.length / ITEMS_PER_PAGE) || 1,
    [filteredFeedback.length]
  );

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const paginatedFeedback = filteredFeedback.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);


  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedFeedback,
  };
};
