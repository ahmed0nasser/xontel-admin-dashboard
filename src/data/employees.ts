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
    picture: "/male-person-picture.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "HR Manager",
    picture: "/male-person-picture.jpg",
  },
  {
    id: 3,
    name: "Peter Jones",
    title: "Product Manager",
    picture: "/male-person-picture.jpg",
  },
  {
    id: 4,
    name: "Mary Johnson",
    title: "UX Designer",
    picture: "/male-person-picture.jpg",
  },
  {
    id: 5,
    name: "David Williams",
    title: "Marketing Specialist",
    picture: "/male-person-picture.jpg",
  },
];
