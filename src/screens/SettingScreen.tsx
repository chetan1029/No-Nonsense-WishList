import {
  ActivityIndicator,
  Alert,
  Linking,
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
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import auth from '@react-native-firebase/auth';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import {linkWithApple} from '../utils/credential';

// Components
import HeaderBar from '../components/HeaderBar';
import {useOfflineStore} from '../store/offline-store';
import {useStore} from '../store/store';

const SettingScreen = ({route, navigation}: any) => {
  // state
  const [loading, setLoading] = useState(false);

  // Store
  const Settings = useOfflineStore((state: any) => state.Settings);
  const updateSettings = useOfflineStore((state: any) => state.updateSettings);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const setUserDetail = useStore((state: any) => state.setUserDetail);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const updateUserNameOnSharedWishList = useStore(
    (state: any) => state.updateUserNameOnSharedWishList,
  );
  // Const
  const {t} = useTranslation();

  // Data
  const themeMode = Settings.themeMode;
  const language = Settings.language;
  const themeModeData = [
    {label: t('lightLabel'), value: 'light'},
    {label: t('darkLabel'), value: 'dark'},
  ];

  const languageData = [
    {label: 'English', value: 'en'},
    {label: 'Swedish', value: 'sv'},
    {label: 'Russian', value: 'ru'},
    {label: 'Spanish', value: 'es'},
    {label: 'Chinese', value: 'zh'},
    {label: 'French', value: 'fr'},
    {label: 'German', value: 'de'},
  ];

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  const onLogoutHandle = () => {
    Alert.alert(t('confirmation'), t('wannaLogout'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await auth()
              .signOut()
              .then(() => {
                console.log('User signed out!');
              });
            setUserDetail(null);
          } catch (error) {
            console.error('Error signing out: ', error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleLinkWithApple = async () => {
    setLoading(true);
    try {
      await linkWithApple(setUserDetail);
      console.log(UserDetail.displayName);
      await updateUserNameOnSharedWishList(UserDetail);
    } catch (error: any) {
      if (error.code === 'auth/credential-already-in-use') {
        Alert.alert(t('accountLinkFailed'), t('accountAlreadyInUse'));
      } else {
        console.log('Error linking with Apple: ', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>
      {/* App Header */}
      <HeaderBar
        title={t('settings')}
        themeColor={themeColor}
        logoutButton={true}
        onLogoutHandle={onLogoutHandle}
      />

      {/* ActivityIndicator overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={themeColor.secondaryText} />
        </View>
      )}

      {!UserDetail?.isAnonymous && (
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
      )}

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
          <Text style={{color: themeColor.secondaryText}}>{t('language')}</Text>
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

      {UserDetail?.isAnonymous && (
        <View style={styles.SignInContainer}>
          <View style={styles.detailContainer}>
            <Text
              style={[styles.headingText, {color: themeColor.secondaryText}]}>
              {t('loggedInAsGuest')}
            </Text>
            <Text
              style={[styles.detailText, {color: themeColor.secondaryText}]}>
              {t('loggedInAsGuestDetail')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ButtonContainer, {backgroundColor: 'transparent'}]}>
            <View style={styles.titleContainer}>
              <AppleButton
                buttonStyle={
                  themeMode == 'dark'
                    ? AppleButton.Style.WHITE
                    : AppleButton.Style.BLACK
                }
                buttonType={AppleButton.Type.SIGN_IN}
                style={styles.AppleButton}
                onPress={() =>
                  handleLinkWithApple().then(() =>
                    console.log('Apple sign-in complete!'),
                  )
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  SignInContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonContainer: {
    alignItems: 'center',
    marginBottom: SPACING.space_20,
    marginHorizontal: SPACING.space_20,
  },
  AppleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: SPACING.space_20 * 2.5,
    fontSize: FONTSIZE.size_14,
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
  detailContainer: {
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_20,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBlackRGBA,
    zIndex: 9999,
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
