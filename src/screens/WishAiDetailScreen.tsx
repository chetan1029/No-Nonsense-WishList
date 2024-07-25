import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useOfflineStore} from '../store/offline-store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import {useStore} from '../store/store';
import firestore from '@react-native-firebase/firestore';

// Components
import HeaderBar from '../components/HeaderBar';
import LoadingCard from '../components/LoadingCard';
import WishAiDetailCard from '../components/WishAiDetailCard';
import WishListFlatList from '../components/WishListFlatList';
import {FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

const WishAiDetailScreen = ({route, navigation}: any) => {
  // State
  const [loading, setLoading] = useState(false);
  const [wishAiDetail, setWishAiDetail] = useState<any>({});

  // Store
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const Settings = useOfflineStore((state: any) => state.Settings);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const WishAiWishItems = useStore((state: any) => state.WishAiWishItems);
  const fetchWishAiWishItems = useStore(
    (state: any) => state.fetchWishAiWishItems,
  );

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Const
  const {t} = useTranslation();

  let item = route?.params?.item;
  if (!item) {
    item = route?.params;
  }

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

  // Use effect to subscribe to changes in Firestore
  useEffect(() => {
    if (item?.type && item?.type == 'user-history' && !item?.response) {
      if (!UserDetail || !UserDetail.uid || !item?.guideId) {
        return;
      }

      const unsubscribe = firestore()
        .collection('wishAi')
        .doc(item.guideId)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const modifiedData = snapshot.data();
            setWishAiDetail(modifiedData); // Update state with modified data
          } else {
            setWishAiDetail({}); // Handle case where document doesn't exist
          }
        });

      // Clean up the listener when component unmounts
      return () => {
        unsubscribe();
      };
    } else if (item?.type && item?.type == 'no-keywordMatch') {
      setWishAiDetail(item);
    } else {
      setWishAiDetail(item);
    }
  }, [item, UserDetail]);

  // Use effect to fetch wish list
  useEffect(() => {
    const fetchData = async (userId: string, category: string) => {
      setLoading(true);
      await fetchWishAiWishItems(userId, category);
      setLoading(false);
    };

    if (item?.type == 'general' && item?.userId && item?.category) {
      fetchData(item.userId, item.category);
    }
  }, [fetchWishAiWishItems, item]);

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>

      {/* App Header */}
      <HeaderBar
        title={t('wishAi')}
        themeColor={themeColor}
        backButton={() => {
          navigation.navigate('WishAiScreen');
        }}
      />
      <Text style={styles.cardTitle}>{item?.prompt}</Text>
      {loading ? (
        <LoadingCard />
      ) : item?.type == 'general' && item?.userId && item?.category ? (
        <WishListFlatList
          ListRef={ListRef}
          categoryIndex={{
            index: 0,
            category: '',
            sharedWishListId: '',
          }}
          sortedWishList={WishAiWishItems}
          handleSwipeableOpen={handleSwipeableOpen}
          tabBarHeight={tabBarHeight}
          leftSwipeIcon="shopping-cart"
          onRefresh={() => {}}
          refreshing={false}
          showMoreModal={true}
          navigation={navigation}
          themeColor={themeColor}
          screenType="ShareWishList"
          t={t}
        />
      ) : (
        <WishAiDetailCard
          themeColor={themeColor}
          item={wishAiDetail}
          tabBarHeight={tabBarHeight}
          t={t}
        />
      )}
    </View>
  );
};

export default WishAiDetailScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    marginBottom: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
  },
});
