import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTSIZE, SPACING} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import PurchaseScreen from '../screens/PurchaseScreen';
import AddWishListScreen from '../screens/AddWishScreen';
import WishListScreen from '../screens/WishListScreen';
import Feather from 'react-native-vector-icons/Feather';
import AddWishListScreenExtra from '../screens/AddWishScreenExtra';
import SettingScreen from '../screens/SettingScreen';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import {useOfflineStore} from '../store/offline-store';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // Store
  const Settings = useOfflineStore((state: any) => state.Settings);
  const ThemeColor = useOfflineStore((state: any) => state.ThemeColor);

  // Const
  const {t} = useTranslation();

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  return (
    <Tab.Navigator
      initialRouteName="AddWishList"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarStyle: [
          styles.tabBarStyle,
          {backgroundColor: COLORS.primaryBlackRGBA},
        ],
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
                    paddingTop: -5,
                  },
                ]}>
                {t('wishlists')}
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
                {t('purchase')}
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
                {t('friends')}
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
        component={SettingScreen}
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
                {t('settings')}
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
