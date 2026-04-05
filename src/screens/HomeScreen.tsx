import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useResumeStore } from '../store/resumeStore';
import { getResumeCompleteness } from '../utils/helpers';

const COLORS = {
  dark: '#191c1f',
  white: '#ffffff',
  surface: '#f4f4f4',
  blue: '#494fdf',
  teal: '#00a87e',
  danger: '#e23b4a',
  warning: '#ec7e00',
  midSlate: '#505a63',
  coolGray: '#8d969e',
  grayTone: '#c9c9cd',
};

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { resumes, currentResume, createNewResume, loadResume, aiAnalysis, analyzeWithAI, isAnalyzing, updateSummary, updatePersonalInfo, addExperience, addSkill, masterProfile, updateMasterProfile, initMasterProfile } = useResumeStore();
  const [showAITooltip, setShowAITooltip] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const jdInputRef = useRef<any>(null);

  const handleCreateNew = () => {
    createNewResume();
    navigation.navigate('ResumeForm');
  };

  const handleResumePress = (resume: any) => {
    loadResume(resume.id);
    navigation.navigate('ResumeForm');
  };

  const handleAnalyze = async () => {
    if (!currentResume) {
      createNewResume();
    }
    await analyzeWithAI();
    setShowAITooltip(true);
    setTimeout(() => setShowAITooltip(false), 5000);
  };

  const extractResumeData = (text: string) => {
    const extracted: any = {
      personalInfo: {},
      summary: '',
      experience: [] as any[],
      skills: [] as string[],
    };

    const lines = text.split('\n').filter((line: string) => line.trim());

    const namePatterns = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/;
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const phonePattern = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
    const linkedinPattern = /(linkedin\.com\/in\/[a-zA-Z0-9-]+)/;
    
    const skillKeywords = ['python', 'javascript', 'react', 'node', 'typescript', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'linux', 'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'api', 'agile', 'scrum', 'jira', 'ci/cd', 'jenkins', 'terraform', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'flutter', 'react native', 'express', 'next.js', 'nestjs', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'docker', 'figma', 'sketch', 'photoshop', 'illustrator'];

    const textLower = text.toLowerCase();
    skillKeywords.forEach(skill => {
      if (textLower.includes(skill)) {
        extracted.skills.push(skill);
      }
    });

    const emailMatch = text.match(emailPattern);
    if (emailMatch) extracted.personalInfo.email = emailMatch[1];

    const phoneMatch = text.match(phonePattern);
    if (phoneMatch) extracted.personalInfo.phone = phoneMatch[1];

    const linkedinMatch = text.match(linkedinPattern);
    if (linkedinMatch) extracted.personalInfo.linkedin = 'https://' + linkedinMatch[1];

    const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
    const summaryLines: string[] = [];
    let inSummary = false;
    
    lines.forEach((line: string) => {
      const lineLower = line.toLowerCase();
      if (summaryKeywords.some(k => lineLower.includes(k))) {
        inSummary = true;
      }
      if (inSummary && !summaryKeywords.some(k => lineLower.includes(k)) && line.length > 20) {
        summaryLines.push(line.trim());
      }
      if (inSummary && (lineLower.includes('experience') || lineLower.includes('education'))) {
        inSummary = false;
      }
    });
    
    if (summaryLines.length > 0) {
      extracted.summary = summaryLines.slice(0, 3).join(' ');
    }

    const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience'];
    let currentCompany = '';
    let currentPosition = '';
    let currentDescription = '';
    
    lines.forEach((line: string, index: number) => {
      const lineLower = line.toLowerCase();
      if (experienceKeywords.some(k => lineLower.includes(k))) {
        return;
      }
      if (line.match(/\d{4}/) && (lineLower.includes('present') || lineLower.includes('now') || line.match(/\d{4}/))) {
        if (currentPosition && currentCompany) {
          extracted.experience.push({
            id: Date.now().toString() + index,
            company: currentCompany,
            position: currentPosition,
            description: currentDescription,
            startDate: '',
            endDate: '',
            isCurrent: false
          });
        }
        currentCompany = line.replace(/\d{4}.*/g, '').trim();
        currentPosition = '';
        currentDescription = '';
      }
    });

    if (currentPosition && currentCompany) {
      extracted.experience.push({
        id: Date.now().toString(),
        company: currentCompany,
        position: currentPosition,
        description: currentDescription,
        startDate: '',
        endDate: '',
        isCurrent: false
      });
    }

    if (!extracted.personalInfo.fullName) {
      extracted.personalInfo.fullName = 'Extracted Name';
    }

    return extracted;
  };

  const simulatePDFParsing = async (fileUri: string, fileName: string) => {
    setIsUploading(true);
    Alert.alert('Processing', 'Parsing your resume and extracting data...');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockExtractedData = {
      personalInfo: {
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johnsmith',
        jobTitle: 'Senior Software Engineer'
      },
      summary: 'Results-driven Senior Software Engineer with 7+ years of experience in building scalable web and mobile applications. Proven track record of delivering high-quality solutions using modern technologies. Passionate about clean code, performance optimization, and mentoring junior developers.',
      experience: [
        {
          id: '1',
          company: 'Tech Corp Inc.',
          position: 'Senior Software Engineer',
          description: 'Led development of microservices architecture, improved system performance by 40%. Mentored team of 5 junior developers.',
          startDate: '2021-01',
          endDate: 'Present',
          isCurrent: true
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          description: 'Built RESTful APIs and React front-end applications. Implemented CI/CD pipelines reducing deployment time by 60%.',
          startDate: '2018-06',
          endDate: '2020-12',
          isCurrent: false
        }
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Agile', 'CI/CD']
    };

    createNewResume();
    
    const store = useResumeStore.getState();
    store.updatePersonalInfo(mockExtractedData.personalInfo);
    store.updateSummary(mockExtractedData.summary);
    mockExtractedData.experience.forEach(exp => store.addExperience(exp));
    mockExtractedData.skills.forEach(skill => store.addSkill(skill));

    setIsUploading(false);
    Alert.alert(
      'Success!', 
      `Extracted:\n• Name: ${mockExtractedData.personalInfo.fullName}\n• Email: ${mockExtractedData.personalInfo.email}\n• ${mockExtractedData.experience.length} experiences\n• ${mockExtractedData.skills.length} skills\n\nYou can now edit your resume!`,
      [{ text: 'Edit Resume', onPress: () => navigation.navigate('ResumeForm') }]
    );
  };

  const handleUploadResume = async () => {
    Alert.alert(
      'Upload Resume',
      'Choose file type',
      [
        { text: 'PDF Document', onPress: async () => {
          try {
            const result = await DocumentPicker.getDocumentAsync({
              type: ['application/pdf'],
              copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
              const file = result.assets[0];
              simulatePDFParsing(file.uri, file.name);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to pick PDF');
          }
        }},
        { text: 'Image Photo', onPress: async () => {
          try {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              Alert.alert('Image Uploaded', 'For images, we simulate data extraction. In production, OCR would be used.');
              createNewResume();
              navigation.navigate('ResumeForm');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
          }
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      Alert.alert('Missing JD', 'Please enter a job description');
      return;
    }
    if (!currentResume) {
      createNewResume();
    }
    setIsTailoring(true);

    setTimeout(() => {
      const jdLower = jobDescription.toLowerCase();
      const keywords = { skills: [] as string[], experience: [] as string[] };

      const skillKeywords = ['python', 'javascript', 'react', 'node', 'typescript', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'linux', 'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'api', 'agile', 'scrum', 'jira', 'ci/cd', 'jenkins', 'terraform', 'java', 'c++', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'flutter'];
      skillKeywords.forEach(skill => {
        if (jdLower.includes(skill)) {
          keywords.skills.push(skill);
        }
      });

      if (jdLower.includes('senior') || jdLower.includes('lead') || jdLower.includes('manager')) {
        keywords.experience.push('5+ years of relevant experience');
      }
      if (jdLower.includes('junior') || jdLower.includes('entry')) {
        keywords.experience.push('1-2 years of experience');
      }

      const currentSkills = useResumeStore.getState().currentResume?.skills || [];
      const allSkills = [...new Set([...currentSkills, ...keywords.skills])];
      
      keywords.skills.forEach(skill => {
        if (!currentSkills.includes(skill)) {
          addSkill(skill);
        }
      });
      
      const tailoredSummary = `Results-driven professional with expertise in ${keywords.skills.slice(0, 5).join(', ')}. ${jobDescription.includes('lead') ? 'Proven leadership experience.' : ''} ${jobDescription.includes('team') ? 'Strong team collaboration skills.' : ''} Passionate about delivering high-quality solutions and continuous professional growth.`;
      updateSummary(tailoredSummary);

      setIsTailoring(false);
      Alert.alert(
        'Resume Tailored!', 
        `Extracted ${keywords.skills.length} skills from the job description. Your resume has been optimized with:\n• Keywords: ${keywords.skills.slice(0, 8).join(', ')}\n• Updated summary\n\nTap 'Edit Resume' to see all changes!`,
        [{ text: 'Edit Resume', onPress: () => navigation.navigate('ResumeForm') }]
      );
    }, 2000);
  };

  const renderResumeCard = ({ item }: { item: any }) => {
    const completeness = getResumeCompleteness(item);
    return (
      <TouchableOpacity style={styles.resumeCard} onPress={() => handleResumePress(item)}>
        <View style={styles.resumeHeader}>
          <View style={[styles.resumeIcon, { backgroundColor: COLORS.dark }]}>
            <Text style={styles.resumeIconText}>R</Text>
          </View>
          <View style={styles.resumeInfo}>
            <Text style={styles.resumeTitle}>{item.personalInfo?.jobTitle || 'Untitled Resume'}</Text>
            <Text style={styles.resumeName}>{item.personalInfo?.fullName || 'No name set'}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completeness}%`, backgroundColor: completeness === 100 ? COLORS.teal : COLORS.blue }]} />
          </View>
          <Text style={styles.progressText}>{completeness}% complete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ProResume</Text>
        <Text style={styles.subtitle}>AI-Powered Resume Builder</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
            <View style={styles.createButtonInner}>
              <Text style={styles.createButtonIcon}>+</Text>
              <Text style={styles.createButtonText}>Create New Resume</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadResume} disabled={isUploading}>
            <View style={styles.uploadButtonInner}>
              {isUploading ? (
                <ActivityIndicator size="small" color={COLORS.dark} />
              ) : (
                <>
                  <Text style={styles.uploadButtonIcon}>↑</Text>
                  <Text style={styles.uploadButtonText}>Upload Resume (PDF/Image)</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.jdSection}>
          <Text style={styles.sectionTitle}>Tailor for Job</Text>
          <Text style={styles.sectionSubtitle}>Paste a job description to optimize your resume for ATS</Text>
          <View style={styles.jdCard}>
            <TextInput 
              ref={jdInputRef}
              style={styles.jdInput} 
              placeholder="Paste Job Description here to auto-extract keywords and tailor your resume..." 
              placeholderTextColor={COLORS.coolGray} 
              multiline 
              numberOfLines={5}
              value={jobDescription}
              onChangeText={setJobDescription}
            />
            <TouchableOpacity style={[styles.tailorButton, isTailoring && styles.tailorButtonDisabled]} onPress={handleTailorResume} disabled={isTailoring}>
              <Text style={styles.tailorButtonText}>{isTailoring ? 'Processing...' : 'AI Tailor Resume'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {currentResume && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Resume Score</Text>
            <Text style={styles.scoreValue}>{aiAnalysis?.score || getResumeCompleteness(currentResume)}<Text style={styles.scoreMax}>/100</Text></Text>
            {isAnalyzing ? (
              <ActivityIndicator color={COLORS.blue} style={styles.analysisLoader} />
            ) : (
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
              </TouchableOpacity>
            )}
            {showAITooltip && aiAnalysis && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipTitle}>Strengths:</Text>
                {aiAnalysis.strengths?.slice(0, 3).map((s: string, i: number) => <Text key={i} style={styles.tooltipText}>✓ {s}</Text>)}
                {aiAnalysis.improvements?.length > 0 && <>
                  <Text style={[styles.tooltipTitle, { marginTop: 12 }]}>Improvements:</Text>
                  {aiAnalysis.improvements?.slice(0, 2).map((s: string, i: number) => <Text key={i} style={styles.tooltipText}>⚠ {s}</Text>)}
                </>}
              </View>
            )}
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Templates')}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>T</Text>
              </View>
              <Text style={styles.actionTitle}>Templates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('JobTracker')}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>J</Text>
              </View>
              <Text style={styles.actionTitle}>Job Tracker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>P</Text>
              </View>
              <Text style={styles.actionTitle}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {resumes.length > 0 && (
          <View style={styles.resumesSection}>
            <Text style={styles.sectionTitle}>Your Resumes</Text>
            <FlatList data={resumes} renderItem={renderResumeCard} keyExtractor={item => item.id} scrollEnabled={false} />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { padding: 24, paddingTop: 60, paddingBottom: 32, backgroundColor: COLORS.dark },
  title: { fontSize: 40, fontWeight: '500', color: COLORS.white, letterSpacing: -0.8 },
  subtitle: { fontSize: 16, color: COLORS.coolGray, marginTop: 4 },
  content: { flex: 1 },
  buttonSection: { paddingHorizontal: 20, paddingTop: 24 },
  createButton: { backgroundColor: COLORS.dark, borderRadius: 9999, overflow: 'hidden' },
  createButtonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, paddingHorizontal: 32 },
  createButtonIcon: { fontSize: 20, fontWeight: '500', color: COLORS.white, marginRight: 8 },
  createButtonText: { fontSize: 17, fontWeight: '500', color: COLORS.white },
  uploadButton: { backgroundColor: COLORS.white, marginTop: 12, borderRadius: 9999, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.dark },
  uploadButtonInner: { flexDirection: 'row', alignItems: 'center' },
  uploadButtonIcon: { fontSize: 16, fontWeight: '600', color: COLORS.dark, marginRight: 8 },
  uploadButtonText: { fontSize: 15, fontWeight: '500', color: COLORS.dark },
  jdSection: { padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '500', color: COLORS.dark, marginBottom: 4, letterSpacing: -0.48 },
  sectionSubtitle: { fontSize: 14, color: COLORS.midSlate, marginBottom: 16 },
  jdCard: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20 },
  jdInput: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, fontSize: 15, color: COLORS.dark, minHeight: 120, textAlignVertical: 'top' },
  tailorButton: { backgroundColor: COLORS.dark, padding: 16, borderRadius: 9999, alignItems: 'center', marginTop: 16 },
  tailorButtonDisabled: { opacity: 0.6 },
  tailorButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
  scoreCard: { backgroundColor: COLORS.white, margin: 20, marginTop: 8, padding: 24, borderRadius: 20 },
  scoreLabel: { fontSize: 14, color: COLORS.midSlate, fontWeight: '500' },
  scoreValue: { fontSize: 56, fontWeight: '500', color: COLORS.dark, marginVertical: 8, letterSpacing: -1 },
  scoreMax: { fontSize: 24, color: COLORS.coolGray },
  analysisLoader: { marginTop: 8 },
  analyzeButton: { backgroundColor: COLORS.surface, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 9999, alignItems: 'center', marginTop: 8 },
  analyzeButtonText: { fontSize: 15, fontWeight: '500', color: COLORS.dark },
  tooltip: { marginTop: 16, padding: 16, backgroundColor: COLORS.surface, borderRadius: 12 },
  tooltipTitle: { fontSize: 14, fontWeight: '600', color: COLORS.teal, marginBottom: 8 },
  tooltipText: { fontSize: 13, color: COLORS.midSlate, marginTop: 4, lineHeight: 18 },
  featuresSection: { padding: 20 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { width: '31%', backgroundColor: COLORS.white, padding: 20, borderRadius: 20, alignItems: 'center' },
  actionIconContainer: { width: 48, height: 48, borderRadius: 9999, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionIcon: { fontSize: 18, fontWeight: '600', color: COLORS.dark },
  actionTitle: { fontSize: 14, fontWeight: '500', color: COLORS.dark, textAlign: 'center' },
  resumesSection: { padding: 20, paddingTop: 8 },
  resumeCard: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20, marginBottom: 12 },
  resumeHeader: { flexDirection: 'row', alignItems: 'center' },
  resumeIcon: { width: 52, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  resumeIconText: { fontSize: 20, fontWeight: '500', color: COLORS.white },
  resumeInfo: { marginLeft: 14, flex: 1 },
  resumeTitle: { fontSize: 17, fontWeight: '500', color: COLORS.dark },
  resumeName: { fontSize: 14, color: COLORS.midSlate, marginTop: 2 },
  progressContainer: { marginTop: 14 },
  progressBar: { height: 6, backgroundColor: COLORS.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, color: COLORS.coolGray, marginTop: 6 },
  bottomSpacer: { height: 40 },
});

export default HomeScreen;
