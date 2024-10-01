import { create } from 'zustand';
import { ResumeData, PersonalInfo, Experience, Education, Project, Certification, AIAnalysis, Template, JobApplication, MasterProfile } from '../types';
import { generateId } from '../utils/helpers';
import { templates } from '../data/templates';
import { geminiService } from '../services/gemini';

interface ResumeState {
  resumes: ResumeData[];
  currentResume: ResumeData | null;
  masterProfile: MasterProfile | null;
  selectedTemplate: Template;
  isAnalyzing: boolean;
  aiAnalysis: AIAnalysis | null;
  error: string | null;
  jobApplications: JobApplication[];
  
  createNewResume: () => void;
  loadResume: (id: string) => void;
  saveResume: () => void;
  deleteResume: (id: string) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  removeCertification: (id: string) => void;
  setTemplate: (template: Template) => void;
  analyzeWithAI: () => Promise<void>;
  tailorForJob: (jobDescription: string) => Promise<void>;
  generateCoverLetter: (jobDescription: string) => Promise<string>;
  clearError: () => void;
  
  initMasterProfile: (profile?: Partial<MasterProfile>) => void;
  updateMasterProfile: (data: Partial<MasterProfile>) => void;
  addToMasterProfile: (type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications', data: any) => void;
  removeFromMasterProfile: (type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications', id: string) => void;
  
  addJobApplication: (application: Omit<JobApplication, 'id'>) => void;
  updateJobApplication: (id: string, data: Partial<JobApplication>) => void;
  removeJobApplication: (id: string) => void;
  moveJobApplication: (id: string, status: JobApplication['status']) => void;
}

const getEmptyResume = (): ResumeData => ({
  id: generateId(),
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', jobTitle: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  templateId: 'modern',
});

const getEmptyMasterProfile = (): MasterProfile => ({
  id: generateId(),
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', jobTitle: '' },
  allExperiences: [],
  allEducation: [],
  allSkills: [],
  allProjects: [],
  allCertifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResume: null,
  masterProfile: null,
  selectedTemplate: templates[0],
  isAnalyzing: false,
  aiAnalysis: null,
  error: null,
  jobApplications: [],

  createNewResume: () => set({ currentResume: getEmptyResume(), aiAnalysis: null }),

  loadResume: (id: string) => {
    const resume = get().resumes.find(r => r.id === id);
    if (resume) set({ currentResume: resume, aiAnalysis: null });
  },

  saveResume: () => {
    const { currentResume, resumes } = get();
    if (!currentResume) return;
    const updatedResume = { ...currentResume, updatedAt: new Date().toISOString() };
    const existingIndex = resumes.findIndex(r => r.id === currentResume.id);
    if (existingIndex >= 0) {
      set({ resumes: resumes.map((r, i) => i === existingIndex ? updatedResume : r), currentResume: updatedResume });
    } else {
      set({ resumes: [...resumes, updatedResume], currentResume: updatedResume });
    }
  },

  deleteResume: (id: string) => {
    set({ resumes: get().resumes.filter(r => r.id !== id), currentResume: get().currentResume?.id === id ? null : get().currentResume });
  },

  updatePersonalInfo: (info: Partial<PersonalInfo>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, personalInfo: { ...currentResume.personalInfo, ...info }, updatedAt: new Date().toISOString() } });
  },

