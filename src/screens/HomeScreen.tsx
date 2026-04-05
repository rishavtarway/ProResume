import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

const TEMPLATES = [
  { id: 'modern', name: 'Modern Pro', color: '#494fdf', desc: 'Clean & minimalist' },
  { id: 'classic', name: 'Classic', color: '#191c1f', desc: 'Traditional format' },
  { id: 'creative', name: 'Creative', color: '#00a87e', desc: 'Stand out design' },
  { id: 'minimal', name: 'Minimal', color: '#8d969e', desc: 'Simple & ATS-friendly' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { resumes, currentResume, createNewResume, loadResume, aiAnalysis, analyzeWithAI, isAnalyzing, updateSummary, updatePersonalInfo, addExperience, addSkill } = useResumeStore();
  const [showAITooltip, setShowAITooltip] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
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

  const handleUploadResume = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert('Upload', 'Resume uploaded! In production, this would extract text using OCR and AI. For now, please enter your details manually.');
        createNewResume();
        navigation.navigate('ResumeForm');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
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

      const skillKeywords = ['python', 'javascript', 'react', 'node', 'typescript', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'linux', 'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'api', 'agile', 'scrum', 'jira', 'ci/cd', 'jenkins', 'terraform'];
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

      keywords.skills.slice(0, 10).forEach(skill => addSkill(skill));
      
      const summary = `Results-driven professional with expertise in ${keywords.skills.slice(0, 5).join(', ')}. Proven track record of delivering high-quality solutions. Passionate about continuous learning and professional growth.`;
      updateSummary(summary);

      setIsTailoring(false);
      Alert.alert('Success', 'Resume tailored! Check the Skills section and Summary for extracted keywords from the job description.');
      navigation.navigate('ResumeForm');
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

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadResume}>
            <View style={styles.uploadButtonInner}>
              <Text style={styles.uploadButtonIcon}>↑</Text>
              <Text style={styles.uploadButtonText}>Upload Existing Resume</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.templatesSection}>
          <Text style={styles.sectionTitle}>Resume Templates</Text>
          <Text style={styles.sectionSubtitle}>Choose a template to get started</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
            {TEMPLATES.map(template => (
              <TouchableOpacity key={template.id} style={styles.templateCard} onPress={() => navigation.navigate('Templates')}>
                <View style={[styles.templatePreview, { backgroundColor: template.color }]}>
                  <Text style={styles.templateEmoji}>{template.id === 'modern' ? 'M' : template.id === 'classic' ? 'C' : template.id === 'creative' ? 'Cr' : 'Mi'}</Text>
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDesc}>{template.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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

        <View style={styles.jdSection}>
          <Text style={styles.sectionTitle}>Tailor for Job</Text>
          <Text style={styles.sectionSubtitle}>Paste a job description to auto-extract skills and optimize your resume for ATS</Text>
          <View style={styles.jdCard}>
            <TextInput 
              ref={jdInputRef}
              style={styles.jdInput} 
              placeholder="Paste Job Description here to auto-extract keywords..." 
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
  templatesSection: { marginTop: 32, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '500', color: COLORS.dark, marginBottom: 4, letterSpacing: -0.48 },
  sectionSubtitle: { fontSize: 14, color: COLORS.midSlate, marginBottom: 16 },
  templatesScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  templateCard: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, marginRight: 12, width: 140, alignItems: 'center' },
  templatePreview: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  templateEmoji: { fontSize: 24, fontWeight: '600', color: COLORS.white },
  templateName: { fontSize: 15, fontWeight: '600', color: COLORS.dark, textAlign: 'center' },
  templateDesc: { fontSize: 12, color: COLORS.midSlate, textAlign: 'center', marginTop: 4 },
  scoreCard: { backgroundColor: COLORS.white, margin: 20, marginTop: 24, padding: 24, borderRadius: 20 },
  scoreLabel: { fontSize: 14, color: COLORS.midSlate, fontWeight: '500' },
  scoreValue: { fontSize: 56, fontWeight: '500', color: COLORS.dark, marginVertical: 8, letterSpacing: -1 },
  scoreMax: { fontSize: 24, color: COLORS.coolGray },
  analysisLoader: { marginTop: 8 },
  analyzeButton: { backgroundColor: COLORS.surface, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 9999, alignItems: 'center', marginTop: 8 },
  analyzeButtonText: { fontSize: 15, fontWeight: '500', color: COLORS.dark },
  tooltip: { marginTop: 16, padding: 16, backgroundColor: COLORS.surface, borderRadius: 12 },
  tooltipTitle: { fontSize: 14, fontWeight: '600', color: COLORS.teal, marginBottom: 8 },
  tooltipText: { fontSize: 13, color: COLORS.midSlate, marginTop: 4, lineHeight: 18 },
  jdSection: { padding: 20 },
  jdCard: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20 },
  jdInput: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, fontSize: 15, color: COLORS.dark, minHeight: 120, textAlignVertical: 'top' },
  tailorButton: { backgroundColor: COLORS.dark, padding: 16, borderRadius: 9999, alignItems: 'center', marginTop: 16 },
  tailorButtonDisabled: { opacity: 0.6 },
  tailorButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
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
