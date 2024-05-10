import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';

interface WishListCardProps {
  id: string;
  index: number;
  title: string;
  image: string;
  price: any;
  themeColor: any;
}

const WishListCard: React.FC<WishListCardProps> = ({
  id,
  index,
  title,
  image,
  price,
  themeColor,
}) => {
  return (
    <View
      style={[
        styles.CardLinearGradient,
        {backgroundColor: themeColor.priamryDarkBg},
      ]}>
      <View style={styles.CardInfoContainer}>
        <View style={styles.CardImageInfoContainer}>
          <Image source={{uri: image}} style={styles.Image} />
          <View style={styles.CardDetailInfoContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.CardTitle, {color: themeColor.secondaryText}]}>
              {title}
            </Text>
            <Text style={styles.CardCurrency}>
              <Text style={{color: themeColor.secondaryText}}>{price}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CardLinearGradient: {
    padding: SPACING.space_10,
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
  Image: {
    height: 70,
    width: 70,
    borderRadius: BORDERRADIUS.radius_15,
  },
  CardDetailInfoContainer: {
    flexDirection: 'column',
    gap: SPACING.space_10,
    maxWidth: Dimensions.get('window').width - 150,
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,

    maxWidth: '100%',
  },
  CardCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryOrangeHex,
  },
});

export default WishListCard;
