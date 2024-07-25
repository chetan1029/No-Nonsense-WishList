import remoteConfig from '@react-native-firebase/remote-config';

remoteConfig()
  .setDefaults({
    ai_keywords: JSON.stringify(['tire', 'pressure']),
})

export { remoteConfig };

