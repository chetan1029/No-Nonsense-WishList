import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SettingScreen from '../screens/SettingScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import PurchaseScreen from '../screens/PurchaseScreen';

const SettingStack = createStackNavigator();

function SettingStackScreen() {
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerShown: false,
      }}>
      <SettingStack.Screen name="Settings" component={SettingScreen} />
      <SettingStack.Screen name="UserProfile" component={UserProfileScreen} />
      <SettingStack.Screen name="PurchaseList" component={PurchaseScreen} />
    </SettingStack.Navigator>
  );
}

export default SettingStackScreen;
