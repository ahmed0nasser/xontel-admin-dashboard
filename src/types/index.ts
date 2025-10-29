export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName:string;
  title: string;
  profilePictureUrl: string;
  role: 'employee' | 'hr';
  joinedDate: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  isRead: boolean;
  timestamp: Date;
}

export interface Feedback {
  id: string;
  date: Date;
  employeeName: string;
  score: number;
  notes: string;
}