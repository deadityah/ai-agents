// Site metadata, creator links, and global configuration values.
export interface SiteConfig {
  name: string;
  tagline: string;
  ownerName: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  exampleTopics: string[];
}

export const siteConfig: SiteConfig = {
  name: "ResearchPilot",
  tagline: "Autonomous AI Research Agent with Cost Controls",
  ownerName: "Aditya",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  exampleTopics: [
    "How do heat pumps compare with gas furnaces?",
    "What is retrieval-augmented generation and when should I use it?",
    "Pros and cons of 4-day work weeks",
    "Latest approaches to battery recycling",
  ],
};
