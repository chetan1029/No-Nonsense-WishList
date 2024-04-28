import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

// Components
import HeaderBar from '../components/HeaderBar';
import SearchBar from '../components/SearchBar';
import WishListFlatList from '../components/WishListFlatList';

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

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Use effect to fetch wish list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWishListItems();
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
  }, [WishListItems]);

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

  const handleSwipeableOpen = (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
      removeFromPurchaseList(id);
      showToast(`${title} is move back to Wishlist`, 'success');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishListItems();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}></StatusBar>

      {/* App Header */}
      <HeaderBar title="My Purchase List" />

      {/* Search Input */}
      <SearchBar
        searchText={searchText}
        searchWishList={searchWishList}
        setSearchText={setSearchText}
        resetSearchWishList={resetSearchWishList}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryWhiteHex} />
        </View>
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
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
