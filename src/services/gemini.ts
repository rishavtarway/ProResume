import axios from 'axios';
import { ResumeData, AIAnalysis, MasterProfile } from '../types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'your-api-key-here';
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const geminiService = {
  analyzeResume: async (resume: ResumeData): Promise<AIAnalysis> => {
    const prompt = `Analyze this resume and provide:
1. Overall score (0-100)
2. Key strengths (array)
3. Areas for improvement (array)
4. Missing keywords for ATS (array)
5. ATS compatibility score (0-100)
6. Specific suggestions for improvement (array)

Resume data:
${JSON.stringify(resume, null, 2)}

Respond in JSON format:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "keywords": string[],
  "atsScore": number,
  "suggestions": string[]
}`;

    try {
      const response = await axios.post(GEMINI_BASE_URL, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const text = response.data.candidates[0]?.content?.parts[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return generateMockAnalysis(resume);
    } catch (error) {
      console.error('Gemini API error:', error);
      return generateMockAnalysis(resume);
    }
  },

  tailorResumeForJD: async (masterProfile: MasterProfile, jobDescription: string): Promise<string> => {
    const prompt = `Given this Master Profile and Job Description, generate a tailored resume summary and select the most relevant experiences, skills, and projects.

Master Profile:
${JSON.stringify(masterProfile, null, 2)}

Job Description:
${jobDescription}

Provide the tailored content in JSON format:
{
  "tailoredSummary": string,
  "relevantExperiences": array,
  "relevantSkills": array,
  "relevantProjects": array,
  "coverLetter": string
}`;

    try {
      const response = await axios.post(GEMINI_BASE_URL, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      });

      const text = response.data.candidates[0]?.content?.parts[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      return JSON.stringify(generateMockTailoredContent());
    } catch (error) {
      console.error('Gemini API error:', error);
      return JSON.stringify(generateMockTailoredContent());
    }
  },

  generateCoverLetter: async (masterProfile: MasterProfile, jobDescription: string): Promise<string> => {
    const prompt = `Generate a professional, non-robotic cover letter based on:
Master Profile: ${JSON.stringify(masterProfile.personalInfo)}
Job Description: ${jobDescription}

Keep it concise, 3-4 paragraphs, and highlight relevant skills.`;

    try {
      const response = await axios.post(GEMINI_BASE_URL, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      return response.data.candidates[0]?.content?.parts[0]?.text || generateMockCoverLetter();
    } catch (error) {
      console.error('Gemini API error:', error);
      return generateMockCoverLetter();
    }
  },

  improveBulletPoint: async (bullet: string): Promise<string> => {
    const prompt = `Improve this resume bullet point to be more impactful with action verbs and quantifiable metrics:
"${bullet}"

Provide just the improved version without explanation.`;

    try {
      const response = await axios.post(GEMINI_BASE_URL, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
      });
      return response.data.candidates[0]?.content?.parts[0]?.text || bullet;
    } catch (error) {
      return bullet;
    }
  },

  parseResumeFromText: async (text: string): Promise<Partial<ResumeData>> => {
    const prompt = `Parse this resume text and extract structured data:
${text}

Provide JSON with: personalInfo, summary, experience (array), education (array), skills (array).`;

    try {
      const response = await axios.post(GEMINI_BASE_URL, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
      });

      const resultText = response.data.candidates[0]?.content?.parts[0]?.text || '';
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }
    return {};
  },
};

const generateMockAnalysis = (resume: ResumeData): AIAnalysis => {
  let score = 50;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const keywords: string[] = [];
  const suggestions: string[] = [];

  if (resume.personalInfo?.fullName) score += 5;
  if (resume.summary?.length > 50) { score += 10; strengths.push('Strong professional summary'); }
  if (resume.experience?.length >= 2) { score += 10; strengths.push('Relevant work experience'); }
  if (resume.skills?.length >= 5) { score += 10; keywords.push(...resume.skills.slice(0, 5)); }
  if (resume.education?.length > 0) score += 5;

  if (!resume.summary) { improvements.push('Add a professional summary'); suggestions.push('Write a 2-3 sentence summary'); }
  if (resume.experience?.length < 2) { improvements.push('Add more work experience'); }
  if (resume.skills?.length < 5) { improvements.push('Add more technical skills'); }

  return {
    score: Math.min(100, score),
    strengths,
    improvements,
    keywords,
    atsScore: Math.min(100, score - 15),
    suggestions,
  };
};

const generateMockTailoredContent = () => ({
  tailoredSummary: 'Experienced software developer with strong React and Node.js skills...',
  relevantExperiences: [],
  relevantSkills: ['JavaScript', 'React', 'Node.js'],
  relevantProjects: [],
  coverLetter: 'Dear Hiring Manager...'
});

const generateMockCoverLetter = () => `
Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With my background in software development and passion for building innovative solutions, I believe I would be a valuable addition to your team.

Throughout my career, I have demonstrated expertise in developing scalable applications and collaborating with cross-functional teams to deliver high-quality products. I am excited about the opportunity to contribute to your organization's success.

Thank you for considering my application. I look forward to discussing how I can bring value to your team.

Best regards,
[Your Name]
`;
