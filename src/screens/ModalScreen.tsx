import {
  Animated,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Share,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useCardAnimation} from '@react-navigation/stack';
import {COLORS, SPACING} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';
import {useStore} from '../store/store';
import {useOfflineStore} from '../store/offline-store';
import {useEffect, useState} from 'react';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import LoadingIndicator from '../components/LoadingIndicator';

type ItemProps = {
  itemTitle: string;
  icon: string;
  action: string;
  categoryIndex: any;
  navigation: any;
  themeColor: any;
  t: any;
  setLoading: any;
};

const Item = ({
  itemTitle,
  icon,
  action,
  categoryIndex,
  navigation,
  themeColor,
  t,
  setLoading,
}: ItemProps) => {
  // Store
  const deleteCategory = useStore((state: any) => state.deleteCategory);
  const updateCategory = useStore((state: any) => state.updateCategory);
  const UserDetail = useStore((state: any) => state.UserDetail);
  const CategoryList = useStore((state: any) => state.CategoryList);

  const handleShare = async (title: string, action: string) => {
    const categoryItem = CategoryList.find(
      (c: {name: string}) => c.name === title,
    );

    let userName = 'Anonymous';
    if (UserDetail?.displayName) {
      userName = UserDetail.displayName;
    }

    let link = '';
    if (categoryItem && categoryItem.id) {
      //link = 'wishlist://wishlist/' + userName + '/' + categoryItem.id + '/' + categoryItem.name;
      link =
        'https://wishlist-338a1.web.app/wishlist/' +
        userName +
        '/' +
        categoryItem.id +
        '/' +
        categoryItem.name;
    }
    if (action == 'share') {
      try {
        const shareOptions = {
          url: link,
        };

        const result = await Share.share(shareOptions);

        if (result.action === Share.sharedAction) {
          console.log('Shared successfully');
        } else if (result.action === Share.dismissedAction) {
          console.log('Share cancelled');
        }
      } catch (error: any) {
        console.error('Error sharing:', error.message);
      }
      navigation.goBack();
    } else if (action === 'edit') {
      // Implement edit category logic here
      Alert.prompt(
        t('editCategory'),
        t('newCategoryName'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('save'),
            onPress: async newCategory => {
              setLoading(true);
              await updateCategory(title, newCategory, UserDetail);
              setLoading(false);
              navigation.navigate('WishList', {
                category: newCategory,
              });
            },
          },
        ],
        'plain-text', // Specify the input type
        title, // Default value for the input field
      );
    } else if (action === 'delete') {
      // Implement delete category logic here
      Alert.alert(t('confirmation'), t('wannaDeleteCategory', {title}), [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await deleteCategory(title, UserDetail);
            setLoading(false);
            navigation.navigate('WishList', {
              index: 0,
            });
          },
        },
      ]);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handleShare(categoryIndex.category, action)}>
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

function ModalScreen({navigation, route}: any) {
  // state
  const {current} = useCardAnimation();
  const categoryIndex = route?.params?.categoryIndex;
  const [loading, setLoading] = useState(false);

  // store
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const Settings = useOfflineStore((state: any) => state.Settings);

  // const
  const {t} = useTranslation();

  const DATA = [
    {
      id: '1',
      title: t('editCategory'),
      icon: 'edit',
      action: 'edit',
    },
    {
      id: '2',
      title: t('share'),
      icon: 'share',
      action: 'share',
    },
    {
      id: '3',
      title: t('delete'),
      icon: 'trash',
      action: 'delete',
    },
  ];

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  return (
    <View style={styles.modalContainer}>
      {/* ActivityIndicator overlay */}
      {loading && <LoadingIndicator />}
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
              action={item.action}
              categoryIndex={categoryIndex}
              navigation={navigation}
              themeColor={themeColor}
              setLoading={setLoading}
              t={t}
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

export default ModalScreen;

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
