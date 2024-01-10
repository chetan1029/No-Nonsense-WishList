import React from 'react';
import {StyleSheet, Text, View, ImageProps, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  imagelink_square: ImageProps;
  price: any;
  currency: string;
}

const WishListCard: React.FC<WishListCardProps> = ({
  id,
  index,
  title,
  imagelink_square,
  price,
  currency,
}) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
      style={styles.CardLinearGradient}>
      <View style={styles.CardInfoContainer}>
        <View style={styles.CardImageInfoContainer}>
          <Image source={imagelink_square} style={styles.Image} />
          <View style={styles.CardDetailInfoContainer}>
            <Text style={styles.CardTitle}>{title}</Text>
            <Text style={styles.CardSubtitle}>{title}</Text>
            <Text style={styles.CardCurrency}>
              {currency} <Text style={styles.CardPrice}>{price}</Text>
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  CardLinearGradient: {
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_15,
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
    height: 90,
    width: 90,
    borderRadius: BORDERRADIUS.radius_15,
  },
  CardDetailInfoContainer: {
    flexDirection: 'column',
    gap: SPACING.space_10,
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  CardSubtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  CardCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
  CardPrice: {
    color: COLORS.primaryWhiteHex,
  },
});

export default WishListCard;
