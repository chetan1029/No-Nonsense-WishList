import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';

interface HeaderBarProps {
  navigation?: any;
  title?: string;
  backButton?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  navigation,
  title,
  backButton,
}) => {
  return (
    <View style={styles.HeaderContainer}>
      {backButton ? (
        <TouchableOpacity
          onPress={() => {
            //navigation.pop();
            navigation.goBack();
          }}>
          <GradientBGIcon
            name="left"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <Text style={styles.HeaderText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    paddingHorizontal: SPACING.space_20,
    paddingTop: SPACING.space_40,
    paddingBottom: SPACING.space_24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
});

export default HeaderBar;
