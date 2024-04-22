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

  // Form
  const formRef = useRef<any>(null);
  const initialFormValues = {
    url: '',
  };

  // Store
  const WishListItems = useStore((state: any) => state.WishListItems);
  const addWishList = useStore((state: any) => state.addWishList);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);

  // Use effect to fetch wish list
  useEffect(() => {
    fetchWishListItems();
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
      <View style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>

        {/* Background Image */}
        <Image
          source={require('../assets/bg.png')}
          style={styles.BackgroundImage}
        />

        {/* Overlay View with Opacity */}
        <View style={styles.Overlay}></View>

        {/* App Header */}
        <HeaderBar />

        <Formik
          innerRef={formRef}
          initialValues={initialFormValues}
          validationSchema={wishListValidationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, actions) => {
            try {
              actions.resetForm();
              addWishList(selectCategory, values.url);
              setShowNextPart(false);
              navigation.navigate('WishList', {
                category: selectCategory,
              });
              showToast(`Added to WishList`, 'success');
            } catch (error) {
              console.error('Error adding to wishlist:', error);
              showToast('Error adding to Wishlist', 'error');
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
            <View style={styles.ScreenView}>
              {/* Search Input */}
              <Text style={styles.ScreenTitle}>Find the Gift You Deserve</Text>
              <AddLinkInput
                value={values.url}
                handleOnChageText={(value: string) => {
                  handleChange('url')(filterUrl(value));
                  setFieldError('url', undefined);
                  setShowNextPart(true);
                }}
                resetUrlField={() => {
                  handleChange('url')('');
                }}
                urlError={errors.url}
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
                                : COLORS.primaryGreyHex,
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
                                  ? COLORS.primaryBlackHex
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
                        {backgroundColor: COLORS.primaryGreyHex},
                      ]}>
                      <TextInput
                        placeholder="Add new ..."
                        placeholderTextColor={COLORS.primaryLightGreyHex}
                        style={styles.TextInputContainer}
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
    </KeyboardAvoidingView>
  );
};

export default AddWishListScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
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
    backgroundColor: COLORS.primaryBlackRGBA,
  },
  ScreenView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.space_40 * 2.5,
    paddingTop: SPACING.space_40 * 1.2,
    backgroundColor: COLORS.primaryGreyHex,
    borderTopLeftRadius: BORDERRADIUS.radius_20,
    borderTopRightRadius: BORDERRADIUS.radius_20,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
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
    color: COLORS.primaryWhiteHex,
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
