import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import Toast from 'react-native-toast-message';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import CoffeeCard from '../components/CoffeeCard';
import WishListCard from '../components/WishListCard';
import SwipeableRow from '../components/SwipeableRow';

function getCategories(data: any[]) {
  // Extract unique names from the array
  const uniqueNames = [...new Set(data.map(item => item.name))];
  return uniqueNames;
}

function getCoffeeByCategory(category: string, data: any[]) {
  // Filter items based on the provided category
  const items = data.filter(item => item.category === category);
  return items;
}

const HomeScreen = ({navigation}: any) => {
  const CoffeeList = useStore((state: any) => state.CoffeeList);
  const CategoryList = useStore((state: any) => state.CategoryList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const [categories, setCategories] = useState(getCategories(CategoryList));
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeByCategory(categoryIndex.category, CoffeeList),
  );

  const ListRef: any = useRef<FlatList>();
  const [searchText, setSearchText] = useState('');

  const tabBarHeight = useBottomTabBarHeight();

  const searchCoffee = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...CoffeeList.filter((item: any) =>
          item.title.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...CoffeeList]);
    setSearchText('');
  };

  const showToast = (message: any) => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 2000, // Duration in milliseconds
      position: 'bottom', // You can use 'top' or 'bottom'
    });
  };

  const CoffeCardAddToCart = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });
    calculateCartPrice();
    showToast(`${name} is Added to Cart`);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>
      {/* App Header */}

      <HeaderBar />
      <Text style={styles.ScreenTitle}>Find the Gift{'\n'}You Deserve</Text>

      {/* Search Input */}

      <View style={styles.InputContainerComponent}>
        <TouchableOpacity
          onPress={() => {
            searchCoffee(searchText);
          }}>
          <CustomIcon
            style={styles.InputIcon}
            name="search"
            size={FONTSIZE.size_18}
            color={
              searchText.length > 0
                ? COLORS.primaryOrangeHex
                : COLORS.primaryLightGreyHex
            }
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Find Your Wish..."
          placeholderTextColor={COLORS.primaryLightGreyHex}
          style={styles.TextInputContainer}
          onChangeText={text => {
            setSearchText(text);
            searchCoffee(text);
          }}
          value={searchText}
        />
        {searchText.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              resetSearchCoffee();
            }}>
            <CustomIcon
              style={styles.InputIcon}
              name="close"
              size={FONTSIZE.size_16}
              color={COLORS.primaryLightGreyHex}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>

      {/* Category Scroller */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.CategoryScrollViewStyle}>
        {categories.map((data, index) => (
          <View
            key={index.toString()}
            style={styles.CategoryScrollViewContainer}>
            <TouchableOpacity
              style={styles.CategoryScrollViewItem}
              onPress={() => {
                ListRef?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
                setCategoryIndex({
                  index: index,
                  category: categories[index],
                });
                setSortedCoffee(getCoffeeByCategory(data, CoffeeList));
              }}>
              <Text
                style={[
                  styles.CategoryText,
                  categoryIndex.index == index
                    ? {color: COLORS.primaryOrangeHex}
                    : {},
                ]}>
                {data}
              </Text>
              {categoryIndex.index == index ? (
                <View style={styles.ActiveCategory} />
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Coffee Flatlist */}
      <FlatList
        ref={ListRef}
        horizontal={false}
        ListEmptyComponent={
          <View style={styles.EmptyListContainer}>
            <Text style={styles.CategoryText}>No WishList Item Available</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        data={sortedCoffee}
        contentContainerStyle={styles.FlatListContainer}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <SwipeableRow>
              <WishListCard
                id={item.id}
                index={item.index}
                imagelink_square={item.imagelink_square}
                title={item.title}
                price={item.price}
                currency={item.currency}
              />
            </SwipeableRow>
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
    margin: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    paddingBottom: SPACING.space_15,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.1,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});
