This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

### Important Setup notes

# For iOS Setup

while adding custom icon with react native vector icons in project it doesn't work with the iOS simulator because we have to link the icon file. this guide https://three29.com/how-to-use-react-native-vector-icons-to-add-custom-icons-to-a-react-native-app/ mention how to set it up nicely. only follow "IOS" section.
if you get pods error make sure you check your targets-> project -> build Phase -> Copy bundle resource and delete the font you added

https://www.youtube.com/watch?v=W1Co2M-gsQE&t=1831s
https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae
https://github.com/crazycodeboy/react-native-splash-screen/issues/619

# To run on your iphone

xcode -> windows -> device and simulator -> add device
xcode -> your project name -> signing and capabities (near general tab) -> choose team
xcode -> build -> select device and run

# Problems I faced

1. It was taking a while for wishlist to load so I added loading bar
2. While adding wishlist it will go and scrap title so I wanted to show Activity indicator but on top of the form.
3. Double clicking on category name load nothing. (need to implement debouncing for that)
4. Implemeted safe area and setup gradiant color because we have two different color on header and footer of the screen.
5. Added custom icon from Feather.
6. Click on input field show keyboard but input hide behind it so implemented that.
7. Implemented push down to refresh on flatlist.
8. If list is not full page pull down to refresh doens't work.
9. If you do pulldown to refresh on one cateogory it will reload and open the first category by default.
