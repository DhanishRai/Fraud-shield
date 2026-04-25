import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { translations } from '../data/translations';
import LessonCarousel from '../components/LessonCarousel';
import LanguageSelector from '../components/LanguageSelector';
import SettingToggle from '../components/SettingToggle';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

const LearnScreen = ({ route, navigation }) => {
  const { language } = useSettings();
  const t = translations[language] || translations['English'];
  
  const initialIndex = route.params?.initialLessonIndex || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1E293B" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <BookOpen color="#0066FF" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>{t.learnSafety}</Text>
        </View>
        <LanguageSelector />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
        <SettingToggle 
          label="Simple Mode" 
          description="Bigger text, simpler words."
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>{t.microLessons} ({currentIndex + 1}/{t.lessons.length})</Text>
        <Text style={styles.description}>
          {t.swipeToLearn}
        </Text>

        <View style={styles.listContainer}>
          <LessonCarousel 
            lessons={t.lessons} 
            t={t} 
            onIndexChange={setCurrentIndex} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    paddingTop: 30,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0066FF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  listContainer: {
    flex: 1, // Adjusted to fit the LessonCard dynamically
  },
});

export default LearnScreen;
