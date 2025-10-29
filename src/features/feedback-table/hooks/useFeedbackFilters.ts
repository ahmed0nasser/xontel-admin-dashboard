import { useState, useMemo } from "react";
import { type Feedback } from "../../../types";
import { type Filter, type DateFilterMode } from "../types";

export const useFeedbackFilters = (feedbacks: Feedback[]) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [dateMode, setDateMode] = useState<DateFilterMode>("at");
  const [dateValue, setDateValue] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedScores, setSelectedScores] = useState<number[]>([]);
  const [noteKeywords, setNoteKeywords] = useState<string[]>([]);

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

  const handleNoteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement | null;
      if (target && target.value.trim()) {
        setNoteKeywords((prev) => [...prev, target.value.trim()]);
      }
    }
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
    handleApplyFilters,
    handleResetFilters,
    handleNoteKeyPress,
    filteredFeedback,
  };
};
