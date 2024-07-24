import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import PlaceholderImage from './PlaceholderImage';
import {openLink} from '../utils/common';
import LoadingIndicator from './LoadingIndicator';

interface WishListCardProps {
  id: string;
  index: number;
  title: string;
  image: string;
  price: any;
  comment: string;
  url: string;
  themeColor: any;
  t: any;
  scrapedStatus?: boolean;
}

const WishListCard: React.FC<WishListCardProps> = ({
  id,
  index,
  title,
  image,
  price,
  comment,
  url,
  themeColor,
  t,
  scrapedStatus = true,
}) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => openLink(url)}
        style={[
          styles.CardLinearGradient,
          {backgroundColor: themeColor.priamryDarkBg},
        ]}>
        <View style={styles.CardInfoContainer}>
          <View style={styles.CardImageInfoContainer}>
            {image ? (
              <Image
                source={{uri: image}}
                style={styles.Image}
                resizeMode="contain"
              />
            ) : (
              <PlaceholderImage />
            )}
            <View style={styles.CardDetailInfoContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.CardTitle, {color: themeColor.secondaryText}]}>
                {title}
              </Text>
              <Text style={styles.CardCurrency}>
                {price ? (
                  <Text style={{color: themeColor.secondaryText}}>
                    Price: {price}
                    {comment ? ',' : ''}
                  </Text>
                ) : (
                  <></>
                )}
                <Text style={{color: themeColor.secondaryText}}>
                  {price ? ' ' : ''}
                  {comment}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
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

export default memo(WishListCard);
