import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTSIZE, SPACING} from '../theme/theme';

interface LoadingIndicatorProps {
  title?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({title}) => {
  const [animatedTitle, setAnimatedTitle] = useState('');

  useEffect(() => {
    if (title) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < title.length) {
          setAnimatedTitle(prevTitle => prevTitle + title[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20); // Adjust the interval as needed for desired typing speed

      return () => clearInterval(interval);
    }
  }, [title]);
  return (
    <>
      <View style={styles.loadingOverlay}>{/* Overlay */}</View>
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="small" color={COLORS.primaryWhiteHex} />
        {animatedTitle && (
          <Text style={styles.ActivityIndicatorText}>{animatedTitle}</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.secondaryBlackRGBA,
    zIndex: 999, // Set zIndex to be behind the activity indicator
    borderRadius: SPACING.space_10,
  },
  activityIndicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Set zIndex higher to be above the loading overlay
  },
  ActivityIndicatorText: {
    color: COLORS.primaryWhiteHex,
    paddingVertical: SPACING.space_10,
    fontSize: FONTSIZE.size_14,
    paddingHorizontal: SPACING.space_20,
  },
});

export default LoadingIndicator;
