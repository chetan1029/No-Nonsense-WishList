import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SPACING} from '../theme/theme';
import CustomIcon from './CustomIcon';

interface GradientBGIconProps {
  name: string;
  themeColor: any;
  size: number;
}

const GradientBGIcon: React.FC<GradientBGIconProps> = ({
  name,
  themeColor,
  size,
}) => {
  return (
    <View
      style={[
        styles.Container,
        {
          borderColor: themeColor.primaryBgLight,
          backgroundColor: themeColor.priamryDarkBg,
        },
      ]}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={[themeColor.primaryBgLight, themeColor.primaryBg]}
        style={styles.LinearGradientBG}>
        <CustomIcon name={name} color={themeColor.secondaryText} size={size} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 2,
    borderRadius: SPACING.space_12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  LinearGradientBG: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GradientBGIcon;
