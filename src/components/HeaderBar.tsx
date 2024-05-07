import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';

interface HeaderBarProps {
  navigation?: any;
  title?: string;
  backButton?: any;
  themeColor: any;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  navigation,
  title,
  backButton,
  themeColor,
}) => {
  return (
    <View style={styles.HeaderContainer}>
      {backButton ? (
        <TouchableOpacity onPress={backButton}>
          <GradientBGIcon
            name="left"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <Text style={[styles.HeaderText, {color: themeColor.secondaryText}]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    paddingHorizontal: SPACING.space_20,
    paddingBottom: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
  },
});

export default HeaderBar;
