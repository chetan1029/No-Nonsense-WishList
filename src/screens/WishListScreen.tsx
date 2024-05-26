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
import _ from 'lodash';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import firestore from '@react-native-firebase/firestore';

// Components
import HeaderBar from '../components/HeaderBar';
import CategoryScroller from '../components/CategoryScroller';
import WishListFlatList from '../components/WishListFlatList';

// Memorized functions
import {getCategories, getWishListByCategory, showToast} from '../utils/common';
import LoadingCard from '../components/LoadingCard';

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
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Const
  const {t} = useTranslation();

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
  }, [WishListItems, CategoryList, categoryIndex.category]);

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  // functions
  const handleSwipeableOpen = (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
      addToPurchaseList(id, UserDetail);
      showToast(t('moveToPurchase', {title}), 'success');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishListItems(UserDetail);
    await fetchCateogryList(UserDetail);
    setCategoryIndex(categoryIndex);
    setRefreshing(false);
  };

  // Use effect to subscribe to changes in Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Wishlist')
      .where('userId', '==', UserDetail.uid)
      .onSnapshot(async querySnapshot => {
        let promises: any = [];
        querySnapshot.docChanges().forEach(change => {
          if (
            change.type === 'added' ||
            change.type === 'removed' ||
            change.type === 'modified'
          ) {
            // Add asynchronous operations to promises array
            promises.push(fetchWishListItems(UserDetail));
            promises.push(fetchCateogryList(UserDetail));
          }
        });

        await Promise.all(promises);
      });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [fetchWishListItems, fetchCateogryList, UserDetail]);

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

      {/* App Header */}
      <HeaderBar title={t('myWishlists')} themeColor={themeColor} />

      {loading ? (
        <LoadingCard />
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
            screenType="WishList"
            t={t}
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
