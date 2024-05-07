import {
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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
  const themeColor = useOfflineStore((state: any) => state.themeColor);

  // Data
  const themeMode = Settings.themeMode;
  const language = Settings.language;
  const themeModeData = [
    {label: 'Automatic', value: ''},
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
  ];

  const languageData = [
    {label: 'English', value: 'en'},
    {label: 'Swedish', value: 'sv'},
    {label: 'Russian', value: 'ru'},
  ];

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>
      {/* App Header */}
      <HeaderBar title="Settings" themeColor={themeColor} />

      <View
        style={[
          styles.InputContainerComponent,
          {backgroundColor: themeColor.priamryDarkBg},
        ]}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather
              name="sunrise"
              size={16}
              color={themeColor.secondaryText}
            />
          </View>
          <Text style={{color: themeColor.secondaryText}}>Theme Mode</Text>
        </View>
        <RNPickerSelect
          items={themeModeData}
          onValueChange={value => {
            updateSettings({themeMode: value, language: language});
          }}
          value={themeMode}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: themeColor.secondaryText,
            },
            inputAndroid: {
              ...pickerSelectStyles.inputAndroid,
              color: themeColor.secondaryText,
            },
          }}
          placeholder={{}}
          Icon={() => {
            return (
              <Feather
                name="chevron-right"
                size={20}
                color={themeColor.secondaryText}
                style={styles.pickerIcon}
              />
            );
          }}
        />
      </View>

      <View
        style={[
          styles.InputContainerComponent,
          {backgroundColor: themeColor.priamryDarkBg},
        ]}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather name="globe" size={16} color={themeColor.secondaryText} />
          </View>
          <Text style={{color: themeColor.secondaryText}}>Language</Text>
        </View>
        <RNPickerSelect
          items={languageData}
          onValueChange={value => {
            updateSettings({themeMode: themeMode, language: value});
          }}
          value={language}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: themeColor.secondaryText,
            },
            inputAndroid: {
              ...pickerSelectStyles.inputAndroid,
              color: themeColor.secondaryText,
            },
          }}
          placeholder={{}}
          Icon={() => {
            return (
              <Feather
                name="chevron-right"
                size={20}
                color={themeColor.secondaryText}
                style={styles.pickerIcon}
              />
            );
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.InputContainerComponent,
          {backgroundColor: themeColor.priamryDarkBg},
        ]}
        onPress={() => {
          Linking.openURL('https://google.com');
        }}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather name="info" size={16} color={themeColor.secondaryText} />
          </View>
          <Text style={{color: themeColor.secondaryText}}>About</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_20,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SPACING.space_20 * 2.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: SPACING.space_20,
  },
  inputAndroid: {
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    marginHorizontal: SPACING.space_20,
  },
});
