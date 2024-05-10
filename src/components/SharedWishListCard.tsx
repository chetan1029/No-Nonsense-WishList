import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {BORDERRADIUS, SPACING} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';

interface SharedWishListCardProps {
  id: string;
  categoryName: string;
  userId: any;
  themeColor: any;
  navigation: any;
}

const SharedWishListCard: React.FC<SharedWishListCardProps> = ({
  id,
  categoryName,
  userId,
  themeColor,
  navigation,
}) => {
  return (
    <TouchableOpacity
      key={id}
      onPress={() => {
        navigation.navigate('SharedWishListDetailScreen', {
          id: id,
          name: categoryName,
          userId: userId,
        });
      }}
      style={[
        styles.InputContainerComponent,
        {backgroundColor: themeColor.priamryDarkBg},
      ]}>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <Feather name="folder" size={16} color={themeColor.secondaryText} />
        </View>
        <Text style={{color: themeColor.secondaryText}}>{categoryName}</Text>
      </View>
      <Feather
        name="chevron-right"
        size={20}
        color={themeColor.secondaryText}
      />
    </TouchableOpacity>
  );
};

export default SharedWishListCard;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_20,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SPACING.space_20 * 2.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerIcon: {
    marginVertical: SPACING.space_15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    marginRight: SPACING.space_15,
    paddingVertical: SPACING.space_15,
  },
});
