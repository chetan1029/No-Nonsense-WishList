import {
  Alert,
  FlatList,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
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
import firestore from '@react-native-firebase/firestore';

const SharedWishListScreen = ({route, navigation}: any) => {
  // state
  const [refreshing, setRefreshing] = useState(false);
  const categoryId = route?.params?.categoryId;
  const categoryName = decodeURIComponent(route?.params?.name);
  const userName = decodeURIComponent(route?.params?.userName);

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
            await addToSharedWishList(UserDetail, categoryId, userName, t);
          },
        },
      ]);
    }
  }, [UserDetail, categoryId, userName]);

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
    if (!UserDetail || !UserDetail.uid) {
      return;
    }
    fetchSharedWishList(UserDetail);
  }, [fetchSharedWishList, UserDetail]);

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

  // Use effect to subscribe to changes in Firestore
  useEffect(() => {
    if (!UserDetail || !UserDetail.uid) {
      return;
    }
    const unsubscribe = firestore()
      .collection('SharedWishList')
      .where('sharedWithUserId', '==', UserDetail?.uid)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (
            change.type === 'added' ||
            change.type === 'removed' ||
            change.type === 'modified'
          ) {
            // Trigger a refresh of wish list items
            fetchSharedWishList(UserDetail);
          }
        });
      });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [fetchSharedWishList, UserDetail]);

  const onShareApp = async () => {
    try {
      const shareOptions = {
        url: 'https://wishlist-338a1.web.app/',
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share cancelled');
      }
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>
      {/* App Header */}
      <HeaderBar
        title={t('sharedWishlist')}
        themeColor={themeColor}
        shareApp={true}
        onShareApp={onShareApp}
      />

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
        t={t}
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
