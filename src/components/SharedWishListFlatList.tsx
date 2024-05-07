import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import WishListCard from '../components/WishListCard';
import SwipeableRow from '../components/SwipeableRow';
import Feather from 'react-native-vector-icons/Feather';
import SharedWishListCard from './SharedWishListCard';

interface SharedWishListFlatListProps {
  ListRef: any;
  sharedWishList: any;
  tabBarHeight: any;
  onRefresh: () => void; // callback for refresh
  refreshing: boolean; // indicator for refreshing
  navigation: any;
  themeColor: any;
}

const SharedWishListFlatList: React.FC<SharedWishListFlatListProps> = ({
  ListRef,
  sharedWishList,
  tabBarHeight,
  onRefresh,
  refreshing,
  navigation,
  themeColor,
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
        <View style={styles.EmptyListContainer}>
          <Text style={styles.CategoryText}>No WishList Item Available</Text>
        </View>
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
          title="Pull to refresh"
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
