import { type Conversation } from "../types";
import { employeeData } from "./employees";

// Assuming the HR user is the one logged in.
const hrUser = { id: "0", name: "Admin User" };

export const conversationsData: Conversation[] = [
  {
    id: "1", // Employee ID for John Doe
    participantNames: [hrUser.name, `${employeeData[0].firstName} ${employeeData[0].lastName}`],
    lastMessage: "Hello! It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    lastMessageTimestamp: new Date("2025-10-29T10:01:00Z"),
    messages: [
      {
        id: "msg1",
        senderId: hrUser.id,
        text: "Hello John!",
        isRead: true,
        timestamp: new Date("2025-10-29T10:00:00Z"),
      },
      {
        id: "msg2",
        senderId: "1",
        text: "Hello! It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        isRead: true,
        timestamp: new Date("2025-10-29T10:01:00Z"),
      },
    ],
  },
  {
    id: "2", // Employee ID for Jane Smith
    participantNames: [hrUser.name, `${employeeData[1].firstName} ${employeeData[1].lastName}`],
    lastMessage: "Hello Jane!",
    lastMessageTimestamp: new Date("2025-10-30T11:30:00Z"),
    messages: [
      {
        id: "msg3",
        senderId: hrUser.id,
        text: "Hello Jane!",
        isRead: false,
        timestamp: new Date("2025-10-30T11:30:00Z"),
      },
    ],
  },
];