import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';
import LessonCard from './LessonCard';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40;
const ITEM_SPACING = 20;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;

const LessonCarousel = ({ lessons, t, onIndexChange }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      if (onIndexChange) {
        onIndexChange(newIndex);
      }
    }
  }).current;

  const renderItem = ({ item, index }) => {
    // Calculate interpolation for this specific item based on scroll position
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.itemContainer, { transform: [{ scale }], opacity }]}>
        <LessonCard lesson={item} t={t} />
      </Animated.View>
    );
  };

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
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="center"
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={styles.flatListContent}
          renderItem={renderItem}
        />
      </View>
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  carouselContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: ITEM_SPACING / 2, // Centers the first and last item
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    flex: 1,
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

export default LessonCarousel;
