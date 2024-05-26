import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BORDERRADIUS, SPACING} from '../theme/theme';

// Components
import HeaderBar from '../components/HeaderBar';
import {useOfflineStore} from '../store/offline-store';
import {useStore} from '../store/store';
import WishListFlatList from '../components/WishListFlatList';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';

const SharedWishListDetailScreen = ({route, navigation}: any) => {
  // state
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Store
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const SharedWishListItems = useStore(
    (state: any) => state.SharedWishListItems,
  );
  const fetchSharedWishListItems = useStore(
    (state: any) => state.fetchSharedWishListItems,
  );
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();
  const categoryName = route?.params?.name;
  const userId = route?.params?.userId;
  const sharedWishListId = route?.params?.id;

  // Const
  const {t} = useTranslation();

  // use Effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSharedWishListItems(userId, categoryName);
      setLoading(false);
    };
    if (userId && categoryName) {
      fetchData();
    }
  }, [fetchSharedWishListItems, categoryName, userId]);

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  // other functions
  const handleSwipeableOpen = (
    direction: string,
    id: string,
    title: string,
  ) => {
    if (direction == 'left') {
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSharedWishListItems(userId, categoryName);
    setRefreshing(false);
  };

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>
      {/* App Header */}
      <HeaderBar
        title={categoryName}
        themeColor={themeColor}
        backButton={() => {
          navigation.navigate('SharedWishListScreen');
        }}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColor.secondaryText} />
        </View>
      ) : (
        <>
          {/* WishList Flatlist */}
          <WishListFlatList
            ListRef={ListRef}
            categoryIndex={{
              index: 0,
              category: categoryName,
              sharedWishListId: sharedWishListId,
            }}
            sortedWishList={SharedWishListItems}
            handleSwipeableOpen={handleSwipeableOpen}
            tabBarHeight={tabBarHeight}
            leftSwipeIcon="shopping-cart"
            onRefresh={onRefresh}
            refreshing={refreshing}
            showMoreModal={true}
            navigation={navigation}
            themeColor={themeColor}
            screenType="ShareWishList"
            t={t}
          />
        </>
      )}
    </View>
  );
};

export default SharedWishListDetailScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_20,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SPACING.space_20 * 2.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerIcon: {
    marginVertical: SPACING.space_15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    marginRight: SPACING.space_15,
    paddingVertical: SPACING.space_15,
  },
});
