import { useState, useMemo } from "react";
import { type Feedback, type Filter, type DateFilterMode } from "../types";

export const useFeedbackData = (feedbacks: Feedback[]) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [dateMode, setDateMode] = useState<DateFilterMode>("at");
  const [dateValue, setDateValue] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedScores, setSelectedScores] = useState<number[]>([]);
  const [noteKeywords, setNoteKeywords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const employeeNames = useMemo(
    () => Array.from(new Set(feedbacks.map((f) => f.employeeName))),
    [feedbacks]
  );

  const handleApplyFilters = () => {
    const newFilters: Filter[] = [];

    if (dateValue) {
      newFilters.push({
        type: "date",
        mode: dateMode,
        value: { date: new Date(dateValue) },
      });
    }

    selectedEmployees.forEach((emp) =>
      newFilters.push({ type: "employee", value: emp })
    );

    selectedScores.forEach((score) =>
      newFilters.push({ type: "score", value: score.toString() })
    );

    noteKeywords.forEach((note) =>
      newFilters.push({ type: "notes", value: note })
    );

    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters([]);
    setSelectedEmployees([]);
    setSelectedScores([]);
    setNoteKeywords([]);
    setDateValue("");
    setDateMode("before");
  };

  const filteredFeedback = useMemo(() => {
    let result = [...feedbacks];

    if (filters.length > 0) {
      result = result.filter((f) => {
        return filters.every((filter) => {
          switch (filter.type) {
            case "date": {
              const fd = new Date(f.date);
              const fv = filter.value.date;
              if (filter.mode === "before") return fd < fv;
              if (filter.mode === "after") return fd > fv;
              return fd.toDateString() === fv.toDateString();
            }
            case "employee":
              return selectedEmployees.length === 0
                ? true
                : selectedEmployees.includes(f.employeeName);
            case "score":
              return selectedScores.length === 0
                ? true
                : selectedScores.includes(f.score);
            case "notes":
              return f.notes.toLowerCase().includes(filter.value.toLowerCase());
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [feedbacks, filters, selectedEmployees, selectedScores]);

  const paginatedFeedback = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    let currentItems = filteredFeedback.slice(indexOfFirst, indexOfLast);

    if (currentItems.length < itemsPerPage) {
      const diff = itemsPerPage - currentItems.length;
      const emptyRows = Array(diff).fill({
        id: -1,
        date: "",
        employeeName: "",
        score: 0,
        notes: "",
      });
      currentItems = [...currentItems, ...emptyRows];
    }
    return currentItems;
  }, [filteredFeedback, currentPage]);

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

  const handleNoteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement | null;
      if (target && target.value.trim()) {
        setNoteKeywords((prev) => [...prev, target.value.trim()]);
        target.value = "";
      }
    }
  };

  return {
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
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleApplyFilters,
    handleResetFilters,
    handleNoteKeyPress,
    filteredFeedback: paginatedFeedback,
    totalPages,
  };
};