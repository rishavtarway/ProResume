import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { useResumeStore } from '../store/resumeStore';
import { suggestedSkills } from '../data/templates';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { masterProfile, updateMasterProfile, addToMasterProfile, removeFromMasterProfile, initMasterProfile } = useResumeStore();
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [newSkill, setNewSkill] = useState('');

  React.useEffect(() => {
    if (!masterProfile) initMasterProfile();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addToMasterProfile('skills', { name: newSkill.trim() });
      setNewSkill('');
    }
  };

  const renderSkillChip = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.skillChip} onPress={() => removeFromMasterProfile('skills', item)}>
      <Text style={styles.skillChipText}>{item} ×</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Master Profile</Text>
      <Text style={styles.subtitle}>Your comprehensive career repository</Text>

      <View style={styles.sectionTabs}>
        <TouchableOpacity style={[styles.sectionTab, activeSection === 'personal' && styles.sectionTabActive]} onPress={() => setActiveSection('personal')}>
          <Text style={[styles.sectionTabText, activeSection === 'personal' && styles.sectionTabTextActive]}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sectionTab, activeSection === 'experience' && styles.sectionTabActive]} onPress={() => setActiveSection('experience')}>
          <Text style={[styles.sectionTabText, activeSection === 'experience' && styles.sectionTabTextActive]}>Experience</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sectionTab, activeSection === 'education' && styles.sectionTabActive]} onPress={() => setActiveSection('education')}>
          <Text style={[styles.sectionTabText, activeSection === 'education' && styles.sectionTabTextActive]}>Education</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sectionTab, activeSection === 'skills' && styles.sectionTabActive]} onPress={() => setActiveSection('skills')}>
          <Text style={[styles.sectionTabText, activeSection === 'skills' && styles.sectionTabTextActive]}>Skills</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeSection === 'personal' && (
          <View style={styles.formSection}>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" value={masterProfile?.personalInfo?.fullName || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, fullName: text } })} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={masterProfile?.personalInfo?.email || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, email: text } })} />
            <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#999" value={masterProfile?.personalInfo?.phone || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, phone: text } })} />
            <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#999" value={masterProfile?.personalInfo?.location || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, location: text } })} />
            <TextInput style={styles.input} placeholder="LinkedIn URL" placeholderTextColor="#999" value={masterProfile?.personalInfo?.linkedin || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, linkedin: text } })} />
            <TextInput style={styles.input} placeholder="Portfolio URL" placeholderTextColor="#999" value={masterProfile?.personalInfo?.portfolio || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, portfolio: text } })} />
            <TextInput style={styles.input} placeholder="Current Job Title" placeholderTextColor="#999" value={masterProfile?.personalInfo?.jobTitle || ''} onChangeText={text => updateMasterProfile({ personalInfo: { ...masterProfile?.personalInfo!, jobTitle: text } })} />
          </View>
        )}

        {activeSection === 'skills' && (
          <View style={styles.skillsSection}>
            <View style={styles.addSkillRow}>
              <TextInput style={styles.skillInput} placeholder="Add a skill..." placeholderTextColor="#999" value={newSkill} onChangeText={setNewSkill} />
              <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}><Text style={styles.addSkillButtonText}>Add</Text></TouchableOpacity>
            </View>
            <FlatList data={masterProfile?.allSkills || []} renderItem={renderSkillChip} keyExtractor={(item, i) => i.toString()} horizontal scrollEnabled={false} />
            <Text style={styles.suggestedTitle}>Suggested Skills</Text>
            <View style={styles.suggestedSkills}>
              {suggestedSkills.slice(0, 15).map(skill => (
                <TouchableOpacity key={skill} style={styles.suggestedChip} onPress={() => addToMasterProfile('skills', { name: skill })}>
                  <Text style={styles.suggestedChipText}>+ {skill}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeSection === 'experience' && (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No experiences added yet</Text>
            <TouchableOpacity style={styles.addItemButton}><Text style={styles.addItemButtonText}>+ Add Experience</Text></TouchableOpacity>
          </View>
        )}

        {activeSection === 'education' && (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No education added yet</Text>
            <TouchableOpacity style={styles.addItemButton}><Text style={styles.addItemButtonText}>+ Add Education</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#4A90E2', paddingHorizontal: 16, paddingVertical: 12 },
  subtitle: { fontSize: 14, color: '#666666', paddingHorizontal: 16, marginBottom: 16 },
  sectionTabs: { flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 12, padding: 4 },
  sectionTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  sectionTabActive: { backgroundColor: '#4A90E2' },
  sectionTabText: { fontSize: 13, fontWeight: '600', color: '#666666' },
  sectionTabTextActive: { color: '#FFFFFF' },
  content: { flex: 1, padding: 16 },
  formSection: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12 },
  input: { backgroundColor: '#F5F7FA', padding: 14, borderRadius: 8, fontSize: 16, color: '#1A1A2E', marginBottom: 12 },
  skillsSection: {},
  addSkillRow: { flexDirection: 'row', marginBottom: 16 },
  skillInput: { flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, fontSize: 16, color: '#1A1A2E', marginRight: 8 },
  addSkillButton: { backgroundColor: '#4A90E2', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  addSkillButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  skillChip: { backgroundColor: '#E8F0FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  skillChipText: { color: '#4A90E2', fontSize: 14, fontWeight: '600' },
  suggestedTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginTop: 16, marginBottom: 12 },
  suggestedSkills: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestedChip: { backgroundColor: '#F5F7FA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  suggestedChipText: { color: '#666666', fontSize: 13 },
  emptySection: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#666666', marginBottom: 12 },
  addItemButton: { backgroundColor: '#4A90E2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  addItemButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

export default ProfileScreen;
