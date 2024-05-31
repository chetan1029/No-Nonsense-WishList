import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {BORDERRADIUS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';

interface SharedWishListCardProps {
  id: string;
  categoryName: string;
  userId: any;
  userName: string;
  themeColor: any;
  navigation: any;
}

const SharedWishListCard: React.FC<SharedWishListCardProps> = ({
  id,
  categoryName,
  userId,
  userName,
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
        styles.CardLinearGradient,
        {backgroundColor: themeColor.priamryDarkBg},
      ]}>
      <View style={styles.CardInfoContainer}>
        <View style={styles.CardImageInfoContainer}>
          <Feather name="folder" size={35} color={themeColor.secondaryText} />
          <View style={styles.CardDetailInfoContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.CardTitle, {color: themeColor.secondaryText}]}>
              {categoryName}
            </Text>
            <Text style={styles.ByUser}>
              <Text style={{color: themeColor.secondaryText}}>
                By {userName}
              </Text>
            </Text>
          </View>
        </View>
        <Feather
          name="chevron-right"
          size={30}
          color={themeColor.secondaryText}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SharedWishListCard;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  CardLinearGradient: {
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
  },
  CardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CardImageInfoContainer: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    alignItems: 'center',
  },
  CardDetailInfoContainer: {
    flexDirection: 'column',
    gap: SPACING.space_4,
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    maxWidth: '100%',
  },
  ByUser: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_12,
  },
});
