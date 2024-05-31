import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';
import Feather from 'react-native-vector-icons/Feather';

interface HeaderBarProps {
  navigation?: any;
  title?: string;
  backButton?: any;
  themeColor: any;
  logoutButton?: any;
  onLogoutHandle?: any;
  shareApp?: any;
  onShareApp?: any;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  navigation,
  title,
  backButton,
  themeColor,
  logoutButton,
  onLogoutHandle,
  shareApp,
  onShareApp,
}) => {
  return (
    <View style={styles.HeaderContainer}>
      {backButton ? (
        <TouchableOpacity onPress={backButton}>
          <GradientBGIcon
            name="left"
            themeColor={themeColor}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <Text style={[styles.HeaderText, {color: themeColor.secondaryText}]}>
        {title}
      </Text>
      {logoutButton ? (
        <TouchableOpacity onPress={onLogoutHandle}>
          <Feather
            name="log-out"
            size={FONTSIZE.size_24}
            color={COLORS.primaryRedHex}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {shareApp ? (
        <TouchableOpacity onPress={onShareApp}>
          <Feather
            name="send"
            size={FONTSIZE.size_24}
            color={COLORS.primaryOrangeHex}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
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
