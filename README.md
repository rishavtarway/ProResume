# ProResume - AI-Powered Resume Builder

A full-featured resume building application with AI-powered analysis, ATS optimization, and job application tracking. Build professional resumes that pass applicant tracking systems.

## Features

- **AI Resume Analysis**: Get instant feedback on your resume with ATS scoring
- **Master Profile Architecture**: Store all your experience once, use it everywhere
- **JD Tailoring**: Automatically tailor your resume to match job descriptions
- **Multiple Templates**: ATS-compliant professional templates
- **Job Tracker**: Kanban-style application tracking (Saved, Applied, Interview, Rejected)
- **Cover Letter Generation**: AI-powered cover letter creation
- **PDF Export**: Export resumes in PDF format
- **Skills Suggestions**: Curated skill recommendations by category

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **PDF Generation**: expo-print
- **AI Integration**: Google Gemini API
- **Icons**: @expo/vector-icons

## Project Structure

```
ProResume/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens (Home, Templates, JobTracker, Profile, ResumeForm)
│   ├── store/          # Zustand state management
│   ├── services/       # Gemini AI service
│   ├── utils/          # Helper functions (formatters, validators)
│   ├── types/          # TypeScript interfaces
│   └── data/           # Static data (templates, skill suggestions)
├── App.tsx             # App entry point
└── app.json            # Expo configuration
```

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI
- For iOS: Xcode (macOS)
- For Android: Android Studio

### Steps

1. Clone the repository:
```bash
git clone https://github.com/rishavtarway/ProResume.git
cd ProResume
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Or scan QR code with Expo Go app on your phone
```

### Environment Variables

Create a `.env` file:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

Get your API key from: https://aistudio.google.com/app/apikey

## Key Features Explained

### Master Profile
Instead of retyping your experience for every resume, store it once in your Master Profile. The app automatically pulls relevant data when creating new resumes.

### ATS Optimization
The app analyzes your resume against common ATS (Applicant Tracking System) criteria and provides suggestions to improve your chances of passing automated screenings.

### JD Tailoring
Paste a job description, and the AI will help you tailor your resume to highlight the most relevant skills and experience for that specific role.

## License

MIT License
