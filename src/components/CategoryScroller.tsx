import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
} from 'react-native';
import React from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';

interface CategoryScrollerProps {
  categories: any;
  ListRef: any;
  categoryIndex: any;
  setCategoryIndex: any;
  setSortedWishList: any;
  getWishListByCategory: any;
  WishListItems: any;
  onCategorySelectionDebounced: any;
}

const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  categories,
  ListRef,
  categoryIndex,
  setCategoryIndex,
  setSortedWishList,
  getWishListByCategory,
  WishListItems,
  onCategorySelectionDebounced,
}) => {
  return (
    <View style={styles.CategoryViewStyle}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.CategoryScrollViewStyle}>
        {categories.map((data: any, index: any) => (
          <View
            key={index.toString()}
            style={styles.CategoryScrollViewContainer}>
            <TouchableOpacity
              style={styles.CategoryScrollViewItem}
              onPress={() =>
                categoryIndex.index == index
                  ? {}
                  : onCategorySelectionDebounced(
                      index,
                      categories[index],
                      ListRef,
                      setCategoryIndex,
                      setSortedWishList,
                      getWishListByCategory,
                      WishListItems,
                    )
              }>
              <Text
                style={[
                  styles.CategoryText,
                  categoryIndex.index == index
                    ? {color: COLORS.primaryOrangeHex}
                    : {},
                ]}>
                {data}
              </Text>
              {categoryIndex.index == index ? (
                <View style={styles.ActiveCategory} />
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryScroller;

const styles = StyleSheet.create({
  CategoryViewStyle: {
    height: SPACING.space_20 * 1.8,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
});
