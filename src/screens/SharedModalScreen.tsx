import {
  Animated,
  View,
  Text,
  Pressable,
  Button,
  StyleSheet,
  FlatList,
  Share,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useCardAnimation} from '@react-navigation/stack';
import {COLORS, SPACING} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';
import {useStore} from '../store/store';
import {useOfflineStore} from '../store/offline-store';

const DATA = [
  {
    id: '1',
    title: 'Remove WishList',
    icon: 'trash',
  },
];

type ItemProps = {
  itemTitle: string;
  icon: string;
  categoryIndex: any;
  navigation: any;
  themeColor: any;
};

const Item = ({
  itemTitle,
  icon,
  categoryIndex,
  navigation,
  themeColor,
}: ItemProps) => {
  // Store
  const removeFromSharedWishList = useStore(
    (state: any) => state.removeFromSharedWishList,
  );
  const UserDetail = useStore((state: any) => state.UserDetail);

  const handleAction = async (
    title: string,
    action: string,
    sharedWishListId: string,
  ) => {
    if (action === 'Remove WishList') {
      // Implement delete category logic here
      Alert.alert(
        'Confirmation',
        `Are you sure you want to remove '${title}' WishList?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: async () => {
              await removeFromSharedWishList(UserDetail, sharedWishListId);
              navigation.navigate('SharedWishListScreen');
            },
          },
        ],
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        handleAction(
          categoryIndex.category,
          itemTitle,
          categoryIndex.sharedWishListId,
        )
      }>
      <View style={[styles.item, {backgroundColor: themeColor.priamryDarkBg}]}>
        <View style={styles.iconContainer}>
          <Feather
            name={icon}
            size={16}
            style={{color: themeColor.secondaryText}}
          />
        </View>
        <Text style={[styles.title, {color: themeColor.secondaryText}]}>
          {itemTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function SharedModalScreen({navigation, route}: any) {
  const {current} = useCardAnimation();
  const categoryIndex = route?.params?.categoryIndex;
  const themeColor = useOfflineStore((state: any) => state.themeColor);

  return (
    <View style={styles.modalContainer}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: themeColor.primaryBgOpacity5},
        ]}
        onPress={navigation.goBack}
      />

      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
            backgroundColor: themeColor.primaryBgLight,
          },
        ]}>
        <Feather name="minus" size={30} color={COLORS.primaryLightGreyHex} />
        <FlatList
          data={DATA}
          renderItem={({item}) => (
            <Item
              itemTitle={item.title}
              icon={item.icon}
              categoryIndex={categoryIndex}
              navigation={navigation}
              themeColor={themeColor}
            />
          )}
          keyExtractor={item => item.id}
          style={styles.modelFlatList}
          ItemSeparatorComponent={() => (
            <View
              style={[
                styles.separator,
                {backgroundColor: themeColor.primaryBg},
              ]}
            />
          )}
        />
      </Animated.View>
    </View>
  );
}

export default SharedModalScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    borderTopEndRadius: SPACING.space_16,
    borderTopStartRadius: SPACING.space_16,
    paddingHorizontal: SPACING.space_20,
    paddingBottom: SPACING.space_40 * 2,
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  modelFlatList: {
    width: '100%',
    borderRadius: SPACING.space_10,
    marginTop: SPACING.space_20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 20,
  },
  title: {
    fontSize: 16,
  },
  separator: {
    height: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
});