  updateSummary: (summary: string) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, summary, updatedAt: new Date().toISOString() } });
  },

  addExperience: (experience: Omit<Experience, 'id'>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, experience: [...currentResume.experience, { ...experience, id: generateId() }], updatedAt: new Date().toISOString() } });
  },

  updateExperience: (id: string, experience: Partial<Experience>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, experience: currentResume.experience.map(e => e.id === id ? { ...e, ...experience } : e), updatedAt: new Date().toISOString() } });
  },

  removeExperience: (id: string) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, experience: currentResume.experience.filter(e => e.id !== id), updatedAt: new Date().toISOString() } });
  },

  addEducation: (education: Omit<Education, 'id'>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, education: [...currentResume.education, { ...education, id: generateId() }], updatedAt: new Date().toISOString() } });
  },

  updateEducation: (id: string, education: Partial<Education>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, education: currentResume.education.map(e => e.id === id ? { ...e, ...education } : e), updatedAt: new Date().toISOString() } });
  },

  removeEducation: (id: string) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, education: currentResume.education.filter(e => e.id !== id), updatedAt: new Date().toISOString() } });
  },

  addSkill: (skill: string) => {
    const { currentResume } = get();
    if (!currentResume || currentResume.skills.includes(skill)) return;
    set({ currentResume: { ...currentResume, skills: [...currentResume.skills, skill], updatedAt: new Date().toISOString() } });
  },

  removeSkill: (skill: string) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, skills: currentResume.skills.filter(s => s !== skill), updatedAt: new Date().toISOString() } });
  },

  addProject: (project: Omit<Project, 'id'>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, projects: [...currentResume.projects, { ...project, id: generateId() }], updatedAt: new Date().toISOString() } });
  },

  updateProject: (id: string, project: Partial<Project>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, projects: currentResume.projects.map(p => p.id === id ? { ...p, ...project } : p), updatedAt: new Date().toISOString() } });
  },

  removeProject: (id: string) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, projects: currentResume.projects.filter(p => p.id !== id), updatedAt: new Date().toISOString() } });
  },

  addCertification: (certification: Omit<Certification, 'id'>) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, certifications: [...currentResume.certifications, { ...certification, id: generateId() }], updatedAt: new Date().toISOString() } });
  },

  removeCertification: (id: string) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ currentResume: { ...currentResume, certifications: currentResume.certifications.filter(c => c.id !== id), updatedAt: new Date().toISOString() } });
  },

  setTemplate: (template: Template) => set({ selectedTemplate: template }),

  analyzeWithAI: async () => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({ isAnalyzing: true, error: null });
    try {
      const analysis = await geminiService.analyzeResume(currentResume);
      set({ aiAnalysis: analysis, isAnalyzing: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to analyze resume', isAnalyzing: false });
    }
  },

  tailorForJob: async (jobDescription: string) => {
    const { masterProfile } = get();
    if (!masterProfile) return;
    set({ isAnalyzing: true, error: null });
    try {
      const tailoredContent = await geminiService.tailorResumeForJD(masterProfile, jobDescription);
      console.log('Tailored content:', tailoredContent);
      set({ isAnalyzing: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to tailor resume', isAnalyzing: false });
    }
  },

  generateCoverLetter: async (jobDescription: string): Promise<string> => {
    const { masterProfile } = get();
    if (!masterProfile) return '';
    try {
      return await geminiService.generateCoverLetter(masterProfile, jobDescription);
    } catch (error) {
      return '';
    }
  },

  clearError: () => set({ error: null }),

  initMasterProfile: (profile?: Partial<MasterProfile>) => {
    const existingProfile = get().masterProfile;
    if (existingProfile) return;
    set({ masterProfile: profile ? { ...getEmptyMasterProfile(), ...profile } : getEmptyMasterProfile() });
  },

  updateMasterProfile: (data: Partial<MasterProfile>) => {
    const { masterProfile } = get();
    if (!masterProfile) return;
    set({ masterProfile: { ...masterProfile, ...data, updatedAt: new Date().toISOString() } });
  },

  addToMasterProfile: (type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications', data: any) => {
    const { masterProfile } = get();
    if (!masterProfile) return;
    const newData = { ...data, id: generateId() };
    const key = type === 'experience' ? 'allExperiences' : type === 'education' ? 'allEducation' : type === 'skills' ? 'allSkills' : type === 'projects' ? 'allProjects' : 'allCertifications';
    set({ masterProfile: { ...masterProfile, [key]: [...(masterProfile as any)[key], newData], updatedAt: new Date().toISOString() } });
  },

  removeFromMasterProfile: (type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications', id: string) => {
    const { masterProfile } = get();
    if (!masterProfile) return;
    const key = type === 'experience' ? 'allExperiences' : type === 'education' ? 'allEducation' : type === 'skills' ? 'allSkills' : type === 'projects' ? 'allProjects' : 'allCertifications';
    set({ masterProfile: { ...masterProfile, [key]: (masterProfile as any)[key].filter((item: any) => item.id !== id), updatedAt: new Date().toISOString() } });
  },

  addJobApplication: (application: Omit<JobApplication, 'id'>) => {
    set({ jobApplications: [...get().jobApplications, { ...application, id: generateId() }] });
  },

  updateJobApplication: (id: string, data: Partial<JobApplication>) => {
    set({ jobApplications: get().jobApplications.map(app => app.id === id ? { ...app, ...data } : app) });
  },

  removeJobApplication: (id: string) => {
    set({ jobApplications: get().jobApplications.filter(app => app.id !== id) });
  },

  moveJobApplication: (id: string, status: JobApplication['status']) => {
    set({ jobApplications: get().jobApplications.map(app => app.id === id ? { ...app, status } : app) });
  },
}));

export default useResumeStore;
