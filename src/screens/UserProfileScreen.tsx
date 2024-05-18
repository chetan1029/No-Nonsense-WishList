import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useOfflineStore} from '../store/offline-store';
import {useStore} from '../store/store';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';

// Components
import HeaderBar from '../components/HeaderBar';
import {showToast} from '../utils/common';
import TextInputField from '../components/TextInputField';

// Yup validation
const userProfileValidationSchema = yup.object().shape({
  name: yup.string().required('* Name is Required'),
  email: yup
    .string()
    .required('* Email is Required')
    .email('* Enter valid email address'),
});

const UserProfileScreen = ({route, navigation}: any) => {
  // state
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Store
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Const
  const {t} = useTranslation();

  // Form
  const formRef = useRef<any>(null);
  const initialFormValues = {
    name: '',
    email: '',
  };

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
      <HeaderBar
        title={t('userProfile')}
        themeColor={themeColor}
        backButton={() => {
          navigation.navigate('Settings');
        }}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColor.secondaryText} />
        </View>
      ) : (
        <>
          {/* User Profile */}
          <Formik
            innerRef={formRef}
            initialValues={initialFormValues}
            validationSchema={userProfileValidationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              try {
                setLoading(true);
                console.log('Form Values on Submit:', values);
                navigation.navigate('Settings');
                showToast(t('addedToWishlist'), 'success');
              } catch (error) {
                console.error('Error adding to wishlist:', error);
                showToast(t('errorAddingToWishlist'), 'error');
              } finally {
                setLoading(false);
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldError,
              values,
              errors,
            }) => (
              <View style={[styles.ScreenView]}>
                {/* Search Input */}
                <TextInputField
                  value={values.name}
                  handleOnChageText={handleChange('name')}
                  placeholder={t('enterYourName')}
                  error={errors.name}
                  themeColor={themeColor}
                  icon="user"
                />

                <TextInputField
                  value={values.email}
                  handleOnChageText={handleChange('email')}
                  placeholder={t('enterYourEmail')}
                  error={errors.email}
                  themeColor={themeColor}
                  icon="mail"
                />

                <View style={styles.ButtonContainerComponent}>
                  <TouchableOpacity
                    style={styles.ButtonContainer}
                    onPress={() => {
                      handleSubmit();
                    }}>
                    <Text style={styles.ButtonText}>
                      {t('saveUserProfile')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </>
      )}
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={{color: COLORS.primaryRedHex}}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ScreenView: {},
  ButtonContainerComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.space_20,
  },
  ButtonContainer: {
    backgroundColor: COLORS.primaryOrangeHex,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_20 * 2.5,
    borderRadius: BORDERRADIUS.radius_10,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
