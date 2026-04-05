import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useResumeStore } from '../store/resumeStore';

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

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Pro',
    description: 'Clean, minimalist design with bold typography. Perfect for tech & startup roles.',
    color: '#494fdf',
    icon: 'M',
    features: ['Clean layout', 'Bold headers', 'Skill bars', 'Timeline style'],
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    description: 'Traditional professional format. Best for corporate & management positions.',
    color: '#191c1f',
    icon: 'C',
    features: ['Traditional layout', 'Serif fonts', 'Formal tone', 'References section'],
  },
  {
    id: 'creative',
    name: 'Creative Design',
    description: 'Stand out with unique colors and modern styling. Great for design & marketing.',
    color: '#00a87e',
    icon: 'Cr',
    features: ['Accent colors', 'Icon headers', 'Portfolio section', 'Social links'],
  },
  {
    id: 'minimal',
    name: 'Minimal ATS',
    description: 'Simple, ATS-friendly format that passes through all applicant tracking systems.',
    color: '#8d969e',
    icon: 'Mi',
    features: ['Plain text', 'No graphics', 'Keyword optimized', 'Fast loading'],
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    description: 'Premium layout for senior executives. Maximum impact for C-level applications.',
    color: '#c9a227',
    icon: 'E',
    features: ['Premium design', 'Achievement focused', 'Leadership highlights', 'Board ready'],
  },
  {
    id: 'technical',
    name: 'Technical Lead',
    description: 'Developer-focused with code snippets, GitHub links and technical skills emphasis.',
    color: '#2d2d2d',
    icon: 'T',
    features: ['Tech skills grid', 'Project links', 'Certifications', 'Code samples'],
  },
];

interface TemplatesScreenProps {
  navigation: any;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ navigation }) => {
  const { selectedTemplate, setTemplate } = useResumeStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resume Templates</Text>
        <Text style={styles.subtitle}>Choose a template that best represents your professional brand</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>TAP TO PREVIEW</Text>
        
        <View style={styles.templatesGrid}>
          {TEMPLATES.map(template => (
            <TouchableOpacity 
              key={template.id}
              style={[styles.templateCard, selectedTemplate?.id === template.id && styles.templateCardSelected]}
              onPress={() => setTemplate(template)}
            >
              <View style={[styles.previewContainer, { backgroundColor: template.color }]}>
                <Text style={styles.previewIcon}>{template.icon}</Text>
                <View style={styles.previewLines}>
                  <View style={[styles.previewLine, { backgroundColor: COLORS.white, width: '80%' }]} />
                  <View style={[styles.previewLine, { backgroundColor: COLORS.white, width: '60%' }]} />
                  <View style={[styles.previewBox, { backgroundColor: COLORS.white + '40' }]} />
                  <View style={[styles.previewBox, { backgroundColor: COLORS.white + '40' }]} />
                  <View style={[styles.previewBox, { backgroundColor: COLORS.white + '40' }]} />
                  <View style={[styles.previewBox, { backgroundColor: COLORS.white + '40' }]} />
                </View>
                <View style={styles.imageOverlay}>
                  <Text style={styles.tapToView}>Tap to select</Text>
                </View>
              </View>
              
              <View style={styles.templateInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  {selectedTemplate?.id === template.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: template.color }]}>
                      <Text style={styles.selectedText}>✓ Selected</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.templateDesc}>{template.description}</Text>
                
                <View style={styles.featuresContainer}>
                  {template.features.map((feature, index) => (
                    <View key={index} style={styles.featureChip}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Template Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>Choose a template that matches your industry</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🎯</Text>
            <Text style={styles.tipText}>Keep it simple - recruiters spend 6-7 seconds scanning</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Always export as PDF to preserve formatting</Text>
          </View>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { padding: 24, paddingTop: 60, paddingBottom: 24, backgroundColor: COLORS.dark },
  title: { fontSize: 36, fontWeight: '500', color: COLORS.white, letterSpacing: -0.8 },
  subtitle: { fontSize: 15, color: COLORS.coolGray, marginTop: 8, lineHeight: 22 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.coolGray, letterSpacing: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  content: { flex: 1 },
  templatesGrid: { paddingHorizontal: 16 },
  templateCard: { backgroundColor: COLORS.white, borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  templateCardSelected: { borderColor: COLORS.blue, shadowColor: COLORS.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  previewContainer: { height: 200, padding: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  previewIcon: { fontSize: 40, fontWeight: '700', color: COLORS.white, marginBottom: 12 },
  previewLines: { width: '100%', alignItems: 'center' },
  previewLine: { height: 6, borderRadius: 3, marginBottom: 6 },
  previewBox: { width: 40, height: 24, borderRadius: 4, marginHorizontal: 4, marginTop: 8 },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, alignItems: 'center' },
  tapToView: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  templateInfo: { padding: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  templateName: { fontSize: 20, fontWeight: '600', color: COLORS.dark },
  templateDesc: { fontSize: 13, color: COLORS.midSlate, lineHeight: 18, marginBottom: 12 },
  featuresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featureChip: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 },
  featureText: { fontSize: 12, color: COLORS.midSlate, fontWeight: '500' },
  selectedBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  selectedText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  tipsSection: { margin: 20, padding: 20, backgroundColor: COLORS.dark, borderRadius: 20 },
  tipsTitle: { fontSize: 18, fontWeight: '600', color: COLORS.white, marginBottom: 16 },
  tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipIcon: { fontSize: 16, marginRight: 12 },
  tipText: { flex: 1, fontSize: 14, color: COLORS.coolGray, lineHeight: 20 },
  bottomSpacer: { height: 40 },
});

export default TemplatesScreen;
