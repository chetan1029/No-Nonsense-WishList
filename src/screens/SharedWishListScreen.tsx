import {Alert, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

// Components
import HeaderBar from '../components/HeaderBar';
import {useOfflineStore} from '../store/offline-store';
import {useStore} from '../store/store';
import SharedWishListFlatList from '../components/SharedWishListFlatList';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';

const SharedWishListScreen = ({route, navigation}: any) => {
  // state
  const [refreshing, setRefreshing] = useState(false);
  const categoryId = route?.params?.categoryId;
  const categoryName = route?.params?.name;

  // Store
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const sharedWishList = useStore((state: any) => state.SharedWishList);
  const AlertMessageDetails = useStore(
    (state: any) => state.AlertMessageDetails,
  );
  const fetchSharedWishList = useStore(
    (state: any) => state.fetchSharedWishList,
  );
  const addToSharedWishList = useStore(
    (state: any) => state.addToSharedWishList,
  );
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Const
  const {t} = useTranslation();

  // use Effect
  useEffect(() => {
    if (categoryId) {
      Alert.alert(t('confirmation'), t('wannaAddToWishlist', {categoryName}), [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('yes'),
          onPress: async () => {
            console.log('Yes');
            await addToSharedWishList(UserDetail, categoryId, t);
          },
        },
      ]);
    }
  }, [categoryId]);

  // use Effect to manage alert
  useEffect(() => {
    console.log(AlertMessageDetails);
    if (AlertMessageDetails.message) {
      Alert.alert(AlertMessageDetails.title, AlertMessageDetails.message, [
        {
          text: t('ok'),
        },
      ]);
    }
  }, [AlertMessageDetails]);

  useEffect(() => {
    fetchSharedWishList(UserDetail);
  }, [fetchSharedWishList]);

  // functions
  const onRefresh = async () => {
    setRefreshing(true);
    fetchSharedWishList(UserDetail);
    setRefreshing(false);
  };

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>
      {/* App Header */}
      <HeaderBar title={t('sharedWishlist')} themeColor={themeColor} />

      {/* SharedWishList Flatlist */}
      <SharedWishListFlatList
        ListRef={ListRef}
        sharedWishList={sharedWishList}
        tabBarHeight={tabBarHeight}
        onRefresh={onRefresh}
        refreshing={refreshing}
        navigation={navigation}
        themeColor={themeColor}
        placeholder={t('noWishlistItems')}
      />
    </View>
  );
};

export default SharedWishListScreen;

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
