import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {BORDERRADIUS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import Markdown from 'react-native-markdown-display';
import {ScrollView} from 'react-native-gesture-handler';
import LoadingCard from './LoadingCard';

interface WishAiCardDetailProps {
  themeColor: any;
  item: any;
  tabBarHeight: any;
  t: any;
}

const WishAiDetailCard: React.FC<WishAiCardDetailProps> = ({
  themeColor,
  item,
  tabBarHeight,
  t,
}) => {
  const markdownStyles = StyleSheet.create({
    body: {
      color: themeColor.secondaryText,
      fontFamily: FONTFAMILY.poppins_medium,
      fontSize: FONTSIZE.size_14,
    },
    heading1: {
      color: themeColor.secondaryText,
      fontFamily: FONTFAMILY.poppins_bold,
      fontSize: FONTSIZE.size_18,
      marginTop: SPACING.space_10,
    },
    heading2: {
      color: themeColor.secondaryText,
      fontFamily: FONTFAMILY.poppins_semibold,
      fontSize: FONTSIZE.size_20,
    },
    list_item: {
      color: themeColor.secondaryText,
      fontFamily: FONTFAMILY.poppins_medium,
      fontSize: FONTSIZE.size_14,
      marginTop: SPACING.space_10,
    },
    code_block: {
      backgroundColor: themeColor.primaryBgLight,
      borderRadius: BORDERRADIUS.radius_4,
      padding: SPACING.space_10,
      fontFamily: 'Courier',
      fontSize: FONTSIZE.size_14,
      color: themeColor.secondaryText,
    },
    strong: {
      fontFamily: FONTFAMILY.poppins_bold,
    },
  });
  return (
    <ScrollView style={styles.ScrollView}>
      <View style={[styles.CardInfoContainer, {marginBottom: tabBarHeight}]}>
        {item?.response ? (
          <Markdown style={markdownStyles}>{item?.response}</Markdown>
        ) : (
          <LoadingCard title={item?.prompt} />
        )}
      </View>
    </ScrollView>
  );
};

export default WishAiDetailCard;

const styles = StyleSheet.create({
  CardInfoContainer: {
    flexDirection: 'column',
    paddingHorizontal: SPACING.space_20,
    flexGrow: 1,
  },
  ScrollView: {
    flexGrow: 1,
  },
});
