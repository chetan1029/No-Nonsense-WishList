import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcon from '../components/CustomIcon';

interface SearchBarProp {
  searchText: string;
  searchWishList: any;
  setSearchText: any;
  resetSearchWishList: any;
}

const SearchBar: React.FC<SearchBarProp> = ({
  searchText,
  searchWishList,
  setSearchText,
  resetSearchWishList,
}) => {
  return (
    <View style={styles.InputContainerComponent}>
      <TouchableOpacity
        onPress={() => {
          searchWishList(searchText);
        }}>
        <CustomIcon
          style={styles.InputIcon}
          name="search"
          size={FONTSIZE.size_18}
          color={
            searchText.length > 0
              ? COLORS.primaryOrangeHex
              : COLORS.primaryLightGreyHex
          }
        />
      </TouchableOpacity>
      <TextInput
        placeholder="Find Your Wish..."
        placeholderTextColor={COLORS.primaryLightGreyHex}
        style={styles.TextInputContainer}
        onChangeText={text => {
          setSearchText(text);
          searchWishList(text);
        }}
        value={searchText}
      />
      {searchText.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            resetSearchWishList();
          }}>
          <CustomIcon
            style={styles.InputIcon}
            name="close"
            size={FONTSIZE.size_16}
            color={COLORS.primaryLightGreyHex}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 2.5,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
});
