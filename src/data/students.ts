export interface Student {
  id: string;
  name: string;
  major: string;
  GPA: number;
  nationality: string;
  financialNeed: "High" | "Medium" | "Low";
  tags: string[];
}

export const students: Student[] = [
  {
    id: "S001",
    name: "Alex Johnson",
    major: "Mechanical Engineering",
    GPA: 3.8,
    nationality: "India",
    financialNeed: "High",
    tags: ["First-gen", "Female in STEM", "International"]
  },
  {
    id: "S002",
    name: "Maria Santos",
    major: "Computer Science",
    GPA: 3.5,
    nationality: "Brazil",
    financialNeed: "Medium",
    tags: ["Female", "Latinx", "Tech"]
  },
  {
    id: "S003",
    name: "Ethan Brown",
    major: "Political Science",
    GPA: 3.2,
    nationality: "USA",
    financialNeed: "Low",
    tags: ["Domestic", "First-gen"]
  },
  {
    id: "S004",
    name: "Sophia Kim",
    major: "Biomedical Engineering",
    GPA: 3.9,
    nationality: "South Korea",
    financialNeed: "High",
    tags: ["Female in STEM", "International"]
  },
  {
    id: "S005",
    name: "David Okoro",
    major: "Business Administration",
    GPA: 3.4,
    nationality: "Nigeria",
    financialNeed: "High",
    tags: ["International", "Entrepreneurial"]
  },
  {
    id: "S006",
    name: "Chloe Nguyen",
    major: "Art History",
    GPA: 3.7,
    nationality: "Vietnam",
    financialNeed: "Medium",
    tags: ["Creative", "International"]
  },
  {
    id: "S007",
    name: "Liam Carter",
    major: "Electrical Engineering",
    GPA: 3.6,
    nationality: "USA",
    financialNeed: "Low",
    tags: ["Veteran", "Domestic"]
  },
  {
    id: "S008",
    name: "Zara Ahmed",
    major: "Environmental Science",
    GPA: 3.85,
    nationality: "Pakistan",
    financialNeed: "High",
    tags: ["Female", "Sustainability", "International"]
  },
  {
    id: "S009",
    name: "Noah Williams",
    major: "Chemistry",
    GPA: 3.3,
    nationality: "Canada",
    financialNeed: "Medium",
    tags: ["STEM", "Domestic"]
  },
  {
    id: "S010",
    name: "Ava Martinez",
    major: "Psychology",
    GPA: 3.75,
    nationality: "Mexico",
    financialNeed: "High",
    tags: ["First-gen", "Female", "International"]
  }
];
