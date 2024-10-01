import { Template } from '../types';

export const templates: Template[] = [
  { id: 'modern', name: 'Modern', description: 'Clean and professional with contemporary design', thumbnail: 'modern' },
  { id: 'classic', name: 'Classic', description: 'Traditional resume layout with elegant styling', thumbnail: 'classic' },
  { id: 'creative', name: 'Creative', description: 'Eye-catching design for creative roles', thumbnail: 'creative' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and focused on content', thumbnail: 'minimal' },
  { id: 'executive', name: 'Executive', description: 'Professional design for senior positions', thumbnail: 'executive' },
  { id: 'tech', name: 'Tech', description: 'Perfect for software engineers and developers', thumbnail: 'tech' },
];

export const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'React Native', 'Node.js', 'Python', 'Java', 'C++',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL',
  'Firebase', 'Swift', 'Kotlin', 'Flutter', 'UI/UX Design', 'Figma'
];

export const commonJobTitles = [
  'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Mobile Developer', 'Data Scientist', 'Product Manager', 'UI/UX Designer',
  'DevOps Engineer', 'Machine Learning Engineer'
];

export const actionVerbs = [
  'Achieved', 'Built', 'Created', 'Delivered', 'Designed', 'Developed', 'Directed',
  'Enhanced', 'Executed', 'Implemented', 'Improved', 'Increased', 'Led', 'Managed',
  'Optimized', 'Orchestrated', 'Resolved', 'Spearheaded', 'Transformed', 'Validated'
];

export const weakVerbs = ['did', 'made', 'got', 'helped', 'worked', 'used', 'managed', 'fixed', 'improved', 'increased'];
