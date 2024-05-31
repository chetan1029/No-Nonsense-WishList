import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import ModalScreen from '../screens/ModalScreen';
import {useOfflineStore} from '../store/offline-store';
import SharedModalScreen from '../screens/SharedModalScreen';
import {Text} from 'react-native';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

// Linking logic
const linking = {
  prefixes: ['wishlist://', 'https://wishlist-338a1.web.app/'],
  config: {
    screens: {
      Tab: {
        screens: {
          Friends: {
            screens: {
              SharedWishListScreen: 'wishlist/:userName/:categoryId/:name',
            },
          },
        },
      },
    },
  },
};

const AppRoutes = ({isUserLogin}: any) => {
  // store
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  return (
    <LinearGradient
      colors={[themeColor.primaryBg, themeColor.primaryBg]}
      style={{
        flex: 1,
        justifyContent: 'space-between',
        // Paddings to handle safe area
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer
          linking={linking} // Error due to formating but it still works
          fallback={<Text>Loading...</Text>}>
          <Stack.Navigator>
            {!isUserLogin ? (
              <Stack.Group
                screenOptions={{
                  headerMode: 'screen',
                  headerShown: false,
                }}>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
              </Stack.Group>
            ) : (
              <Stack.Group
                screenOptions={{
                  headerMode: 'screen',
                  headerShown: false,
                  presentation: 'transparentModal',
                  ...TransitionPresets.ModalPresentationIOS,
                }}>
                <Stack.Screen
                  name="Tab"
                  component={TabNavigator}></Stack.Screen>
                <Stack.Screen name="ModalScreen" component={ModalScreen} />
                <Stack.Screen
                  name="SharedModalScreen"
                  component={SharedModalScreen}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </GestureHandlerRootView>
    </LinearGradient>
  );
};

export default AppRoutes;
