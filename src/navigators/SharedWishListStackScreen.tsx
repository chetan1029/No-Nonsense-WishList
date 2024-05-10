import React from 'react';
import SharedWishListScreen from '../screens/SharedWishListScreen';
import SharedWishListDetailScreen from '../screens/SharedWishListDetailScreen';
import {createStackNavigator} from '@react-navigation/stack';

const SharedWishListStack = createStackNavigator();

function SharedWishListStackScreen() {
  return (
    <SharedWishListStack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerShown: false,
      }}>
      <SharedWishListStack.Screen
        name="SharedWishListScreen"
        component={SharedWishListScreen}
      />
      <SharedWishListStack.Screen
        name="SharedWishListDetailScreen"
        component={SharedWishListDetailScreen}
      />
    </SharedWishListStack.Navigator>
  );
}

export default SharedWishListStackScreen;
