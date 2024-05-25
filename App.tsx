import React, {useEffect, useReducer, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './src/navigators/TabNavigator';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import ModalScreen from './src/screens/ModalScreen';
import auth from '@react-native-firebase/auth';
import {useStore} from './src/store/store';
import {useOfflineStore} from './src/store/offline-store';
import SharedModalScreen from './src/screens/SharedModalScreen';
import {Text} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

// Linking logic
const linking = {
  prefixes: ['wishlist://', 'https://sports-afaf5.web.app'],
  config: {
    screens: {
      Tab: {
        screens: {
          Friends: {
            screens: {
              SharedWishListScreen: 'wishlist/:categoryId/:name',
            },
          },
        },
      },
    },
  },
};

const App = () => {
  // state
  const [userLogin, setUserLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // store
  const UserDetail = useStore((state: any) => state.UserDetail);
  const setUserDetail = useStore((state: any) => state.setUserDetail);

  // use Effect to show Splash screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Signing in Anonymously user
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        await setUserDetail(user);
        setUserLogin(true);
      } else {
        await setUserDetail(null);
        setUserLogin(false);
      }
      setLoading(false);
    });
    return subscriber;
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppContent isUserLogin={userLogin}></AppContent>
    </SafeAreaProvider>
  );
};

const AppContent = ({isUserLogin}: any) => {
  // store
  const themeColor = useOfflineStore((state: any) => state.themeColor);
  const insets = useSafeAreaInsets();
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

export default App;
