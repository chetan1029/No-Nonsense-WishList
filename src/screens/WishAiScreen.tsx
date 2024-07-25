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
  const [guideAiList, setGuideAiList] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Store
  const GuideAiItems = useStore((state: any) => state.GuideAiItems);
  const GuideId = useStore((state: any) => state.GuideId);
  const fetchGuideAiItems = useStore((state: any) => state.fetchGuideAiItems);
  const searchViaGuideAi = useStore((state: any) => state.searchViaGuideAi);
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
      await fetchGuideAiItems(type, UserDetail, Settings?.language);
      setLoading(false);
    };

    fetchData();
  }, [fetchGuideAiItems, UserDetail, type, Settings?.language]);

  // Use effect to update guideAi list when changes
  useEffect(() => {
    setGuideAiList(GuideAiItems);
  }, [GuideAiItems]);

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  // Functions
  const resetGuideAiSearch = () => {
    setSearchText('');
    setGuideAiList(GuideAiItems);
  };

  const searchGuideAiList = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setGuideAiList([
        ...GuideAiItems.filter((item: any) =>
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
        searchWishList={searchGuideAiList}
        setSearchText={setSearchText}
        resetSearchWishList={resetGuideAiSearch}
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
        <View style={styles.guideAiContainer}>
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
            searchViaGuideAi={searchViaGuideAi}
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
          guideAiList={guideAiList}
          navigation={navigation}
          themeColor={themeColor}
          targetScreen="AutoModelListScreen"
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
  guideAiContainer: {
    marginHorizontal: SPACING.space_20,
  },
});
