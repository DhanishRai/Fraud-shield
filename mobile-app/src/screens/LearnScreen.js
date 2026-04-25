import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { lessons } from '../data/lessons';
import LessonCard from '../components/LessonCard';

const { width } = Dimensions.get('window');

const LearnScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {lessons.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1E293B" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <BookOpen color="#0066FF" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Learn Safety</Text>
        </View>
        <View style={{ width: 24 }} /> {/* Spacer for centering */}
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Micro Lessons ({currentIndex + 1}/{lessons.length})</Text>
        <Text style={styles.description}>
          Swipe to learn how to identify and prevent common frauds.
        </Text>

        <View style={styles.listContainer}>
          <FlatList
            ref={flatListRef}
            data={lessons}
            renderItem={({ item }) => <LessonCard lesson={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            contentContainerStyle={styles.flatListContent}
            snapToAlignment="center"
            decelerationRate="fast"
          />
        </View>

        {renderPagination()}
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
    height: 500, // Adjusted to fit the LessonCard
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0066FF',
    width: 16,
  },
  inactiveDot: {
    backgroundColor: '#CBD5E1',
  },
});

export default LearnScreen;
