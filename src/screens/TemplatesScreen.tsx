import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { templates } from '../data/templates';
import { useResumeStore } from '../store/resumeStore';

interface TemplatesScreenProps {
  navigation: any;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ navigation }) => {
  const { selectedTemplate, setTemplate } = useResumeStore();

  const renderTemplate = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.templateCard, selectedTemplate?.id === item.id && styles.templateCardSelected]}
      onPress={() => setTemplate(item)}
    >
      <View style={styles.templatePreview}>
        <Text style={styles.templateEmoji}>
          {item.id === 'modern' ? '📊' : item.id === 'classic' ? '📜' : item.id === 'creative' ? '🎨' : item.id === 'minimal' ? '⬜' : item.id === 'executive' ? '👔' : '💻'}
        </Text>
      </View>
      <Text style={styles.templateName}>{item.name}</Text>
      <Text style={styles.templateDesc}>{item.description}</Text>
      {selectedTemplate?.id === item.id && <View style={styles.selectedBadge}><Text style={styles.selectedText}>✓ Selected</Text></View>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Templates</Text>
      <Text style={styles.subtitle}>Choose ATS-compliant templates</Text>
      <FlatList data={templates} renderItem={renderTemplate} keyExtractor={item => item.id} numColumns={2} contentContainerStyle={styles.listContent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#4A90E2', paddingHorizontal: 16, paddingVertical: 12 },
  subtitle: { fontSize: 14, color: '#666666', paddingHorizontal: 16, marginBottom: 16 },
  listContent: { padding: 16 },
  templateCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, margin: 4, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  templateCardSelected: { borderColor: '#4A90E2', backgroundColor: '#E8F0FE' },
  templatePreview: { width: 80, height: 100, backgroundColor: '#F5F7FA', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  templateEmoji: { fontSize: 40 },
  templateName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  templateDesc: { fontSize: 11, color: '#666666', textAlign: 'center', marginTop: 4 },
  selectedBadge: { backgroundColor: '#4A90E2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  selectedText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});

export default TemplatesScreen;
