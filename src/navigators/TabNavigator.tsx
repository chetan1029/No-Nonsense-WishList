import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTSIZE, SPACING} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import PurchaseScreen from '../screens/PurchaseScreen';
import AddWishListScreen from '../screens/AddWishScreen';
import WishListScreen from '../screens/WishListScreen';
import Feather from 'react-native-vector-icons/Feather';
import AddWishListScreenExtra from '../screens/AddWishScreenExtra';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="AddWishList"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarBackground: () => {
          return (
            <BlurView
              overlayColor=""
              blurAmount={15}
              style={styles.blurViewStyle}
            />
          );
        },
      }}>
      <Tab.Screen
        name="WishList"
        component={WishListScreen}
        options={{
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                style={[
                  styles.tabBarLabel,
                  {
                    color: focused
                      ? COLORS.primaryOrangeHex
                      : COLORS.primaryLightGreyHex,
                  },
                ]}>
                Wishlists
              </Text>
            );
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Feather
                name="gift"
                size={30}
                color={
                  focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                }
              />
            );
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="PurchaseList"
        component={PurchaseScreen}
        options={{
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                style={[
                  styles.tabBarLabel,
                  {
                    color: focused
                      ? COLORS.primaryOrangeHex
                      : COLORS.primaryLightGreyHex,
                  },
                ]}>
                Purchase
              </Text>
            );
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Feather
                name="shopping-bag"
                size={30}
                color={
                  focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                }
              />
            );
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="AddWishList"
        component={AddWishListScreen}
        options={{
          tabBarLabel: ({focused, color}) => {
            return '';
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Feather
                name="arrow-up-circle"
                size={50}
                color={
                  focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                }
                style={{
                  marginTop: -40,
                }}
              />
            );
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="Friends"
        component={AddWishListScreenExtra}
        options={{
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                style={[
                  styles.tabBarLabel,
                  {
                    color: focused
                      ? COLORS.primaryOrangeHex
                      : COLORS.primaryLightGreyHex,
                  },
                ]}>
                Friends
              </Text>
            );
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Feather
                name="users"
                size={30}
                color={
                  focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                }
              />
            );
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="Settings"
        component={AddWishListScreenExtra}
        options={{
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                style={[
                  styles.tabBarLabel,
                  {
                    color: focused
                      ? COLORS.primaryOrangeHex
                      : COLORS.primaryLightGreyHex,
                  },
                ]}>
                Settings
              </Text>
            );
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Feather
                name="settings"
                size={30}
                color={
                  focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                }
              />
            );
          },
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 78,
    position: 'absolute',
    backgroundColor: COLORS.primaryBlackRGBA,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
    paddingBottom: SPACING.space_16,
  },
  blurViewStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  tabBarLabel: {
    fontSize: FONTSIZE.size_12,
  },
});

export default TabNavigator;
