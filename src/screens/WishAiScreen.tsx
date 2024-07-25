import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import LoadingCard from '../components/LoadingCard';
import WishAiFlatList from '../components/WishAiFlatList';
import WishAiSearchCard from '../components/WishAiSearchCard';
import {FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

const WishAiScreen = ({route, navigation}: any) => {
  // State
  const [wishAiList, setWishAiList] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Store
  const WishAiItems = useStore((state: any) => state.WishAiItems);
  const GuideId = useStore((state: any) => state.GuideId);
  const fetchWishAiItems = useStore((state: any) => state.fetchWishAiItems);
  const searchViaWishAi = useStore((state: any) => state.searchViaWishAi);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const Settings = useOfflineStore((state: any) => state.Settings);

  // Other variables
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  // Const
  const {t} = useTranslation();
  const type = route?.params?.type;
  // Use effect to fetch wish list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWishAiItems(type, UserDetail, Settings?.language);
      setLoading(false);
    };

    fetchData();
  }, [fetchWishAiItems, UserDetail, type, Settings?.language]);

  // Use effect to update wishAi list when changes
  useEffect(() => {
    setWishAiList(WishAiItems);
  }, [WishAiItems]);

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  // Functions
  const resetWishAiSearch = () => {
    setSearchText('');
    setWishAiList(WishAiItems);
  };

  const searchWishAiList = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setWishAiList([
        ...WishAiItems.filter((item: any) =>
          item.prompt.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  return (
    <View
      style={[styles.ScreenContainer, {backgroundColor: themeColor.primaryBg}]}>
      <StatusBar backgroundColor={themeColor.primaryBg}></StatusBar>

      {/* App Header */}
      <HeaderBar title={t('wishAi')} themeColor={themeColor} />

      {/* Search Input */}
      <SearchBar
        searchText={searchText}
        searchWishList={searchWishAiList}
        setSearchText={setSearchText}
        resetSearchWishList={resetWishAiSearch}
        themeColor={themeColor}
        placeholder={t('searchWishAi')}
      />
      {type == 'general' ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WishAiScreen', {type: 'user-history'});
          }}
          style={styles.SearchHistroy}>
          <Text
            style={[styles.HistoryTitle, {color: themeColor.primaryTextFocus}]}>
            My Search History
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WishAiScreen', {type: 'general'});
          }}
          style={styles.SearchHistroy}>
          <Text
            style={[styles.HistoryTitle, {color: themeColor.primaryTextFocus}]}>
            General
          </Text>
        </TouchableOpacity>
      )}

      {/* Search for Guide AI */}
      {searchText ? (
        <View style={styles.wishAiContainer}>
          <WishAiSearchCard
            themeColor={themeColor}
            navigation={navigation}
            targetScreen="WishAiDetailScreen"
            getNavigationParams={(item: any, guideId: string) => ({
              prompt: searchText,
              type: 'user-history',
              guideId: guideId,
            })}
            item={{
              text: searchText,
              prompt: searchText,
              type: 'user-history',
              from: 'guide',
            }}
            searchViaWishAi={searchViaWishAi}
            userDetail={UserDetail}
            t={t}
          />
        </View>
      ) : (
        ''
      )}

      {loading ? (
        <LoadingCard />
      ) : (
        <WishAiFlatList
          ListRef={ListRef}
          tabBarHeight={tabBarHeight}
          wishAiList={wishAiList}
          navigation={navigation}
          themeColor={themeColor}
          targetScreen="WishAiDetailScreen"
          getNavigationParams={() => {}}
          t={t}
        />
      )}
    </View>
  );
};

export default WishAiScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SearchHistroy: {
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.space_20,
    paddingVertical: SPACING.space_4,
  },
  HistoryTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
  },
  wishAiContainer: {
    marginHorizontal: SPACING.space_20,
  },
});
