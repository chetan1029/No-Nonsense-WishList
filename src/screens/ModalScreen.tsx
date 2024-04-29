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
} from 'react-native';
import {useCardAnimation} from '@react-navigation/stack';
import {COLORS, SPACING} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';
import {useStore} from '../store/store';
import {update} from 'lodash';

const DATA = [
  {
    id: '1',
    title: 'Edit Category',
    icon: 'edit',
  },
  {
    id: '2',
    title: 'Share',
    icon: 'share',
  },
  {
    id: '3',
    title: 'Delete',
    icon: 'trash',
  },
];

type ItemProps = {
  itemTitle: string;
  icon: string;
  categoryIndex: any;
  navigation: any;
};

const Item = ({itemTitle, icon, categoryIndex, navigation}: ItemProps) => {
  // Store
  const deleteCategory = useStore((state: any) => state.deleteCategory);
  const updateCategory = useStore((state: any) => state.updateCategory);
  const UserDetail = useStore((state: any) => state.UserDetail);

  const handleShare = async (title: string, link: string, action: string) => {
    if (action == 'Share') {
      try {
        const shareOptions = {
          message: title,
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
    } else if (action === 'Edit Category') {
      // Implement edit category logic here
      Alert.prompt(
        'Edit Category',
        'Enter the new category name:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: newCategory => {
              updateCategory(title, newCategory, UserDetail);
            },
          },
        ],
        'plain-text', // Specify the input type
        title, // Default value for the input field
      );
    } else if (action === 'Delete') {
      // Implement delete category logic here
      Alert.alert(
        'Confirmation',
        `Are you sure you want to delete the category '${title}'?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              deleteCategory(title, UserDetail);
              navigation.goBack();
            },
          },
        ],
      );
    }
    navigation.goBack();
  };

  return (
    <TouchableOpacity
      onPress={() =>
        handleShare(categoryIndex.category, 'https://github.com', itemTitle)
      }>
      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={16} style={styles.icon} />
        </View>
        <Text style={styles.title}>{itemTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

function ModalScreen({navigation, route}: any) {
  const {current} = useCardAnimation();
  const {categoryIndex} = route.params;

  return (
    <View style={styles.modalContainer}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: COLORS.primaryBlackRGBA},
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
            />
          )}
          keyExtractor={item => item.id}
          style={styles.modelFlatList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  animatedView: {
    borderTopEndRadius: SPACING.space_16,
    borderTopStartRadius: SPACING.space_16,
    paddingHorizontal: SPACING.space_20,
    paddingBottom: SPACING.space_40,
    width: '100%',
    backgroundColor: COLORS.primaryGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modelFlatList: {
    width: '100%',
    borderRadius: SPACING.space_10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLightGreyHex,
    padding: 20,
  },
  title: {
    fontSize: 16,
    color: COLORS.primaryWhiteHex,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    color: COLORS.primaryWhiteHex,
  },
});
