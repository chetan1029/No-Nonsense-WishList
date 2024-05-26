import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import SharedWishListCard from './SharedWishListCard';
import EmptySharedWishList from './EmptySharedWishList';

interface SharedWishListFlatListProps {
  ListRef: any;
  sharedWishList: any;
  tabBarHeight: any;
  onRefresh: () => void; // callback for refresh
  refreshing: boolean; // indicator for refreshing
  navigation: any;
  themeColor: any;
  placeholder: string;
  t: any;
}

const SharedWishListFlatList: React.FC<SharedWishListFlatListProps> = ({
  ListRef,
  sharedWishList,
  tabBarHeight,
  onRefresh,
  refreshing,
  navigation,
  themeColor,
  placeholder,
  t,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <FlatList
      ref={ListRef}
      horizontal={false}
      ListEmptyComponent={
        <EmptySharedWishList title={t('inviteYourFriends')} />
      }
      showsVerticalScrollIndicator={false}
      data={sharedWishList}
      contentContainerStyle={styles.FlatListContainer}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        return (
          <SharedWishListCard
            id={item.id}
            categoryName={item.categoryName}
            userId={item.userId}
            userName={item.userName}
            themeColor={themeColor}
            navigation={navigation}
          />
        );
      }}
      style={{marginBottom: tabBarHeight}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title={t('pullToRefresh')}
          tintColor={themeColor.secondaryText}
          titleColor={themeColor.secondaryText}
        />
      }
    />
  );
};

export default SharedWishListFlatList;

const styles = StyleSheet.create({
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  FlatListContainer: {
    gap: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    flexGrow: 1,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.1,
  },
});
