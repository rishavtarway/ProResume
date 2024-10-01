import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useResumeStore } from '../store/resumeStore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface ResumeFormScreenProps {
  navigation: any;
}

export const ResumeFormScreen: React.FC<ResumeFormScreenProps> = ({ navigation }) => {
  const { currentResume, updatePersonalInfo, updateSummary, addExperience, removeExperience, addSkill, removeSkill, saveResume, selectedTemplate } = useResumeStore();
  const [activeSection, setActiveSection] = useState<'personal' | 'summary' | 'experience' | 'skills'>('personal');
  const [newExperience, setNewExperience] = useState({ company: '', position: '', description: '' });
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    saveResume();
    Alert.alert('Saved', 'Resume saved successfully');
  };

  const handleExportPDF = async () => {
    if (!currentResume) return;
    const html = generateHTMLResume(currentResume, selectedTemplate?.id);
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to export PDF');
    }
  };

  const generateHTMLResume = (resume: any, templateId: string) => {
    const styles = templateId === 'modern' ? modernStyles : templateId === 'creative' ? creativeStyles : classicStyles;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${styles}</style>
        </head>
        <body>
          <div class="resume">
            <h1>${resume.personalInfo?.fullName || 'Your Name'}</h1>
            <p class="title">${resume.personalInfo?.jobTitle || ''}</p>
            <div class="contact">${resume.personalInfo?.email} | ${resume.personalInfo?.phone} | ${resume.personalInfo?.location}</div>
            ${resume.summary ? `<div class="section"><h2>Summary</h2><p>${resume.summary}</p></div>` : ''}
            ${resume.experience?.length ? `<div class="section"><h2>Experience</h2>${resume.experience.map((exp: any) => `<div class="item"><h3>${exp.position}</h3><p class="company">${exp.company}</p><p>${exp.description}</p></div>`).join('')}</div>` : ''}
            ${resume.skills?.length ? `<div class="section"><h2>Skills</h2><p>${resume.skills.join(', ')}</p></div>` : ''}
          </div>
        </body>
      </html>
    `;
  };

  const modernStyles = `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #1A1A2E; }
    .resume { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; color: #4A90E2; margin-bottom: 4px; }
    .title { font-size: 18px; color: #666; margin-bottom: 8px; }
    .contact { font-size: 12px; color: #999; margin-bottom: 20px; }
    .section { margin-top: 20px; }
    h2 { font-size: 16px; color: #1A1A2E; border-bottom: 2px solid #4A90E2; padding-bottom: 8px; }
    .item { margin: 12px 0; }
    .company { color: #666; font-size: 14px; }
  `;

  const classicStyles = `
    body { font-family: 'Times New Roman', serif; margin: 40px; color: #000; }
    .resume { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; text-align: center; text-transform: uppercase; }
    .title { text-align: center; margin-bottom: 16px; }
    .contact { text-align: center; font-size: 12px; margin-bottom: 20px; }
    .section { margin-top: 20px; }
    h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #000; }
  `;

  const creativeStyles = `
    body { font-family: sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; }
    .resume { max-width: 800px; margin: 0 auto; background: #fff; color: #333; padding: 30px; border-radius: 20px; }
    h1 { font-size: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    h2 { color: #667eea; }
  `;

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
        {['personal', 'summary', 'experience', 'skills'].map(section => (
          <TouchableOpacity key={section} style={[styles.sectionTab, activeSection === section && styles.sectionTabActive]} onPress={() => setActiveSection(section as any)}>
            <Text style={[styles.sectionTabText, activeSection === section && styles.sectionTabTextActive]}>{section.charAt(0).toUpperCase() + section.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeSection === 'personal' && (
          <View style={styles.formSection}>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" value={currentResume.personalInfo.fullName} onChangeText={text => updatePersonalInfo({ fullName: text })} />
            <TextInput style={styles.input} placeholder="Job Title" placeholderTextColor="#999" value={currentResume.personalInfo.jobTitle} onChangeText={text => updatePersonalInfo({ jobTitle: text })} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={currentResume.personalInfo.email} onChangeText={text => updatePersonalInfo({ email: text })} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#999" value={currentResume.personalInfo.phone} onChangeText={text => updatePersonalInfo({ phone: text })} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#999" value={currentResume.personalInfo.location} onChangeText={text => updatePersonalInfo({ location: text })} />
            <TextInput style={styles.input} placeholder="LinkedIn URL" placeholderTextColor="#999" value={currentResume.personalInfo.linkedin} onChangeText={text => updatePersonalInfo({ linkedin: text })} />
            <TextInput style={styles.input} placeholder="Portfolio URL" placeholderTextColor="#999" value={currentResume.personalInfo.portfolio} onChangeText={text => updatePersonalInfo({ portfolio: text })} />
          </View>
        )}

        {activeSection === 'summary' && (
          <View style={styles.formSection}>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Professional Summary..." placeholderTextColor="#999" value={currentResume.summary} onChangeText={updateSummary} multiline numberOfLines={6} />
          </View>
        )}

        {activeSection === 'experience' && (
          <View style={styles.formSection}>
            <FlatList data={currentResume.experience} keyExtractor={item => item.id} scrollEnabled={false} renderItem={({ item }) => (
              <View style={styles.experienceItem}>
                <Text style={styles.experienceTitle}>{item.position}</Text>
                <Text style={styles.experienceCompany}>{item.company}</Text>
                <Text style={styles.experienceDesc}>{item.description}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeExperience(item.id)}><Text style={styles.removeButtonText}>Remove</Text></TouchableOpacity>
              </View>
            )} />
            <View style={styles.addExperienceForm}>
              <TextInput style={styles.input} placeholder="Company" placeholderTextColor="#999" value={newExperience.company} onChangeText={text => setNewExperience({ ...newExperience, company: text })} />
              <TextInput style={styles.input} placeholder="Position" placeholderTextColor="#999" value={newExperience.position} onChangeText={text => setNewExperience({ ...newExperience, position: text })} />
              <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor="#999" value={newExperience.description} onChangeText={text => setNewExperience({ ...newExperience, description: text })} multiline numberOfLines={3} />
              <TouchableOpacity style={styles.addButton} onPress={() => { addExperience({ ...newExperience, startDate: '', endDate: '', isCurrent: false }); setNewExperience({ company: '', position: '', description: '' }); }}><Text style={styles.addButtonText}>+ Add Experience</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {activeSection === 'skills' && (
          <View style={styles.formSection}>
            <View style={styles.skillsContainer}>
              {currentResume.skills.map(skill => (
                <TouchableOpacity key={skill} style={styles.skillChip} onPress={() => removeSkill(skill)}><Text style={styles.skillChipText}>{skill} ×</Text></TouchableOpacity>
              ))}
            </View>
            <View style={styles.addSkillRow}>
              <TextInput style={styles.skillInput} placeholder="Add a skill..." placeholderTextColor="#999" value={newSkill} onChangeText={setNewSkill} />
              <TouchableOpacity style={styles.addSkillButton} onPress={() => { if (newSkill.trim()) { addSkill(newSkill.trim()); setNewSkill(''); } }}><Text style={styles.addSkillButtonText}>Add</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#666666', marginBottom: 16 },
  backLink: { color: '#4A90E2', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#4A90E2' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  headerActions: { flexDirection: 'row' },
  saveButton: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginRight: 8 },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  exportButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  exportButtonText: { color: '#4A90E2', fontSize: 14, fontWeight: '600' },
  sectionTabs: { flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 8, borderRadius: 12, padding: 4 },
  sectionTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  sectionTabActive: { backgroundColor: '#4A90E2' },
  sectionTabText: { fontSize: 13, fontWeight: '600', color: '#666666' },
  sectionTabTextActive: { color: '#FFFFFF' },
  content: { flex: 1, padding: 16 },
  formSection: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12 },
  input: { backgroundColor: '#F5F7FA', padding: 14, borderRadius: 8, fontSize: 16, color: '#1A1A2E', marginBottom: 12 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  experienceItem: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8, marginBottom: 12 },
  experienceTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  experienceCompany: { fontSize: 14, color: '#666666', marginTop: 2 },
  experienceDesc: { fontSize: 13, color: '#999999', marginTop: 8 },
  removeButton: { marginTop: 8 },
  removeButtonText: { color: '#FF5252', fontSize: 13 },
  addExperienceForm: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#E8E8E8', paddingTop: 16 },
  addButton: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  skillChip: { backgroundColor: '#E8F0FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  skillChipText: { color: '#4A90E2', fontSize: 14, fontWeight: '600' },
  addSkillRow: { flexDirection: 'row' },
  skillInput: { flex: 1, backgroundColor: '#F5F7FA', padding: 14, borderRadius: 8, fontSize: 16, color: '#1A1A2E', marginRight: 8 },
  addSkillButton: { backgroundColor: '#4A90E2', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  addSkillButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

export default ResumeFormScreen;
