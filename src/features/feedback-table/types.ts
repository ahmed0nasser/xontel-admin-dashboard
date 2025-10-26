import { type Feedback } from "../../data/feedback";

export type { Feedback };

export type DateFilterMode = "before" | "after" | "at";

export type Filter =
  | { type: "date"; mode: DateFilterMode; value: { date: Date } }
  | { type: "employee" | "score" | "notes"; value: string };
