import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

interface EmptyListAnimationProps {
  title: string;
}

const EmptyListAnimation: React.FC<EmptyListAnimationProps> = ({title}) => {
  return (
    <View style={styles.EmptyCartContainer}>
      <Text style={styles.LottieText}>{title}</Text>
      <LottieView
        style={styles.LottieStyle}
        source={require('../lottie/directionicon.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  EmptyCartContainer: {
    flex: 1,
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    //alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.1,
  },
  LottieStyle: {
    height: 500,
  },
  LottieText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryOrangeHex,
    textAlign: 'center',
  },
});

export default EmptyListAnimation;
