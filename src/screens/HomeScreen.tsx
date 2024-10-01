import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useResumeStore } from '../store/resumeStore';
import { getResumeCompleteness } from '../utils/helpers';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { resumes, currentResume, createNewResume, loadResume, aiAnalysis, analyzeWithAI, isAnalyzing, masterProfile } = useResumeStore();
  const [showAITooltip, setShowAITooltip] = useState(false);

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
    setTimeout(() => setShowAITooltip(false), 3000);
  };

  const renderResumeCard = ({ item }: { item: any }) => {
    const completeness = getResumeCompleteness(item);
    return (
      <TouchableOpacity style={styles.resumeCard} onPress={() => handleResumePress(item)}>
        <View style={styles.resumeHeader}>
          <View style={styles.resumeIcon}><Text style={styles.resumeIconText}>📄</Text></View>
          <View style={styles.resumeInfo}>
            <Text style={styles.resumeTitle}>{item.personalInfo?.jobTitle || 'Untitled Resume'}</Text>
            <Text style={styles.resumeName}>{item.personalInfo?.fullName || 'No name'}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${completeness}%` }]} /></View>
          <Text style={styles.progressText}>{completeness}% complete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>ProResume</Text>
        <Text style={styles.subtitle}>AI-Powered Resume Builder</Text>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
        <Text style={styles.createButtonIcon}>+</Text>
        <Text style={styles.createButtonText}>Create New Resume</Text>
      </TouchableOpacity>

      {currentResume && (
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Resume Score</Text>
          <Text style={styles.scoreValue}>{aiAnalysis?.score || getResumeCompleteness(currentResume)}/100</Text>
          {isAnalyzing ? (
            <ActivityIndicator color="#4A90E2" style={styles.analysisLoader} />
          ) : (
            <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
              <Text style={styles.analyzeButtonText}>🤖 Analyze with AI</Text>
            </TouchableOpacity>
          )}
          {showAITooltip && aiAnalysis && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipTitle}>Strengths:</Text>
              {aiAnalysis.strengths?.slice(0, 3).map((s: string, i: number) => <Text key={i} style={styles.tooltipText}>✓ {s}</Text>)}
              {aiAnalysis.improvements?.length > 0 && <><Text style={styles.tooltipTitle}>Improvements:</Text>
              {aiAnalysis.improvements?.slice(0, 2).map((s: string, i: number) => <Text key={i} style={styles.tooltipText}>⚠ {s}</Text>)}</>}
            </View>
          )}
        </View>
      )}

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Templates')}>
            <Text style={styles.actionIcon}>🎨</Text>
            <Text style={styles.actionTitle}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('JobTracker')}>
            <Text style={styles.actionIcon}>💼</Text>
            <Text style={styles.actionTitle}>Job Tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionTitle}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.jdSection}>
        <Text style={styles.sectionTitle}>Tailor for Job</Text>
        <View style={styles.jdCard}>
          <TextInput style={styles.jdInput} placeholder="Paste Job Description here..." placeholderTextColor="#999" multiline numberOfLines={4} />
          <TouchableOpacity style={styles.tailorButton} onPress={() => {}}>
            <Text style={styles.tailorButtonText}>✨ AI Tailor Resume</Text>
          </TouchableOpacity>
        </View>
      </View>

      {resumes.length > 0 && (
        <View style={styles.resumesSection}>
          <Text style={styles.sectionTitle}>Your Resumes</Text>
          <FlatList data={resumes} renderItem={renderResumeCard} keyExtractor={item => item.id} scrollEnabled={false} />
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#4A90E2' },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  createButton: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: -30, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  createButtonIcon: { fontSize: 24, fontWeight: '700', color: '#4A90E2', marginRight: 8 },
  createButtonText: { fontSize: 18, fontWeight: '700', color: '#4A90E2' },
  scoreCard: { backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 20, padding: 20, borderRadius: 16 },
  scoreLabel: { fontSize: 14, color: '#666666' },
  scoreValue: { fontSize: 48, fontWeight: '800', color: '#4A90E2', marginVertical: 8 },
  analysisLoader: { marginTop: 8 },
  analyzeButton: { backgroundColor: '#E8F0FE', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  analyzeButtonText: { fontSize: 16, fontWeight: '600', color: '#4A90E2' },
  tooltip: { marginTop: 16, padding: 12, backgroundColor: '#F5F7FA', borderRadius: 8 },
  tooltipTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginTop: 8 },
  tooltipText: { fontSize: 13, color: '#666666', marginTop: 4 },
  featuresSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { width: '31%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', textAlign: 'center' },
  jdSection: { padding: 20, paddingTop: 0 },
  jdCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12 },
  jdInput: { backgroundColor: '#F5F7FA', padding: 14, borderRadius: 8, fontSize: 14, color: '#1A1A2E', minHeight: 100, textAlignVertical: 'top' },
  tailorButton: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  tailorButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resumesSection: { padding: 20, paddingTop: 0 },
  resumeCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  resumeHeader: { flexDirection: 'row', alignItems: 'center' },
  resumeIcon: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center' },
  resumeIconText: { fontSize: 24 },
  resumeInfo: { marginLeft: 12, flex: 1 },
  resumeTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  resumeName: { fontSize: 14, color: '#666666', marginTop: 2 },
  progressContainer: { marginTop: 12 },
  progressBar: { height: 6, backgroundColor: '#E8E8E8', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4A90E2', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#666666', marginTop: 4 },
});

export default HomeScreen;
