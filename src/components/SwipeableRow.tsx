import React, {RefObject, forwardRef, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  I18nManager,
  Linking,
  Share,
  Alert,
} from 'react-native';

import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {BORDERRADIUS, COLORS} from '../theme/theme';
import Feather from 'react-native-vector-icons/Feather';
import {useStore} from '../store/store';
import Toast from 'react-native-toast-message';

interface SwipeableRowProps {
  children: any;
  id: string;
  index: number;
  title: string;
  url: string;
  leftSwipeIcon: string;
  onSwipeableOpen: (direction: string, id: string, title: string) => void;
  screenType: string;
  t: any;
  ref: any;
}

const SwipeableRow: React.FC<SwipeableRowProps> = forwardRef(
  (
    {
      children,
      id,
      index,
      title,
      url,
      leftSwipeIcon,
      onSwipeableOpen,
      screenType,
      t,
    },
    ref: any,
  ) => {
    const swipeRef = useRef<Swipeable>(null);

    // store
    const deleteFromWishList = useStore(
      (state: any) => state.deleteFromWishList,
    );
    const UserDetail = useStore((state: any) => state.UserDetail);

    const showToast = (message: any) => {
      Toast.show({
        type: 'error',
        text1: message,
        visibilityTime: 1000, // Duration in milliseconds
        position: 'bottom', // You can use 'top' or 'bottom'
      });
    };

    const renderLeftActions = (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>,
    ) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });

      return (
        <RectButton style={styles.leftAction} onEnded={close}>
          <Animated.Text
            style={[styles.actionText, {transform: [{translateX: trans}]}]}>
            <Feather
              name={leftSwipeIcon}
              size={20}
              color={COLORS.primaryWhiteHex}
            />
          </Animated.Text>
        </RectButton>
      );
    };

    const renderRightAction = (
      onHandle: any,
      icon: string,
      color: string,
      x: number,
      progress: Animated.AnimatedInterpolation<number>,
    ) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });

      return (
        <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
          <RectButton
            style={[
              styles.rightAction,
              {
                backgroundColor: color,
              },
            ]}
            onPress={onHandle}>
            <Text style={styles.actionText}>
              <Feather name={icon} size={20} color={COLORS.primaryWhiteHex} />
            </Text>
          </RectButton>
        </Animated.View>
      );
    };

    const renderRightActions = (
      progressAnimatedValue: Animated.AnimatedInterpolation<number>,
      dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    ) => {
      const rightActions = [
        renderRightAction(
          openLink,
          'external-link',
          COLORS.primaryLightGreyHex,
          192,
          progressAnimatedValue,
        ),
        renderRightAction(
          handleShare,
          'share',
          COLORS.primaryOrangeHex,
          128,
          progressAnimatedValue,
        ),
        renderRightAction(
          handleDelete,
          'trash',
          COLORS.primaryRedHex,
          64,
          progressAnimatedValue,
        ),
        // Add more actions as needed
      ];

      return (
        <View style={styles.rightActionRow}>
          {rightActions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </View>
      );
    };

    const renderSharedRightActions = (
      progressAnimatedValue: Animated.AnimatedInterpolation<number>,
      dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    ) => {
      const rightActions = [
        renderRightAction(
          openLink,
          'external-link',
          COLORS.primaryOrangeHex,
          192,
          progressAnimatedValue,
        ),
        // Add more actions as needed
      ];

      return (
        <View style={styles.rightActionRow}>
          {rightActions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </View>
      );
    };

    const handleSwipeableWillOpen = () => {
      if (ref && ref.current !== null) {
        if (ref.current !== swipeRef.current) {
          ref.current?.close();
        }
      }
    };

    const close = () => {
      swipeRef.current?.close();
    };

    const openLink = async () => {
      if (url) {
        Linking.canOpenURL(url)
          .then(supported => {
            if (supported) {
              // Open the URL in the browser
              Linking.openURL(url);
            } else {
              console.error("Don't know how to open URI: " + url);
            }
          })
          .catch(err => console.error('An error occurred', err));
      }
      close();
    };

    const handleShare = async () => {
      try {
        const shareOptions = {
          message: title,
          url: url,
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
      close();
    };

    const handleDelete = async () => {
      // Implement delete category logic here
      Alert.alert(t('confirmation'), t('wannaDeleteItem'), [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            try {
              deleteFromWishList(id, UserDetail);
              showToast(t('isDeleted', {title}));
            } catch (error: any) {
              console.error('Error Deleting:', error.message);
            }
          },
        },
      ]);
      close();
    };

    if (screenType == 'WishList') {
      return (
        <Swipeable
          ref={swipeRef}
          onSwipeableWillOpen={handleSwipeableWillOpen}
          key={id}
          friction={2}
          leftThreshold={120}
          rightThreshold={0}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          onSwipeableOpen={direction => {
            ref.current = swipeRef.current;
            if (direction == 'left') {
              onSwipeableOpen(direction, id, title);
              //close();
            }
          }}>
          {children}
        </Swipeable>
      );
    } else {
      return (
        <Swipeable
          ref={swipeRef}
          onSwipeableWillOpen={handleSwipeableWillOpen}
          key={id}
          friction={2}
          rightThreshold={0}
          renderRightActions={renderSharedRightActions}
          onSwipeableOpen={direction => {
            ref.current = swipeRef.current;
          }}>
          {children}
        </Swipeable>
      );
    }
  },
);

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
    borderRadius: BORDERRADIUS.radius_15,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rightActionRow: {
    width: 192,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    overflow: 'hidden',
    borderTopRightRadius: BORDERRADIUS.radius_15,
    borderBottomRightRadius: BORDERRADIUS.radius_15,
  },
});

export default SwipeableRow;
