import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import { useResumeStore } from '../store/resumeStore';
import { JobApplication } from '../types';

interface JobTrackerScreenProps {
  navigation: any;
}

export const JobTrackerScreen: React.FC<JobTrackerScreenProps> = ({ navigation }) => {
  const { jobApplications, addJobApplication, moveJobApplication, removeJobApplication, currentResume } = useResumeStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const columns: JobApplication['status'][] = ['saved', 'applied', 'interview', 'rejected', 'ghosted'];
  const columnTitles: { [key: string]: string } = { saved: 'Saved', applied: 'Applied', interview: 'Interview', rejected: 'Rejected', ghosted: 'Ghosted' };
  const columnEmojis: { [key: string]: string } = { saved: '💾', applied: '📤', interview: '🤝', rejected: '❌', ghosted: '👻' };

  const handleAddApplication = () => {
    if (!companyName || !position) {
      Alert.alert('Error', 'Please fill in company name and position');
      return;
    }
    addJobApplication({
      companyName,
      position,
      status: 'saved',
      resumeId: currentResume?.id || '',
      jobDescription,
      appliedDate: new Date().toISOString(),
    });
    setShowAddForm(false);
    setCompanyName('');
    setPosition('');
    setJobDescription('');
  };

  const renderItem = ({ item }: { item: JobApplication }) => (
    <TouchableOpacity style={styles.jobCard} onPress={() => {}} onLongPress={() => Alert.alert('Delete', 'Remove this application?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeJobApplication(item.id) }])}>
      <Text style={styles.jobCompany}>{item.companyName}</Text>
      <Text style={styles.jobPosition}>{item.position}</Text>
      <View style={styles.statusActions}>
        {columns.filter(c => c !== item.status).map(col => (
          <TouchableOpacity key={col} style={styles.moveButton} onPress={() => moveJobApplication(item.id, col)}>
            <Text style={styles.moveButtonText}>{columnEmojis[col]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Tracker</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput style={styles.input} placeholder="Company Name" placeholderTextColor="#999" value={companyName} onChangeText={setCompanyName} />
          <TextInput style={styles.input} placeholder="Position" placeholderTextColor="#999" value={position} onChangeText={setPosition} />
          <TextInput style={[styles.input, styles.jdInput]} placeholder="Job Description (optional)" placeholderTextColor="#999" value={jobDescription} onChangeText={setJobDescription} multiline numberOfLines={3} />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddApplication}>
            <Text style={styles.submitButtonText}>Add Application</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kanbanContainer}>
        {columns.map(status => (
          <View key={status} style={styles.kanbanColumn}>
            <Text style={styles.columnTitle}>{columnEmojis[status]} {columnTitles[status]}</Text>
            <FlatList data={jobApplications.filter(app => app.status === status)} renderItem={renderItem} keyExtractor={item => item.id} scrollEnabled={false} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#4A90E2' },
  addButton: { backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  addForm: { backgroundColor: '#FFFFFF', margin: 16, padding: 16, borderRadius: 12 },
  input: { backgroundColor: '#F5F7FA', padding: 14, borderRadius: 8, fontSize: 16, color: '#1A1A2E', marginBottom: 12 },
  jdInput: { minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  kanbanContainer: { flex: 1 },
  kanbanColumn: { width: 200, padding: 8 },
  columnTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, paddingHorizontal: 8 },
  jobCard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, marginBottom: 8 },
  jobCompany: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  jobPosition: { fontSize: 12, color: '#666666', marginTop: 2 },
  statusActions: { flexDirection: 'row', marginTop: 8, justifyContent: 'space-around' },
  moveButton: { padding: 4 },
  moveButtonText: { fontSize: 16 },
});

export default JobTrackerScreen;
