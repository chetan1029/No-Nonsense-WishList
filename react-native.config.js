module.exports={
    project: {
        ios: {},
        android:{},
    },
    asserts: ['./src/assets'],
    dependencies: { // added because of pod problem in ios
        ...(process.env.NO_FLIPPER
        ? { 'react-native-flipper': { platforms: { ios: null } } }
        : {}),
      }
};
