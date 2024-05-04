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

// Components
import HeaderBar from '../components/HeaderBar';
import AddLinkInput from '../components/AddLinkInput';

// Memorized functions
import {getCategories, showToast, filterUrl} from '../utils/common';

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
  };

  // Store
  const WishListItems = useStore((state: any) => state.WishListItems);
  const addWishList = useStore((state: any) => state.addWishList);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);

  // Use effect to fetch wish list
  useEffect(() => {
    fetchWishListItems(UserDetail);
  }, [fetchWishListItems]);

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
          <Image
            source={require('../assets/bg.png')}
            style={styles.BackgroundImage}
          />

          {/* Overlay View with Opacity */}
          <View
            style={[
              styles.Overlay,
              {backgroundColor: themeColor.primaryBgOpacity5},
            ]}></View>

          {/* ActivityIndicator overlay */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={themeColor.secondaryText}
              />
            </View>
          )}

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
                  rawUrl,
                  UserDetail,
                );
                setShowNextPart(false);
                navigation.navigate('WishList', {
                  category: selectCategory,
                });
                showToast(`Added to WishList`, 'success');
              } catch (error) {
                console.error('Error adding to wishlist:', error);
                showToast('Error adding to Wishlist', 'error');
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
                  Find the Gift You Deserve
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
                  urlError={errors.url}
                  themeColor={themeColor}
                />
                {showNextPart && showNextPart ? (
                  <>
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
                          placeholder="Add new ..."
                          placeholderTextColor={COLORS.primaryLightGreyHex}
                          style={[
                            styles.TextInputContainer,
                            {color: themeColor.secondaryText},
                          ]}
                          onChangeText={text => {
                            setNewCategory(text);
                          }}
                          onSubmitEditing={handleAddNewCategory}
                          value={newCategory}
                        />
                      </View>
                    </View>
                    <View style={styles.ButtonContainerComponent}>
                      <TouchableOpacity
                        style={styles.ButtonContainer}
                        onPress={() => handleSubmit()}>
                        <Text style={styles.ButtonText}>Add to WishList</Text>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBlackRGBA,
    zIndex: 9999,
  },
});
