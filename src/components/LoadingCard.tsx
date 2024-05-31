import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

const LoadingCard = () => {
  return (
    <View>
      <LottieView
        style={styles.LottieStyle}
        source={require('../lottie/loadingcards.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  LottieStyle: {
    height: 500,
  },
});

export default LoadingCard;
