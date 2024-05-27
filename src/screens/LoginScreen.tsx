import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import {onAppleButtonPress, onContinueAsGuest} from '../utils/credential';

// Components
import {useOfflineStore} from '../store/offline-store';
import {useStore} from '../store/store';
import crashlytics from '@react-native-firebase/crashlytics';

const LoginScreen = ({route, navigation}: any) => {
  // state
  const [loading, setLoading] = useState(false);

  // Store
  const Settings = useOfflineStore((state: any) => state.Settings);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const setUserDetail = useStore((state: any) => state.setUserDetail);

  // Const
  const {t} = useTranslation();

  // Data
  const themeMode = Settings.themeMode;

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  // Handle login as guest
  const handleonAppleButtonPress = async () => {
    setLoading(true);
    try {
      await onAppleButtonPress(setUserDetail).then(() =>
        console.log('Apple login complete!'),
      );
    } catch (error: any) {
      console.log('Error while login:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle login as guest
  const handleLoginAsGuest = async () => {
    setLoading(true);
    try {
      await onContinueAsGuest(setUserDetail).then(() =>
        console.log('Guest Signin complete!'),
      );
    } catch (error: any) {
      console.log('Error while login as a guest:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handlePress = () => {
  //   // Intentionally causing a crash
  //   crashlytics().log('Test crash initiated');
  //   crashlytics().crash();
  // };

  return (
    <View
      style={[
        styles.ScreenContainer,
        {
          backgroundColor: themeColor.primaryBg,
          justifyContent: 'center',
        },
      ]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColor.secondaryText} />
        </View>
      ) : (
        <>
          <View style={styles.detailContainer}>
            {/* <TouchableOpacity onPress={handlePress}>
              <Text>Click to crash</Text>
            </TouchableOpacity> */}
            <Text
              style={[styles.headingText, {color: themeColor.secondaryText}]}>
              {t('welcomeToWishLists')}
            </Text>
            <Text
              style={[styles.detailText, {color: themeColor.secondaryText}]}>
              {t('welcomeDetails')}
            </Text>
          </View>
          <View style={styles.ButtonContainer}>
            <AppleButton
              buttonStyle={
                themeMode == 'dark'
                  ? AppleButton.Style.WHITE
                  : AppleButton.Style.BLACK
              }
              buttonType={AppleButton.Type.SIGN_IN}
              style={styles.AppleButton}
              onPress={handleonAppleButtonPress}
            />
          </View>

          <TouchableOpacity
            style={styles.InputContainerComponent}
            onPress={handleLoginAsGuest}>
            <Text
              style={[
                styles.DeleteAccountText,
                {color: themeColor.secondaryText},
              ]}>
              {t('continueAsGuest')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ButtonContainer: {
    alignItems: 'center',
    marginBottom: SPACING.space_20,
  },
  InputContainerComponent: {
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_20,
    paddingTop: SPACING.space_10,
    alignItems: 'center',
  },
  AppleButton: {
    width: '85%',
    height: SPACING.space_20 * 2.5,
    fontSize: FONTSIZE.size_14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DeleteAccountText: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20 * 4,
    alignItems: 'center',
  },
  headingText: {
    fontSize: FONTSIZE.size_20,
    marginBottom: SPACING.space_20,
  },
  detailText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    lineHeight: SPACING.space_24,
  },
});
