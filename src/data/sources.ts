export interface ScholarshipSource {
  id: string;
  name: string;
  url: string;
  description: string;
  fields: string[];
  logo?: string;
}

export const scholarshipSources: ScholarshipSource[] = [
  {
    id: "fastweb",
    name: "FastWeb",
    url: "https://www.fastweb.com",
    description: "One of the largest scholarship databases with over 1.5 million opportunities",
    fields: ["All Fields", "STEM", "Business", "Arts", "Humanities"]
  },
  {
    id: "scholarshipowl",
    name: "ScholarshipOwl",
    url: "https://scholarshipowl.com",
    description: "Automated scholarship matching and application platform",
    fields: ["All Fields", "Engineering", "Medical", "Technology"]
  },
  {
    id: "un",
    name: "UN Scholarships",
    url: "https://www.un.org/en/academic-impact/scholarships",
    description: "United Nations scholarship programs for international students",
    fields: ["International Relations", "STEM", "Sustainability", "Peace Studies"]
  },
  {
    id: "greenfuture",
    name: "Green Future",
    url: "https://greenfuture.org",
    description: "Environmental and sustainability focused scholarships",
    fields: ["Environmental Science", "Sustainability", "Climate Studies"]
  },
  {
    id: "womeninstem",
    name: "Women in STEM Network",
    url: "https://womeninstem.net",
    description: "Scholarships and grants specifically for women in STEM fields",
    fields: ["Engineering", "Computer Science", "Mathematics", "Sciences"]
  },
  {
    id: "globalleaders",
    name: "Global Leaders Foundation",
    url: "https://globalleaders.org",
    description: "Leadership development scholarships for international students",
    fields: ["All Fields", "Leadership", "Business", "International Studies"]
  },
  {
    id: "techinnovators",
    name: "Tech Innovators Grant",
    url: "https://techinnovators.org",
    description: "Technology and innovation focused scholarship opportunities",
    fields: ["Technology", "Computer Science", "Engineering", "Innovation"]
  },
  {
    id: "artgrants",
    name: "Arts & Culture Fund",
    url: "https://artgrants.net",
    description: "Supporting students in arts, humanities, and creative fields",
    fields: ["Arts", "Humanities", "Design", "Creative Writing", "Music"]
  }
];
