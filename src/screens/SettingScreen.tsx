import {
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';

async function onAppleButtonPress() {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // Create a Firebase credential from the response
  const {identityToken, nonce, fullName} = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  // Sign the user in with the credential
  return auth().signInWithCredential(appleCredential);
}

// Components
import HeaderBar from '../components/HeaderBar';
import {useOfflineStore} from '../store/offline-store';

const SettingScreen = ({route, navigation}: any) => {
  // Store
  const Settings = useOfflineStore((state: any) => state.Settings);
  const updateSettings = useOfflineStore((state: any) => state.updateSettings);
  const themeColor = useOfflineStore((state: any) => state.themeColor);

  // Const
  const {t} = useTranslation();

  // Data
  const themeMode = Settings.themeMode;
  const language = Settings.language;
  const themeModeData = [
    {label: t('automaticLabel'), value: ''},
    {label: t('lightLabel'), value: 'light'},
    {label: t('darkLabel'), value: 'dark'},
  ];

  const languageData = [
    {label: 'English', value: 'en'},
    {label: 'Swedish', value: 'sv'},
    {label: 'Russian', value: 'ru'},
  ];

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>
      {/* App Header */}
      <HeaderBar title={t('settings')} themeColor={themeColor} />

      <TouchableOpacity
        style={[
          styles.InputContainerComponent,
          {backgroundColor: themeColor.priamryDarkBg},
        ]}
        onPress={() => {
          navigation.navigate('UserProfile');
        }}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Feather name="user" size={16} color={themeColor.secondaryText} />
          </View>
          <Text style={{color: themeColor.secondaryText}}>
            {t('userProfile')}
          </Text>
        </View>
      </TouchableOpacity>

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
          <Text style={{color: themeColor.secondaryText}}>
            {t('themeMode')}
          </Text>
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
          <Text style={{color: themeColor.secondaryText}}>{t('langauge')}</Text>
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
          <Text style={{color: themeColor.secondaryText}}>{t('about')}</Text>
        </View>
      </TouchableOpacity>

      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: 160,
          height: 45,
        }}
        onPress={() =>
          onAppleButtonPress().then(() =>
            console.log('Apple sign-in complete!'),
          )
        }
      />
    </View>
  );
};

export default SettingScreen;

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
    height: SPACING.space_20 * 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerIcon: {
    marginVertical: SPACING.space_20,
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
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    marginHorizontal: SPACING.space_20,
  },
  inputAndroid: {
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    marginHorizontal: SPACING.space_20,
  },
});
