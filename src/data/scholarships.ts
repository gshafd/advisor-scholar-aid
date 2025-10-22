export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  matchScore: string;
  eligibility: string;
  tags: string[];
  source: string;
}

export const scholarships: Scholarship[] = [
  {
    id: "SCH001",
    name: "UN STEM Scholarship",
    amount: "$10,000",
    deadline: "2026-03-15",
    matchScore: "92%",
    eligibility: "International STEM students with GPA > 3.5",
    tags: ["STEM", "GPA", "International"],
    source: "un.org"
  },
  {
    id: "SCH002",
    name: "Women in Tech Award",
    amount: "$5,000",
    deadline: "2026-02-20",
    matchScore: "88%",
    eligibility: "Female students in engineering or computer science",
    tags: ["Female", "Tech"],
    source: "scholarshipowl.com"
  },
  {
    id: "SCH003",
    name: "Global Need-Based Grant",
    amount: "$8,000",
    deadline: "2026-04-05",
    matchScore: "80%",
    eligibility: "High financial need, any major",
    tags: ["Need-based"],
    source: "fastweb.com"
  },
  {
    id: "SCH004",
    name: "Green Future Fellowship",
    amount: "$6,500",
    deadline: "2026-03-30",
    matchScore: "85%",
    eligibility: "Students focused on sustainability & environment",
    tags: ["Sustainability"],
    source: "greenfuture.org"
  },
  {
    id: "SCH005",
    name: "First-Gen College Scholars",
    amount: "$4,000",
    deadline: "2026-01-15",
    matchScore: "75%",
    eligibility: "First-generation college students",
    tags: ["First-gen"],
    source: "collegescholarships.org"
  },
  {
    id: "SCH006",
    name: "Arts & Culture Excellence Fund",
    amount: "$7,500",
    deadline: "2026-05-10",
    matchScore: "83%",
    eligibility: "Students in arts & humanities with GPA > 3.5",
    tags: ["Arts"],
    source: "artgrants.net"
  },
  {
    id: "SCH007",
    name: "Global Leadership Scholarship",
    amount: "$9,000",
    deadline: "2026-04-25",
    matchScore: "86%",
    eligibility: "International students with leadership potential",
    tags: ["Leadership", "International"],
    source: "globalleaders.org"
  },
  {
    id: "SCH008",
    name: "Women in STEM Fellowship",
    amount: "$6,000",
    deadline: "2026-03-05",
    matchScore: "90%",
    eligibility: "Female students in STEM fields",
    tags: ["Female", "STEM"],
    source: "womeninstem.net"
  },
  {
    id: "SCH009",
    name: "Veterans Education Award",
    amount: "$3,000",
    deadline: "2026-02-28",
    matchScore: "70%",
    eligibility: "Domestic students who are veterans",
    tags: ["Veteran", "Domestic"],
    source: "vetsfund.org"
  },
  {
    id: "SCH010",
    name: "Tech Innovators Grant",
    amount: "$8,500",
    deadline: "2026-04-12",
    matchScore: "84%",
    eligibility: "Students in technology or engineering",
    tags: ["Tech", "Engineering"],
    source: "techinnovators.org"
  }
];
