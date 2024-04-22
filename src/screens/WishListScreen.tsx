import {FlatList, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

// Components
import HeaderBar from '../components/HeaderBar';
import CategoryScroller from '../components/CategoryScroller';
import WishListFlatList from '../components/WishListFlatList';

// Memorized functions
import {getCategories, getWishListByCategory, showToast} from '../utils/common';

const WishListScreen = ({route, navigation}: any) => {
  // State
  const [categories, setCategories] = useState<any>([]);
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedWishList, setSortedWishList] = useState<any>([]);

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
      if (route.params && route.params.category) {
        setCategoryIndex({
          index: categories.indexOf(route.params.category),
          category: route.params.category,
        });
      } else {
        setCategoryIndex({index: 0, category: categories[0]});
      }
    }
  }, [categories, route]);

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
      <HeaderBar title="My WishList" />

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
        leftSwipeIcon="shopping-cart"
      />
    </View>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_20,
    paddingBottom: SPACING.space_20,
  },
});
