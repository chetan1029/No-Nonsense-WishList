import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useOfflineStore} from '../store/offline-store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import _ from 'lodash';

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
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Store
  const WishListItems = useStore((state: any) => state.WishListItems);
  const addToPurchaseList = useStore((state: any) => state.addToPurchaseList);
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const CategoryList = useStore((state: any) => state.CategoryList);
  const fetchCateogryList = useStore((state: any) => state.fetchCateogryList);
  const themeColor = useOfflineStore((state: any) => state.themeColor);

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
      if (route.params) {
        if (route.params.category) {
          setCategoryIndex({
            index: categories.indexOf(route.params.category),
            category: route.params.category,
          });
        } else if (route.params.index == 0) {
          setCategoryIndex({
            index: route.params.index,
            category: categories[route.params.index],
          });
        }
      } else if (categoryIndex.index == 0) {
        setCategoryIndex({index: 0, category: categories[0]});
      }
    }
  }, [categories, route]);

  // Use effect to fetch wish list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (UserDetail) {
        await fetchWishListItems(UserDetail);
        await fetchCateogryList(UserDetail);
      }
      setLoading(false);
    };

    fetchData();
  }, [fetchWishListItems, fetchCateogryList, UserDetail]);

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

  // functions
  const handleSwipeableOpen = (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
      addToPurchaseList(id, UserDetail);
      showToast(`${title} is Purchased`, 'success');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishListItems(UserDetail);
    await fetchCateogryList(UserDetail);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Define debounced function outside of the component
  const handleCategorySelectionDebounced = _.debounce(
    (
      index: number,
      category: string,
      ListRef: any,
      setCategoryIndex: any,
      setSortedWishList: any,
      getWishListByCategory: any,
      WishListItems: any,
    ) => {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({
        index: index,
        category: category,
      });
      setSortedWishList(getWishListByCategory(category, WishListItems));
    },
    300, // Debounce delay in milliseconds
    {
      leading: true, // load first click then apply debounced
      trailing: false,
    },
  );

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>

      {/* Overlay View with Opacity */}
      <View
        style={[
          styles.Overlay,
          {backgroundColor: themeColor.primaryBgOpacity5},
        ]}></View>

      {/* App Header */}
      <HeaderBar title="My WishList" themeColor={themeColor} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColor.secondaryText} />
        </View>
      ) : (
        <>
          {/* Category Scroller */}
          <CategoryScroller
            categories={categories}
            ListRef={ListRef}
            categoryIndex={categoryIndex}
            setCategoryIndex={setCategoryIndex}
            setSortedWishList={setSortedWishList}
            getWishListByCategory={getWishListByCategory}
            WishListItems={WishListItems}
            onCategorySelectionDebounced={handleCategorySelectionDebounced}
          />

          {/* WishList Flatlist */}
          <WishListFlatList
            ListRef={ListRef}
            categoryIndex={categoryIndex}
            sortedWishList={sortedWishList}
            handleSwipeableOpen={handleSwipeableOpen}
            tabBarHeight={tabBarHeight}
            leftSwipeIcon="shopping-cart"
            onRefresh={onRefresh}
            refreshing={refreshing}
            showMoreModal={true}
            navigation={navigation}
            themeColor={themeColor}
          />
        </>
      )}
    </View>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Overlay: {
    flex: 1,
  },
});
