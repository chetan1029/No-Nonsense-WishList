import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {BORDERRADIUS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {filterAiPrompt} from '../utils/common';

interface WishAiSearchCardProps {
  themeColor: any;
  navigation: any;
  targetScreen: string;
  getNavigationParams: (item: any, guideId: string) => any;
  item: any;
  searchViaGuideAi: any;
  userDetail: any;
  t: any;
}

const WishAiSearchCard: React.FC<WishAiSearchCardProps> = ({
  themeColor,
  navigation,
  targetScreen,
  getNavigationParams,
  item,
  searchViaGuideAi,
  userDetail,
  t,
}) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        if (await filterAiPrompt(item.prompt)) {
          const guideId = await searchViaGuideAi(
            item.prompt,
            item.type,
            userDetail,
          );
          navigation.navigate(targetScreen, getNavigationParams(item, guideId));
        } else {
          item.response = t('noKeywordMatch');
          console.log(item);
          navigation.navigate(targetScreen, {
            prompt: item.prompt,
            type: 'no-keywordMatch',
            response: item.response,
            guideId: '',
          });
        }
      }}
      style={[styles.CardLinearGradient]}>
      <View style={styles.CardInfoContainer}>
        <Text style={[styles.CardTitle, {color: themeColor.primaryTextFocus}]}>
          "{item.text}"{' '}
          {item.from == 'guide' && (
            <>
              - Search via Guide Ai{' '}
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={themeColor.primaryTextFocus}
              />
            </>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WishAiSearchCard;

const styles = StyleSheet.create({
  CardLinearGradient: {},
  CardInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
});
