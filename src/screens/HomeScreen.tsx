import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

// Components
import HeaderBar from '../components/HeaderBar';
import SearchBar from '../components/SearchBar';
import CategoryScroller from '../components/CategoryScroller';
import WishListFlatList from '../components/WishListFlatList';

// Memorized functions
import {getCategories, getWishListByCategory, showToast} from '../utils/common';
import AddLinkInput from '../components/AddLinkInput';

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
  const addToPurchaseList = useStore((state: any) => state.addToPurchaseList);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Use effect to set category list
  useEffect(() => {
    if (WishListItems) {
      const uniqueCategoryList = getCategories(WishListItems);
      setCategories(uniqueCategoryList);
    }
  }, [WishListItems]);

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
        false,
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

  const handleSwipeableOpen = (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
      addToPurchaseList(id);
      showToast(`${title} is Purchased`, 'success');
    }
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>

      {/* App Header */}
      <HeaderBar />

      <Text style={styles.ScreenTitle}>Find the Gift You Deserve</Text>

      {/* Search Input */}
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
