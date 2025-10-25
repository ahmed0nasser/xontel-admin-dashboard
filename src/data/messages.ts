export interface Message {
  id: number;
  employeeId: number;
  text: string;
  sender: "user" | "employee";
}

export const messageData: Message[] = [
  {
    id: 1,
    employeeId: 1,
    text: "Hello John!",
    sender: "user",
  },
  {
    id: 2,
    employeeId: 1,
    text: "Hi there!",
    sender: "employee",
  },
  {
    id: 3,
    employeeId: 2,
    text: "Hello Jane!",
    sender: "user",
  },
];
