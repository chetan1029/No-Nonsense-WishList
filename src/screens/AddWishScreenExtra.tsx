import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  BORDERRADIUS,
} from '../theme/theme';
import RNPickerSelect from 'react-native-picker-select';
import {Formik} from 'formik';
import * as yup from 'yup';

// Components
import HeaderBar from '../components/HeaderBar';

// Memorized functions
import {getCategories, getWishListByCategory, showToast} from '../utils/common';
import {parseHTMLContent} from '../utils/parsehtml';
import {ref} from 'firebase/database';

const wishListValidationSchema = yup.object().shape({
  category: yup.string().required('Category is Required'),
  newCategory: yup.string().required('Category name is Required'),
  url: yup.string().required('URL is Required').url('Invalid URL format'),
});

const AddWishListScreenExtra = ({navigation}: any) => {
  const [categories, setCategories] = useState<any>([]);
  const WishListItems = useStore((state: any) => state.WishListItems);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);
  const addWishList = useStore((state: any) => state.addWishList);
  const WebPageContent = useStore((state: any) => state.WebPageContent);
  const fetchWebPageContent = useStore(
    (state: any) => state.fetchWebPageContent,
  );
  const UserDetail = useStore((state: any) => state.UserDetail);

  const formRef = useRef<any>(null);
  const tabBarHeight = useBottomTabBarHeight();

  const initialFormValues = {
    category: '',
    newCategory: '',
    url: '',
    title: '',
    price: '',
  };

  // Use effect to fetch wish list
  useEffect(() => {
    fetchWishListItems(UserDetail);
  }, [fetchWishListItems]);

  // Use effect to set category list
  useEffect(() => {
    if (WishListItems) {
      const uniqueCategoryList = getCategories(WishListItems);
      const options = uniqueCategoryList.map(category => ({
        label: category,
        value: category,
      }));
      setCategories([
        ...options,
        {
          label: 'Add a new category',
          value: 'newCategory',
        },
      ]);
    }
  }, [WishListItems]);

  // Use effect to fetch page content
  /*useEffect(() => {
    fetchWebPageContent(
      'https://volutz.com/collections/lightning-cable/products/quantum-i-20w-ultra-slim-usb-c-wall-charger-with-lightning-cable-snow-white',
    );
  }, []);*/

  //use effect to fetch title, image and price from web page
  useEffect(() => {
    const {title, thumbnailImage, price} = parseHTMLContent(WebPageContent);
    console.log(title, thumbnailImage, price);
    formRef.current.setFieldValue('title', title);
    formRef.current.setFieldValue('price', price);
  }, [WebPageContent]);

  const placeholder = {
    label: 'Select an category',
    value: '',
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
        style={{marginBottom: tabBarHeight}}>
        {/* App Header */}
        <HeaderBar
          title="Add your wish"
          navigation={navigation}
          backButton={true}
        />
        <Formik
          innerRef={formRef}
          initialValues={initialFormValues}
          validationSchema={wishListValidationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, actions) => {
            actions.resetForm();
            const category =
              values.category == 'newCategory'
                ? values.newCategory
                : values.category;
            addWishList(category, values.url, values.title, values.price);
            showToast(`${values.title} is added to WishList`, 'success');
            navigation.navigate('Home');
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldError,
            values,
            errors,
          }) => (
            <>
              <View style={styles.InputContainerComponent}>
                <RNPickerSelect
                  placeholder={placeholder}
                  items={categories}
                  onValueChange={value => {
                    handleChange('category')(value);
                    if (value == 'newCategory') {
                      handleChange('newCategory')('');
                    }
                    setFieldError('category', undefined);
                  }}
                  value={values.category}
                  style={pickerSelectStyles}
                />
              </View>
              {errors.category && (
                <Text style={styles.Error}>{errors.category}</Text>
              )}
              {values.category === 'newCategory' && (
                <>
                  <View style={styles.InputContainerComponent}>
                    <TextInput
                      placeholder="Enter Category Name"
                      placeholderTextColor={COLORS.primaryLightGreyHex}
                      style={styles.TextInputContainer}
                      value={values.newCategory}
                      onChangeText={value => {
                        handleChange('newCategory')(value);
                        setFieldError('newCategory', undefined);
                      }}
                    />
                  </View>
                  {errors.newCategory && (
                    <Text style={styles.Error}>{errors.newCategory}</Text>
                  )}
                </>
              )}
              <View style={styles.InputContainerComponent}>
                <TextInput
                  placeholder="Enter / Paste your link here"
                  placeholderTextColor={COLORS.primaryLightGreyHex}
                  style={styles.TextInputContainer}
                  value={values.url}
                  onChangeText={value => {
                    handleChange('url')(value.toLowerCase());
                    setFieldError('url', undefined);
                    if (value) {
                      fetchWebPageContent(value);
                    }
                  }}
                />
              </View>
              {errors.url && <Text style={styles.Error}>{errors.url}</Text>}
              <View style={styles.InputContainerComponent}>
                <TextInput
                  placeholder="Title"
                  placeholderTextColor={COLORS.primaryLightGreyHex}
                  style={styles.TextInputContainer}
                  value={values.title}
                  onChangeText={handleChange('title')}
                />
              </View>
              <View style={styles.InputContainerComponent}>
                <TextInput
                  placeholder="Price"
                  placeholderTextColor={COLORS.primaryLightGreyHex}
                  style={styles.TextInputContainer}
                  value={values.price}
                  onChangeText={handleChange('price')}
                />
              </View>
              <View style={styles.ButtonContainerComponent}>
                <TouchableOpacity
                  style={styles.ButtonContainer}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.ButtonText}>Add to WishList</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default AddWishListScreenExtra;

const styles = StyleSheet.create({
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_20,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginHorizontal: SPACING.space_20,
  },
  SelectConainter: {
    height: SPACING.space_20 * 2.5,
  },
  ButtonContainerComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.space_20,
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
    color: COLORS.primaryOrangeHex,
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
