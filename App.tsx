import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {View} from 'react-native';
import {COLORS} from './src/theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {Screen} from 'react-native-screens';
import ModalScreen from './src/screens/ModalScreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaProvider>
      <AppContent></AppContent>
    </SafeAreaProvider>
  );
};

const AppContent = () => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[COLORS.bgBlackRGBA, COLORS.bgGreyRGBA]}
      style={{
        flex: 1,
        justifyContent: 'space-between',
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerMode: 'screen',
              headerShown: false,
              presentation: 'transparentModal',
              ...TransitionPresets.ModalPresentationIOS,
            }}>
            <Stack.Screen name="Tab" component={TabNavigator}></Stack.Screen>
            <Stack.Screen name="ModalScreen" component={ModalScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </GestureHandlerRootView>
    </LinearGradient>
  );
};

export default App;
