import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  BORDERRADIUS,
} from '../theme/theme';
import {useStore} from '../store/store';
import {useOfflineStore} from '../store/offline-store';
import {Formik} from 'formik';
import * as yup from 'yup';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';

// Components
import HeaderBar from '../components/HeaderBar';
import AddLinkInput from '../components/AddLinkInput';

// Memorized functions
import {getCategories, showToast, filterUrl} from '../utils/common';
import LottieView from 'lottie-react-native';
import LoadingIndicator from '../components/LoadingIndicator';
import CommentText from '../components/CommentText';

// Yup validation
const wishListValidationSchema = yup.object().shape({
  url: yup.string().required('* URL is Required').url('* Invalid URL format'),
});

const AddWishListScreen = ({navigation}: any) => {
  // State
  const [categories, setCategories] = useState<any>([]);
  const [selectCategory, setSelectCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [showNextPart, setShowNextPart] = useState<boolean>(false);
  const [rawUrl, setRawUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Form
  const formRef = useRef<any>(null);
  const initialFormValues = {
    url: '',
    comment: '',
  };

  // Store
  const WishListItems = useStore((state: any) => state.WishListItems);
  const addWishList = useStore((state: any) => state.addWishList);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Const
  const {t} = useTranslation();

  // Use effect to fetch wish list
  useEffect(() => {
    if (!UserDetail || !UserDetail.uid) {
      return;
    }
    fetchWishListItems(UserDetail);
  }, [fetchWishListItems, UserDetail]);

  // Use effect to set category list
  useEffect(() => {
    if (WishListItems) {
      const uniqueCategoryList = getCategories(WishListItems);
      if (uniqueCategoryList.length > 0) {
        setCategories(uniqueCategoryList);
      } else {
        setCategories(['General']);
      }
    }
  }, [WishListItems]);

  // Use effect to set first category as selected
  useEffect(() => {
    if (categories.length > 0 && !showNextPart) {
      setSelectCategory(categories[0]);
    }
  }, [categories, showNextPart]);

  // Functions
  const handleAddNewCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setSelectCategory(newCategory);
    }
  };

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Optional: Adjust keyboard offset
    >
      <Pressable
        style={{flex: 1}}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View
          style={[
            styles.ScreenContainer,
            {backgroundColor: themeColor.primaryBg},
          ]}>
          <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>

          {/* Background Image */}

          <LottieView
            style={styles.LottieStyle}
            source={require('../lottie/gift.json')}
            autoPlay
            loop
          />

          {/* ActivityIndicator overlay */}
          {loading && <LoadingIndicator title={t('searchingForproduct')} />}

          {/* App Header */}
          <HeaderBar themeColor={themeColor} />

          <Formik
            innerRef={formRef}
            initialValues={initialFormValues}
            validationSchema={wishListValidationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, actions) => {
              try {
                setLoading(true);
                actions.resetForm();
                await addWishList(
                  selectCategory,
                  values.url,
                  values.comment,
                  rawUrl,
                  UserDetail,
                );
                setShowNextPart(false);
                navigation.navigate('WishList', {
                  category: selectCategory,
                });
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
              <View
                style={[
                  styles.ScreenView,
                  {backgroundColor: themeColor.primaryBgLight},
                ]}>
                {/* Search Input */}
                <Text
                  style={[
                    styles.ScreenTitle,
                    {color: themeColor.secondaryText},
                  ]}>
                  {t('addToWishListTitle')}
                </Text>
                <AddLinkInput
                  value={values.url}
                  handleOnChageText={(value: string) => {
                    setRawUrl(value);
                    handleChange('url')(filterUrl(value));
                    setFieldError('url', undefined);
                    setShowNextPart(true);
                  }}
                  resetUrlField={() => {
                    handleChange('url')('');
                  }}
                  placeholder={t('pasteYourLink')}
                  urlError={errors.url}
                  themeColor={themeColor}
                />
                {showNextPart && showNextPart ? (
                  <>
                    <CommentText
                      value={values.comment}
                      handleOnChageText={(value: string) => {
                        handleChange('comment')(value);
                      }}
                      placeholder={t('wishComment')}
                      urlError={errors.comment}
                      themeColor={themeColor}
                    />

                    <View style={styles.SizeOuterContainer}>
                      {categories.map((category: string, index: any) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.SizeBox,
                            {
                              backgroundColor:
                                selectCategory == category
                                  ? COLORS.primaryOrangeHex
                                  : themeColor.primaryBgLight,
                            },
                          ]}
                          onPress={() => {
                            setSelectCategory(category);
                          }}>
                          <Text
                            style={[
                              styles.SizeText,
                              {
                                color:
                                  selectCategory == category
                                    ? themeColor.primaryBg
                                    : COLORS.primaryOrangeHex,
                              },
                            ]}>
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      <View
                        style={[
                          styles.SizeBox,
                          {backgroundColor: themeColor.primaryBgLight},
                        ]}>
                        <TextInput
                          placeholder={t('addNew')}
                          placeholderTextColor={COLORS.primaryLightGreyHex}
                          style={[
                            styles.TextInputContainer,
                            {color: themeColor.secondaryText},
                          ]}
                          onChangeText={text => {
                            setNewCategory(text);
                          }}
                          onSubmitEditing={handleAddNewCategory}
                          onBlur={handleAddNewCategory}
                          value={newCategory}
                        />
                      </View>
                    </View>
                    <View style={styles.ButtonContainerComponent}>
                      <TouchableOpacity
                        style={styles.ButtonContainer}
                        onPress={() => {
                          handleAddNewCategory();
                          handleSubmit();
                        }}>
                        <Text style={styles.ButtonText}>
                          {t('addToWishList')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  ''
                )}
              </View>
            )}
          </Formik>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default AddWishListScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  BackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  LottieStyle: {
    height: 500,
  },
  Overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ScreenView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.space_40,
    paddingBottom: SPACING.space_40 * 2.5,
    paddingTop: SPACING.space_40 * 1.2,

    borderTopLeftRadius: BORDERRADIUS.radius_20,
    borderTopRightRadius: BORDERRADIUS.radius_20,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    paddingHorizontal: SPACING.space_20,
    paddingBottom: SPACING.space_30,
  },
  SizeOuterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    paddingTop: SPACING.space_10,
  },
  SizeBox: {
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 1,
    textAlign: 'center',
    paddingVertical: SPACING.space_8,
    paddingHorizontal: SPACING.space_16,
    borderColor: COLORS.primaryOrangeHex,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
  TextInputContainer: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
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
  Error: {
    marginHorizontal: SPACING.space_20,
    paddingStart: SPACING.space_10,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryRedHex,
  },
});
