import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {useStore} from './src/store/store';
import AppRoutes from './src/navigators/AppRoutes';

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
      if (loading) setLoading(false);
    });
    return () => subscriber();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppRoutes isUserLogin={userLogin}></AppRoutes>
    </SafeAreaProvider>
  );
};

export default App;
