import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{animation: 'slide_from_bottom'}}></Stack.Screen>
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{animation: 'slide_from_bottom'}}></Stack.Screen>
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;
