export interface Feedback {
  id: string;
  date: number;
  employeeName: string;
  score: number;
  notes: string;
}

export const feedbackData: Feedback[] = [
  {
    id: "1",
    date: 1678886400000,
    employeeName: "John Doe",
    score: 5,
    notes: "Great work on the project!",
  },
  {
    id: "2",
    date: 1678800000000,
    employeeName: "Jane Smith",
    score: 3,
    notes: "Could improve on communication.",
  },
  {
    id: "3",
    date: 1678713600000,
    employeeName: "Peter Jones",
    score: 5,
    notes: "Excellent problem-solving skills.",
  },
  {
    id: "4",
    date: 1678627200000,
    employeeName: "Mary Johnson",
    score: 2,
    notes: "Needs to be more proactive.",
  },
  {
    id: "5",
    date: 1678540800000,
    employeeName: "David Williams",
    score: 4,
    notes: "Good team player.",
  },
];
