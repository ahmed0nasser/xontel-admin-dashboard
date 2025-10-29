import { useState, useMemo } from "react";
import { type Feedback } from "../../../types";
import { type Filter, type DateFilterMode } from "../types";

export const useFeedbackFilters = (feedbacks: Feedback[]) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [dateMode, setDateMode] = useState<DateFilterMode>("before");
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

  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    if (filters.length > 0) {
      result = result.filter((feedback) => {
        let dateFilter = dateValue === "";
        const fd = feedback.date;
        const fv = new Date(dateValue);
        switch (dateMode) {
          case "before":
            dateFilter ||= fd < fv;
            break;
          case "after":
            dateFilter ||= fd > fv;
            break;
          case "at":
            dateFilter ||= fd === fv;
        }
        const employeeFilter = selectedEmployees.length <= 0 || selectedEmployees.includes(feedback.employeeName);
        const scoreFilter = selectedScores.length <= 0 || selectedScores.includes(feedback.score);
        const notesFilter = noteKeywords.length <= 0 || feedback.notes.toLowerCase().split(" ").some(word => noteKeywords.join("|").toLowerCase().split("|").includes(word));

        return dateFilter && notesFilter && employeeFilter && scoreFilter;
      });
    }

    return result;
  }, [filters, feedbacks, dateValue, dateMode, selectedEmployees, selectedScores, noteKeywords]);


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
    filteredFeedbacks
  };
};
