# ProResume - AI-Powered Resume Builder

A full-featured resume building application with AI-powered analysis, ATS optimization, and job application tracking. Build professional resumes that pass applicant tracking systems.

## Features

- **AI Resume Analysis**: Get instant feedback on your resume with ATS scoring
- **Master Profile Architecture**: Store all your experience once, use it everywhere
- **JD Tailoring**: Automatically tailor your resume to match job descriptions
- **Multiple Templates**: ATS-compliant professional templates
- **Job Tracker**: Kanban-style application tracking (Saved, Applied, Interview, Rejected, Ghosted)
- **Cover Letter Generation**: AI-powered cover letter creation
- **PDF Export**: Export resumes in PDF format
- **Skills Suggestions**: Curated skill recommendations by category
- **User Authentication**: Sign up/login with email or Google OAuth
- **Cloud Sync**: All data synced across devices via Supabase

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **PDF Generation**: expo-print + expo-sharing
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI Integration**: Google Gemini API

## Project Structure

```
ProResume/
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/              # App screens
│   │   ├── HomeScreen.tsx    # Dashboard with AI score
│   │   ├── TemplatesScreen.tsx
│   │   ├── JobTrackerScreen.tsx
│   │   ├── ProfileScreen.tsx # Master Profile management
│   │   ├── ResumeFormScreen.tsx
│   │   └── AuthScreen.tsx    # Login/signup
│   ├── store/
│   │   └── resumeStore.ts    # Zustand state management
│   ├── services/
│   │   ├── gemini.ts         # Gemini AI service
│   │   └── supabase.ts       # Supabase client
│   ├── utils/
│   │   └── helpers.ts        # Formatters, validators
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── data/
│       ├── templates.ts      # Resume templates
│       └── suggestedSkills.ts
├── App.tsx                    # App entry point
├── app.json                   # Expo configuration
└── package.json               # Dependencies
```

---

## Developer Setup Guide

### Prerequisites

Install these on your computer:

1. **Node.js 18+**: https://nodejs.org
   ```bash
   node --version  # Should show v18.x or higher
   ```

2. **npm or yarn**: Comes with Node.js

3. **Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```

4. **Git**: For version control

### For Android Development

1. **Android Studio**: https://developer.android.com/studio
   - During install, check "Android SDK"
   - Open Android Studio > SDK Manager > SDK Platforms > Check "Android 14"

2. **Java Development Kit (JDK) 17**:
   ```bash
   # macOS
   brew install openjdk@17
   # Add to ~/.zshrc: export JAVA_HOME=$(brew --prefix)/opt/openjdk@17
   
   # Windows: Download from https://adoptium.net/
   ```

### For iOS Development (macOS only)

1. **Xcode**: From Mac App Store
2. **Command Line Tools**: 
   ```bash
   xcode-select --install
   ```

---

## How to Run the App

### Option 1: Expo Go (Fastest - Recommended for Development)

1. Install **Expo Go** app on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Clone and run:
   ```bash
   cd ProResume
   npm install
   npx expo start
   ```

3. Scan QR code with Expo Go app on your phone

---

### Option 2: Android Emulator

1. Open Android Studio
2. Start an emulator (e.g., Pixel 5, API 34)
3. Run:
   ```bash
   cd ProResume
   npx expo start
   # Press 'a' to run on Android
   ```

---

### Option 3: Build APK (Standalone - Works Without Computer)

1. Generate native Android files:
   ```bash
   cd ProResume
   npx expo prebuild --platform android
   ```

2. Build debug APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
4. Transfer to phone and install - works completely offline!

---

### Option 4: Run on Physical Android Device via USB

1. Enable Developer Mode on phone:
   - Settings > About Phone > Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings > Developer Options > USB Debugging

3. Connect phone via USB
4. Run:
   ```bash
   npx expo run:android
   ```

---

## Backend Setup (Required for Full Features)

### 1. Create Supabase Account

Go to https://supabase.com and create a free account.

### 2. Get API Credentials

1. Create new project in Supabase
2. Go to Settings > API
3. Copy **Project URL** and **anon public key**

### 3. Set Up Environment Variables

Create a `.env` file in the ProResume root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### 4. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create new API key
3. Copy key to `.env` file

### 5. Set Up Database

In Supabase Dashboard > SQL Editor, run:

```sql
-- User master profiles table
CREATE TABLE public.master_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  personal_info JSONB DEFAULT '{}',
  all_experiences JSONB DEFAULT '[]',
  all_education JSONB DEFAULT '[]',
  all_skills JSONB DEFAULT '[]',
  all_projects JSONB DEFAULT '[]',
  all_certifications JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User resumes table
CREATE TABLE public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  template_id TEXT DEFAULT 'modern',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications table
CREATE TABLE public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT CHECK (status IN ('saved', 'applied', 'interview', 'rejected', 'ghosted')) DEFAULT 'saved',
  job_description TEXT,
  resume_id UUID REFERENCES public.resumes(id),
  cover_letter TEXT,
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.master_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users manage own profile" ON public.master_profiles 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own resumes" ON public.resumes 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own applications" ON public.job_applications 
  FOR ALL USING (auth.uid() = user_id);
```

---

## Key Features Explained

### Master Profile
Instead of retyping your experience for every resume, store it once in your Master Profile. The app automatically pulls relevant data when creating new resumes.

### ATS Optimization
The app analyzes your resume against common ATS (Applicant Tracking System) criteria and provides suggestions to improve your chances of passing automated screenings.

### JD Tailoring
Paste a job description, and the AI will help you tailor your resume to highlight the most relevant skills and experience for that specific role.

### Job Tracker
Track all your job applications in a Kanban-style board:
- Saved (found interesting jobs)
- Applied (submitted resume)
- Interview (got interview)
- Rejected (got rejected)
- Ghosted (no response)

---

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit
```

### Build Errors
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
```

### Port Issues
```bash
# Kill process on port 8081
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| expo | React Native framework |
| zustand | State management |
| @react-navigation/native | Navigation |
| @shopify/flash-list | High-performance list |
| expo-print | PDF generation |
| @supabase/supabase-js | Backend + Auth |
| @expo/vector-icons | Icons |

---

## License

MIT License
