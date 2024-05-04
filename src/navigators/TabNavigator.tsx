import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTSIZE, SPACING} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import PurchaseScreen from '../screens/PurchaseScreen';
import AddWishListScreen from '../screens/AddWishScreen';
import WishListScreen from '../screens/WishListScreen';
import Feather from 'react-native-vector-icons/Feather';
import SettingScreen from '../screens/SettingScreen';
import 'intl-pluralrules';
import {useTranslation} from 'react-i18next';
import i18n from '../utils/i18n';
import {useOfflineStore} from '../store/offline-store';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabNavigator = ({route, navigation}: any) => {
  // Store
  const Settings = useOfflineStore((state: any) => state.Settings);
  const themeColor = useOfflineStore((state: any) => state.themeColor);

  // Const
  const {t} = useTranslation();

  const insets = useSafeAreaInsets();

  // Get the name of the focused route
  const focusedRoute = getFocusedRouteNameFromRoute(route);
  const routeName = focusedRoute ? focusedRoute : 'AddWishList';

  // use effect to use language
  useEffect(() => {
    if (Settings.language) {
      i18n.changeLanguage(Settings.language);
    }
  }, [Settings]);

  return (
    <View
      style={{
        backgroundColor: themeColor.primaryBg,
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: insets.top,
        paddingBottom: 0, // make bottom safe area padding (insets.bottom) 0
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <Tab.Navigator
        initialRouteName="AddWishList"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          tabBarStyle: [
            styles.tabBarStyle,
            {
              backgroundColor: themeColor.priamryDarkBg,
            },
          ],
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
                        ? themeColor.primaryTextFocus
                        : themeColor.primaryText,
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
                  size={28}
                  color={
                    focused
                      ? themeColor.primaryTextFocus
                      : themeColor.primaryText
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
                        ? themeColor.primaryTextFocus
                        : themeColor.primaryText,
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
                  size={28}
                  color={
                    focused
                      ? themeColor.primaryTextFocus
                      : themeColor.primaryText
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
                    focused
                      ? themeColor.primaryTextFocus
                      : themeColor.primaryText
                  }
                  style={{
                    top: -30,
                  }}
                />
              );
            },
          }}></Tab.Screen>
        <Tab.Screen
          name="Friends"
          component={SettingScreen}
          options={{
            tabBarLabel: ({focused, color}) => {
              return (
                <Text
                  style={[
                    styles.tabBarLabel,
                    {
                      color: focused
                        ? themeColor.primaryTextFocus
                        : themeColor.primaryText,
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
                  size={28}
                  color={
                    focused
                      ? themeColor.primaryTextFocus
                      : themeColor.primaryText
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
                        ? themeColor.primaryTextFocus
                        : themeColor.primaryText,
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
                  size={28}
                  color={
                    focused
                      ? themeColor.primaryTextFocus
                      : themeColor.primaryText
                  }
                />
              );
            },
          }}></Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 90,
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 0, // for iOS
    },
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
