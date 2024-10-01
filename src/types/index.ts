export interface ResumeData {
  id: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
  templateId: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  jobTitle: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface AIAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  atsScore: number;
  suggestions: string[];
}

export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  status: 'saved' | 'applied' | 'interview' | 'rejected' | 'ghosted';
  resumeId: string;
  jobDescription: string;
  appliedDate: string;
  coverLetter?: string;
}

export interface MasterProfile {
  id: string;
  personalInfo: PersonalInfo;
  allExperiences: Experience[];
  allEducation: Education[];
  allSkills: string[];
  allProjects: Project[];
  allCertifications: Certification[];
  createdAt: string;
  updatedAt: string;
}
