export interface Employee {
  id: number;
  name: string;
  title: string;
  picture: string;
}

export const employeeData: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    title: "Software Engineer",
    picture: "https://xsgames.co/randomusers/avatar.php?g=pixel",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "HR Manager",
    picture: "https://xsgames.co/randomusers/avatar.php?g=pixel",
  },
  {
    id: 3,
    name: "Peter Jones",
    title: "Product Manager",
    picture: "https://xsgames.co/randomusers/avatar.php?g=pixel",
  },
  {
    id: 4,
    name: "Mary Johnson",
    title: "UX Designer",
    picture: "https://xsgames.co/randomusers/avatar.php?g=pixel",
  },
  {
    id: 5,
    name: "David Williams",
    title: "Marketing Specialist",
    picture: "https://xsgames.co/randomusers/avatar.php?g=pixel",
  },
];
