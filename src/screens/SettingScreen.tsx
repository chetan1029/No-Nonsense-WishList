import {
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather';

// Components
import HeaderBar from '../components/HeaderBar';
import {useOfflineStore} from '../store/offline-store';

const WishListScreen = ({route, navigation}: any) => {
  // Store
  const Settings = useOfflineStore((state: any) => state.Settings);
  const updateSettings = useOfflineStore((state: any) => state.updateSettings);

  // Data
  const themeMode = Settings.themeMode;
  const language = Settings.language;
  const themeModeData = [
    {label: 'Automatic', value: 'Automatic'},
    {label: 'Light', value: 'Light'},
    {label: 'Dark', value: 'Dark'},
  ];

  const languageData = [
    {label: 'English', value: 'English'},
    {label: 'Swedish', value: 'Swedish'},
    {label: 'Russian', value: 'Russian'},
  ];

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>
      {/* App Header */}
      <HeaderBar title="Settings" />

      <View style={styles.InputContainerComponent}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather name="sunrise" size={16} color={COLORS.primaryWhiteHex} />
          </View>
          <Text style={styles.label}>Theme Mode</Text>
        </View>
        <RNPickerSelect
          items={themeModeData}
          onValueChange={value => {
            updateSettings({themeMode: value, language: language});
          }}
          value={themeMode}
          style={pickerSelectStyles}
          placeholder={{}}
          Icon={() => {
            return (
              <Feather
                name="chevron-right"
                size={20}
                color={COLORS.primaryWhiteHex}
                style={styles.pickerIcon}
              />
            );
          }}
        />
      </View>

      <View style={styles.InputContainerComponent}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather name="globe" size={16} color={COLORS.primaryWhiteHex} />
          </View>
          <Text style={styles.label}>Language</Text>
        </View>
        <RNPickerSelect
          items={languageData}
          onValueChange={value => {
            updateSettings({themeMode: themeMode, language: value});
          }}
          value={language}
          style={pickerSelectStyles}
          placeholder={{}}
          Icon={() => {
            return (
              <Feather
                name="chevron-right"
                size={20}
                color={COLORS.primaryWhiteHex}
                style={styles.pickerIcon}
              />
            );
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.InputContainerComponent}
        onPress={() => {
          Linking.openURL('https://google.com');
        }}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather name="info" size={16} color={COLORS.primaryWhiteHex} />
          </View>
          <Text style={styles.label}>About</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryDarkGreyHex,
    paddingHorizontal: SPACING.space_20,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SPACING.space_20 * 2.5,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_20,
    paddingBottom: SPACING.space_20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Overlay: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackRGBA,
  },
  label: {
    color: COLORS.primaryWhiteHex,
  },
  pickerIcon: {
    marginVertical: SPACING.space_15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    marginRight: SPACING.space_15,
    paddingVertical: SPACING.space_15,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginHorizontal: SPACING.space_20,
  },
  inputAndroid: {
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginHorizontal: SPACING.space_20,
  },
});
