import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import Toast from 'react-native-toast-message';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

// Components
import HeaderBar from '../components/HeaderBar';
import SearchBar from '../components/SearchBar';
import CategoryScroller from '../components/CategoryScroller';
import WishListFlatList from '../components/WishListFlatList';

// Memorized functions
const getCategories = (data: any[]) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  return [...new Set(data.map(item => item.name))];
};

const getWishListByCategory = (category: string, data: any[]) => {
  return data.filter(item => item.category === category && !item.purchase);
};

const HomeScreen = ({navigation}: any) => {
  // State
  const [categories, setCategories] = useState<any>([]);
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedWishList, setSortedWishList] = useState<any>([]);
  const [searchText, setSearchText] = useState('');

  // Store
  const WishListItems = useStore((state: any) => state.WishListItems);
  const CategoryList = useStore((state: any) => state.CategoryList);
  const addToPurchaseList = useStore((state: any) => state.addToPurchaseList);
  const fetchCategoryList = useStore((state: any) => state.fetchCategoryList);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Use effect to fetch category list
  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  // Use effect to set category list
  useEffect(() => {
    if (CategoryList) {
      const uniqueCategoryList = getCategories(CategoryList);
      setCategories(uniqueCategoryList);
    }
  }, [CategoryList]);

  // Use effect to fetch set category index
  useEffect(() => {
    if (categories) {
      setCategoryIndex({index: 0, category: categories[0]});
    }
  }, [categories]);

  // Use effect to fetch wish list
  useEffect(() => {
    fetchWishListItems();
  }, [fetchWishListItems]);

  // Use effect to update sortedWishList after WishListItems change
  useEffect(() => {
    if (categoryIndex && WishListItems) {
      const updatedSortedWishList = getWishListByCategory(
        categoryIndex.category,
        WishListItems,
      );
      setSortedWishList(updatedSortedWishList);
    }
  }, [WishListItems, categoryIndex.category]);

  // Functions
  const searchWishList = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedWishList([
        ...WishListItems.filter(
          (item: any) =>
            item.title.toLowerCase().includes(search.toLowerCase()) &&
            item.purchase == false,
        ),
      ]);
    }
  };

  const resetSearchWishList = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedWishList([...WishListItems]);
    setSearchText('');
  };

  const showToast = (message: any) => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 1000,
      position: 'bottom',
    });
  };

  const handleSwipeableOpen = (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
      addToPurchaseList(id);
      showToast(`${title} is Purchased`);
    }
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>

      {/* App Header */}
      <HeaderBar />
      <Text style={styles.ScreenTitle}>Find the Gift{'\n'}You Deserve</Text>

      {/* Search Input */}
      <SearchBar
        searchText={searchText}
        searchWishList={searchWishList}
        setSearchText={setSearchText}
        resetSearchWishList={resetSearchWishList}
      />

      {/* Category Scroller */}
      <CategoryScroller
        categories={categories}
        ListRef={ListRef}
        categoryIndex={categoryIndex}
        setCategoryIndex={setCategoryIndex}
        setSortedWishList={setSortedWishList}
        getWishListByCategory={getWishListByCategory}
        WishListItems={WishListItems}
      />

      {/* WishList Flatlist */}
      <WishListFlatList
        ListRef={ListRef}
        sortedWishList={sortedWishList}
        handleSwipeableOpen={handleSwipeableOpen}
        tabBarHeight={tabBarHeight}
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
});
