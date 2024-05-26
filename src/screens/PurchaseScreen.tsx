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
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';

// Components
import HeaderBar from '../components/HeaderBar';
import SearchBar from '../components/SearchBar';
import WishListFlatList from '../components/WishListFlatList';
import LoadingCard from '../components/LoadingCard';

// Memorized functions
import {getWishListByCategory, showToast} from '../utils/common';

const PurchaseScreen = ({navigation}: any) => {
  // State
  const [sortedWishList, setSortedWishList] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Store
  const WishListItems = useStore((state: any) => state.WishListItems);
  const removeFromPurchaseList = useStore(
    (state: any) => state.removeFromPurchaseList,
  );
  const fetchWishListItems = useStore((state: any) => state.fetchWishListItems);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Const
  const {t} = useTranslation();

  // Use effect to fetch wish list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWishListItems(UserDetail);
      setLoading(false);
    };

    fetchData();
  }, [fetchWishListItems]);

  // Use effect to set category list
  useEffect(() => {
    if (WishListItems) {
      const updatedSortedWishList = getWishListByCategory(
        '',
        WishListItems,
        true,
      );
      setSortedWishList(updatedSortedWishList);
    }
  }, [WishListItems, getWishListByCategory]);

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  // Functions
  const searchWishList = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setSortedWishList([
        ...WishListItems.filter(
          (item: any) =>
            (item.title.toLowerCase().includes(search.toLowerCase()) &&
              item.purchase == true) ||
            (item.url.toLowerCase().includes(search.toLowerCase()) &&
              item.purchase == true),
        ),
      ]);
    }
  };

  const resetSearchWishList = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    const updatedSortedWishList = getWishListByCategory(
      '',
      WishListItems,
      true,
    );
    setSortedWishList(updatedSortedWishList);
    setSearchText('');
  };

  const handleSwipeableOpen = async (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
      await removeFromPurchaseList(id, UserDetail);
      showToast(t('moveToWishlist', {title}), 'success');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishListItems(UserDetail);
    setRefreshing(false);
  };

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>

      {/* App Header */}
      <HeaderBar title={t('myPurchases')} themeColor={themeColor} />

      {/* Search Input */}
      <SearchBar
        searchText={searchText}
        searchWishList={searchWishList}
        setSearchText={setSearchText}
        resetSearchWishList={resetSearchWishList}
        themeColor={themeColor}
        placeholder={t('searchWishlists')}
      />
      {loading ? (
        <LoadingCard />
      ) : (
        <>
          {/* WishList Flatlist */}
          <WishListFlatList
            ListRef={ListRef}
            sortedWishList={sortedWishList}
            handleSwipeableOpen={handleSwipeableOpen}
            tabBarHeight={tabBarHeight}
            leftSwipeIcon="corner-up-left"
            onRefresh={onRefresh}
            refreshing={refreshing}
            showMoreModal={false}
            navigation={navigation}
            themeColor={themeColor}
            screenType={'WishList'}
            t={t}
          />
        </>
      )}
    </View>
  );
};

export default PurchaseScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
