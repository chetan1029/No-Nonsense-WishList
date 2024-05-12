import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import WishListCard from '../components/WishListCard';
import SwipeableRow from '../components/SwipeableRow';
import Feather from 'react-native-vector-icons/Feather';
import {Swipeable} from 'react-native-gesture-handler';
import EmptyListAnimation from './EmptyListAnimation';

interface WishListFlatListProps {
  ListRef: any;
  categoryIndex?: any;
  sortedWishList: any;
  handleSwipeableOpen: any;
  tabBarHeight: any;
  leftSwipeIcon: string;
  onRefresh: () => void; // callback for refresh
  refreshing: boolean; // indicator for refreshing
  showMoreModal: boolean;
  navigation: any;
  themeColor: any;
  screenType: string;
  t: any;
}

const WishListFlatList: React.FC<WishListFlatListProps> = ({
  ListRef,
  categoryIndex,
  sortedWishList,
  handleSwipeableOpen,
  tabBarHeight,
  leftSwipeIcon,
  onRefresh,
  refreshing,
  showMoreModal,
  navigation,
  themeColor,
  screenType,
  t,
}) => {
  const swipeRowRef = useRef<Swipeable>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.dropdownButtonContainer}>
      {showMoreModal && categoryIndex?.category && (
        <TouchableOpacity
          onPress={() => {
            screenType === 'WishList'
              ? navigation.navigate(
                  'ModalScreen',
                  {categoryIndex: categoryIndex},
                  onRefresh,
                )
              : navigation.navigate(
                  'SharedModalScreen',
                  {categoryIndex: categoryIndex},
                  onRefresh,
                );
          }}
          style={styles.showMoreIcon}>
          <Feather
            name="more-horizontal"
            size={24}
            color={themeColor.secondaryText}
          />
        </TouchableOpacity>
      )}
      <FlatList
        ref={ListRef}
        horizontal={false}
        ListEmptyComponent={<EmptyListAnimation title={t('noWishlistItems')} />}
        showsVerticalScrollIndicator={false}
        data={sortedWishList}
        contentContainerStyle={styles.FlatListContainer}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <SwipeableRow
              ref={swipeRowRef}
              id={item.id}
              index={item.index}
              title={item.title}
              url={item.url}
              leftSwipeIcon={leftSwipeIcon}
              onSwipeableOpen={handleSwipeableOpen}
              screenType={screenType}
              t={t}>
              <WishListCard
                id={item.id}
                index={item.index}
                image={item.image}
                title={item.title ? item.title : item.url}
                price={item.price}
                themeColor={themeColor}
              />
            </SwipeableRow>
          );
        }}
        style={{marginBottom: tabBarHeight * 2}}
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
    </View>
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
    gap: SPACING.space_10,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    flexGrow: 1,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.1,
  },
  dropdownButtonContainer: {
    alignItems: 'flex-end',
  },
  showMoreIcon: {
    paddingHorizontal: SPACING.space_20,
  },
});
