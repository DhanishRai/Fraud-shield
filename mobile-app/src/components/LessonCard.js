import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  MessageSquare, 
  QrCode, 
  Key, 
  Headphones, 
  Link, 
  Lock, 
  UserCheck, 
  ShieldCheck,
  AlertTriangle,
  Info,
  Star
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const IconMap = {
  MessageSquare,
  QrCode,
  Key,
  Headphones,
  Link,
  Lock,
  UserCheck,
  ShieldCheck,
};

const LessonCard = ({ lesson }) => {
  const IconComponent = IconMap[lesson.icon] || ShieldCheck;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <IconComponent color="#0066FF" size={28} />
        </View>
        <Text style={styles.title}>{lesson.title}</Text>
      </View>

      <Text style={styles.introText}>Takes 30 seconds to learn</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AlertTriangle color="#FF3B30" size={18} />
          <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>The Problem</Text>
        </View>
        <Text style={styles.sectionBody}>{lesson.problem}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info color="#007AFF" size={18} />
          <Text style={[styles.sectionTitle, { color: '#007AFF' }]}>The Truth</Text>
        </View>
        <Text style={styles.sectionBody}>{lesson.truth}</Text>
      </View>

      <View style={[styles.section, styles.ruleSection]}>
        <View style={styles.sectionHeader}>
          <Star color="#FF9500" size={18} fill="#FF9500" />
          <Text style={[styles.sectionTitle, { color: '#FF9500' }]}>Golden Rule</Text>
        </View>
        <Text style={styles.ruleBody}>{lesson.rule}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  introText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 12,
  },
  ruleSection: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionBody: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  ruleBody: {
    fontSize: 15,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 22,
  },
});

export default LessonCard;
