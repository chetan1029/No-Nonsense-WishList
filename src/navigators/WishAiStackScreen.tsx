import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WishAiScreen from '../screens/WishAiScreen';
import WishAiDetailScreen from '../screens/WishAiDetailScreen';

const WishAiStack = createStackNavigator();

function WishAiStackScreen() {
  return (
    <WishAiStack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerShown: false,
      }}>
      <WishAiStack.Screen
        name="WishAiScreen"
        component={WishAiScreen}
        initialParams={{type: 'general'}}
      />
      <WishAiStack.Screen
        name="WishAiDetailScreen"
        component={WishAiDetailScreen}
      />
    </WishAiStack.Navigator>
  );
}

export default WishAiStackScreen;
