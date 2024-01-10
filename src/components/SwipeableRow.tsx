import React, {useRef} from 'react';
import {Animated, StyleSheet, Text, View, I18nManager} from 'react-native';

import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {BORDERRADIUS, COLORS} from '../theme/theme';
import CustomIcon from './CustomIcon';
import Feather from 'react-native-vector-icons/Feather';

interface SwipeableRowProps {
  children: any;
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({children}) => {
  const swipeableRowRef = useRef<Swipeable>(null);

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <RectButton style={styles.leftAction} onPress={close}>
        <Animated.Text
          style={[styles.actionText, {transform: [{translateX: trans}]}]}>
          <CustomIcon name="cart" size={20} color={COLORS.primaryWhiteHex} />
        </Animated.Text>
      </RectButton>
    );
  };

  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {
      close();
      console.log(text);
    };

    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton
          style={[
            styles.rightAction,
            {
              backgroundColor: color,
            },
          ]}
          onPress={pressHandler}>
          <Text style={styles.actionText}>
            <Feather name={text} size={20} color={COLORS.primaryWhiteHex} />
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
        'external-link',
        COLORS.primaryLightGreyHex,
        192,
        progressAnimatedValue,
      ),
      renderRightAction(
        'share',
        COLORS.primaryOrangeHex,
        128,
        progressAnimatedValue,
      ),
      renderRightAction(
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

  const close = () => {
    swipeableRowRef.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRowRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};

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
