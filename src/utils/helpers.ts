export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return phoneRegex.test(phone);
};

export const getResumeCompleteness = (resume: any): number => {
  if (!resume) return 0;
  let score = 0;
  const totalFields = 8;
  if (resume.personalInfo?.fullName) score++;
  if (resume.personalInfo?.email) score++;
  if (resume.personalInfo?.phone) score++;
  if (resume.summary) score++;
  if (resume.experience?.length > 0) score++;
  if (resume.education?.length > 0) score++;
  if (resume.skills?.length > 0) score++;
  if (resume.projects?.length > 0 || resume.certifications?.length > 0) score++;
  return Math.round((score / totalFields) * 100);
};

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const parseResumeJSON = (jsonString: string): any | null => {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      personalInfo: parsed.personalInfo || {},
      summary: parsed.summary || '',
      experience: parsed.experience || [],
      education: parsed.education || [],
      skills: parsed.skills || [],
      projects: parsed.projects || [],
      certifications: parsed.certifications || [],
    };
  } catch (error) {
    console.error('Failed to parse resume JSON:', error);
    return null;
  }
};

export const extractKeywords = (text: string): string[] => {
  const techKeywords = [
    'React', 'React Native', 'JavaScript', 'TypeScript', 'Python', 'Java',
    'Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'REST API', 'GraphQL', 'Firebase', 'Redux',
    'Zustand', 'Expo', 'Flutter', 'Swift', 'Kotlin', 'TensorFlow',
    'Machine Learning', 'Data Science', 'UI/UX', 'Figma', 'Agile', 'Scrum'
  ];
  const lowerText = text.toLowerCase();
  return techKeywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
};

export const generateActionVerbSuggestions = (weakVerb: string): string[] => {
  const suggestions: { [key: string]: string[] } = {
    'did': ['Executed', 'Implemented', 'Delivered', 'Orchestrated'],
    'made': ['Created', 'Developed', 'Built', 'Constructed'],
    'got': ['Achieved', 'Secured', 'Obtained', 'Generated'],
    'helped': ['Facilitated', 'Assisted', 'Supported', 'Enabled'],
    'worked': ['Collaborated', 'Partnered', 'Cooperated', 'Engaged'],
    'used': ['Utilized', 'Leveraged', 'Employed', 'Applied'],
    'managed': ['Directed', 'Led', 'Oversaw', 'Coordinated'],
    'fixed': ['Resolved', 'Rectified', 'Debugged', 'Remediated'],
    'improved': ['Enhanced', 'Optimized', 'Refined', 'Upgraded'],
    'increased': ['Boosted', 'Elevated', 'Amplified', 'Maximized']
  };
  return suggestions[weakVerb.toLowerCase()] || ['Achieved', 'Delivered', 'Led'];
};
