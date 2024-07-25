import {StyleSheet, View, FlatList} from 'react-native';
import React from 'react';
import {SPACING} from '../theme/theme';
import EmptyListAnimation from './EmptyListAnimation';
import WishAiCard from './WishAiCard';

interface WishAiFlatListProps {
  ListRef: any;
  guideAiList: any;
  tabBarHeight: any;
  navigation: any;
  themeColor: any;
  targetScreen: string;
  getNavigationParams: (item: any) => any;
  t: any;
  addUserTire?: any;
}

const WishAiFlatList: React.FC<WishAiFlatListProps> = ({
  ListRef,
  guideAiList,
  tabBarHeight,
  navigation,
  themeColor,
  targetScreen,
  getNavigationParams,
  t,
  addUserTire,
}) => {
  return (
    <View>
      <FlatList
        ref={ListRef}
        horizontal={false}
        ListEmptyComponent={
          <EmptyListAnimation title={t('noSearchInHistory')} />
        }
        showsVerticalScrollIndicator={false}
        data={guideAiList}
        contentContainerStyle={styles.FlatListContainer}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({item}) => {
          return (
            <WishAiCard
              themeColor={themeColor}
              navigation={navigation}
              targetScreen="WishAiDetailScreen"
              getNavigationParams={() => ({item})}
              item={item}
            />
          );
        }}
        style={{marginBottom: tabBarHeight * 2.4}}
      />
    </View>
  );
};

export default WishAiFlatList;

const styles = StyleSheet.create({
  FlatListContainer: {
    gap: SPACING.space_8,
    paddingVertical: SPACING.space_8,
    paddingHorizontal: SPACING.space_20,
    flexGrow: 1,
  },
});
