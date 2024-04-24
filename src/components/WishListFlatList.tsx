import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import WishListCard from '../components/WishListCard';
import SwipeableRow from '../components/SwipeableRow';

interface WishListFlatListProps {
  ListRef: any;
  categoryIndex: any;
  sortedWishList: any;
  handleSwipeableOpen: any;
  tabBarHeight: any;
  leftSwipeIcon: string;
  onRefresh: () => void; // callback for refresh
  refreshing: boolean; // indicator for refreshing
}

const WishListFlatList: React.FC<WishListFlatListProps> = ({
  ListRef,
  sortedWishList,
  handleSwipeableOpen,
  tabBarHeight,
  leftSwipeIcon,
  onRefresh,
  refreshing,
}) => {
  return (
    <FlatList
      ref={ListRef}
      horizontal={false}
      ListEmptyComponent={
        <View style={styles.EmptyListContainer}>
          <Text style={styles.CategoryText}>No WishList Item Available</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      data={sortedWishList}
      contentContainerStyle={styles.FlatListContainer}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        return (
          <SwipeableRow
            id={item.id}
            index={item.index}
            title={item.title}
            url={item.url}
            leftSwipeIcon={leftSwipeIcon}
            onSwipeableOpen={handleSwipeableOpen}>
            <WishListCard
              id={item.id}
              index={item.index}
              image={item.image}
              title={item.title ? item.title : item.url}
              price={item.price}
            />
          </SwipeableRow>
        );
      }}
      style={{marginBottom: tabBarHeight}}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primaryWhiteHex} />
        ) : null
      }
    />
  );
};

export default WishListFlatList;

const styles = StyleSheet.create({
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  FlatListContainer: {
    gap: SPACING.space_15,
    paddingVertical: SPACING.space_15,
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
