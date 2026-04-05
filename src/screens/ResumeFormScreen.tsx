import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useResumeStore } from '../store/resumeStore';

interface ResumeFormScreenProps {
  navigation: any;
}

export const ResumeFormScreen: React.FC<ResumeFormScreenProps> = ({ navigation }) => {
  const { currentResume, updatePersonalInfo, updateSummary, addExperience, removeExperience, addSkill, removeSkill, saveResume } = useResumeStore();
  const [activeSection, setActiveSection] = useState<'personal' | 'summary' | 'experience' | 'skills'>('personal');
  const [newExperience, setNewExperience] = useState({ company: '', position: '', description: '' });
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    saveResume();
    Alert.alert('Saved', 'Resume saved successfully');
  };

  const handleExportPDF = () => {
    Alert.alert('Export', 'PDF export available in full version');
  };

  if (!currentResume) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No resume selected</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backLink}>Go back to Home</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Resume</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}><Text style={styles.exportButtonText}>Export PDF</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionTabs}>
        {(['personal', 'summary', 'experience', 'skills'] as const).map(section => (
          <TouchableOpacity key={section} style={[styles.sectionTab, activeSection === section && styles.sectionTabActive]} onPress={() => setActiveSection(section)}>
            <Text style={[styles.sectionTabText, activeSection === section && styles.sectionTabTextActive]}>{section.charAt(0).toUpperCase() + section.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeSection === 'personal' && (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#8d969e" value={currentResume.personalInfo.fullName} onChangeText={text => updatePersonalInfo({ fullName: text })} />
            
            <Text style={styles.inputLabel}>Job Title</Text>
            <TextInput style={styles.input} placeholder="e.g. Senior Developer" placeholderTextColor="#8d969e" value={currentResume.personalInfo.jobTitle} onChangeText={text => updatePersonalInfo({ jobTitle: text })} />
            
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.input} placeholder="your.email@example.com" placeholderTextColor="#8d969e" value={currentResume.personalInfo.email} onChangeText={text => updatePersonalInfo({ email: text })} keyboardType="email-address" autoCapitalize="none" />
            
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput style={styles.input} placeholder="+1 (555) 000-0000" placeholderTextColor="#8d969e" value={currentResume.personalInfo.phone} onChangeText={text => updatePersonalInfo({ phone: text })} keyboardType="phone-pad" />
            
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput style={styles.input} placeholder="City, Country" placeholderTextColor="#8d969e" value={currentResume.personalInfo.location} onChangeText={text => updatePersonalInfo({ location: text })} />
            
            <Text style={styles.inputLabel}>LinkedIn URL</Text>
            <TextInput style={styles.input} placeholder="linkedin.com/in/yourprofile" placeholderTextColor="#8d969e" value={currentResume.personalInfo.linkedin} onChangeText={text => updatePersonalInfo({ linkedin: text })} autoCapitalize="none" />
            
            <Text style={styles.inputLabel}>Portfolio URL</Text>
            <TextInput style={styles.input} placeholder="yourportfolio.com" placeholderTextColor="#8d969e" value={currentResume.personalInfo.portfolio} onChangeText={text => updatePersonalInfo({ portfolio: text })} autoCapitalize="none" />
          </View>
        )}

        {activeSection === 'summary' && (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Professional Summary</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Write a brief summary of your professional background and career goals..." placeholderTextColor="#8d969e" value={currentResume.summary} onChangeText={updateSummary} multiline numberOfLines={8} textAlignVertical="top" />
          </View>
        )}

        {activeSection === 'experience' && (
          <View style={styles.formSection}>
            {(currentResume.experience as any[])?.length > 0 && (
              <>
                <Text style={styles.sectionSubtitle}>Your Experience</Text>
                {(currentResume.experience as any[]).map(item => (
                  <View key={item.id} style={styles.experienceItem}>
                    <Text style={styles.experienceTitle}>{item.position}</Text>
                    <Text style={styles.experienceCompany}>{item.company}</Text>
                    <Text style={styles.experienceDesc}>{item.description}</Text>
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeExperience(item.id)}>
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
            
            <Text style={styles.sectionSubtitle}>Add New Experience</Text>
            <TextInput style={styles.input} placeholder="Company Name" placeholderTextColor="#8d969e" value={newExperience.company} onChangeText={text => setNewExperience({ ...newExperience, company: text })} />
            <TextInput style={styles.input} placeholder="Position/Job Title" placeholderTextColor="#8d969e" value={newExperience.position} onChangeText={text => setNewExperience({ ...newExperience, position: text })} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description of your role and achievements..." placeholderTextColor="#8d969e" value={newExperience.description} onChangeText={text => setNewExperience({ ...newExperience, description: text })} multiline numberOfLines={4} textAlignVertical="top" />
            <TouchableOpacity style={styles.addButton} onPress={() => { if (newExperience.company && newExperience.position) { addExperience({ ...newExperience, startDate: '', endDate: '', isCurrent: false }); setNewExperience({ company: '', position: '', description: '' }); } }}>
              <Text style={styles.addButtonText}>+ Add Experience</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeSection === 'skills' && (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Your Skills</Text>
            <View style={styles.skillsContainer}>
              {(currentResume.skills as string[])?.map(skill => (
                <TouchableOpacity key={skill} style={styles.skillChip} onPress={() => removeSkill(skill)}>
                  <Text style={styles.skillChipText}>{skill} ×</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.addSkillRow}>
              <TextInput style={styles.skillInput} placeholder="Add a skill..." placeholderTextColor="#8d969e" value={newSkill} onChangeText={setNewSkill} />
              <TouchableOpacity style={styles.addSkillButton} onPress={() => { if (newSkill.trim()) { addSkill(newSkill.trim()); setNewSkill(''); } }}>
                <Text style={styles.addSkillButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const COLORS = {
  dark: '#191c1f',
  white: '#ffffff',
  surface: '#f4f4f4',
  blue: '#494fdf',
  teal: '#00a87e',
  danger: '#e23b4a',
  midSlate: '#505a63',
  coolGray: '#8d969e',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: COLORS.dark },
  emptyText: { fontSize: 18, color: COLORS.white, marginBottom: 16 },
  backLink: { color: COLORS.blue, fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.dark },
  headerTitle: { fontSize: 20, fontWeight: '500', color: COLORS.white },
  headerActions: { flexDirection: 'row' },
  saveButton: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 9999, marginRight: 8 },
  saveButtonText: { color: COLORS.dark, fontSize: 14, fontWeight: '500' },
  exportButton: { backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 9999 },
  exportButtonText: { color: COLORS.dark, fontSize: 14, fontWeight: '500' },
  sectionTabs: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, marginTop: 12, borderRadius: 9999, padding: 4 },
  sectionTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 9999 },
  sectionTabActive: { backgroundColor: COLORS.dark },
  sectionTabText: { fontSize: 13, fontWeight: '500', color: COLORS.midSlate },
  sectionTabTextActive: { color: COLORS.white },
  content: { flex: 1, padding: 20 },
  formSection: { backgroundColor: COLORS.white, padding: 24, borderRadius: 20 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: COLORS.dark, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, fontSize: 16, color: COLORS.dark, marginBottom: 4 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  sectionSubtitle: { fontSize: 18, fontWeight: '500', color: COLORS.dark, marginBottom: 16, marginTop: 8 },
  experienceItem: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, marginBottom: 12 },
  experienceTitle: { fontSize: 16, fontWeight: '500', color: COLORS.dark },
  experienceCompany: { fontSize: 14, color: COLORS.midSlate, marginTop: 4 },
  experienceDesc: { fontSize: 14, color: COLORS.coolGray, marginTop: 8, lineHeight: 20 },
  removeButton: { marginTop: 12 },
  removeButtonText: { color: COLORS.danger, fontSize: 14, fontWeight: '500' },
  addButton: { backgroundColor: COLORS.dark, padding: 16, borderRadius: 9999, alignItems: 'center', marginTop: 16 },
  addButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  skillChip: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999, marginRight: 8, marginBottom: 8 },
  skillChipText: { color: COLORS.dark, fontSize: 14, fontWeight: '500' },
  addSkillRow: { flexDirection: 'row', alignItems: 'center' },
  skillInput: { flex: 1, backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, fontSize: 16, color: COLORS.dark, marginRight: 12 },
  addSkillButton: { backgroundColor: COLORS.dark, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 9999 },
  addSkillButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  bottomSpacer: { height: 40 },
});

export default ResumeFormScreen;
