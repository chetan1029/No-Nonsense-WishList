# Getting Started

## Step 1: Start your Application

### For Android

# using npm

npm run android

### For iOS

# using npm

npm run ios

# using specific emulator

npm run ios -- --simulator="iPhone SE (3rd generation)"

# For iOS Setup

while adding custom icon with react native vector icons in project it doesn't work with the iOS simulator because we have to link the icon file. this guide https://three29.com/how-to-use-react-native-vector-icons-to-add-custom-icons-to-a-react-native-app/ mention how to set it up nicely. only follow "IOS" section.
if you get pods error make sure you check your targets-> project -> build Phase -> Copy bundle resource and delete the font you added

https://www.youtube.com/watch?v=W1Co2M-gsQE&t=1831s
https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae
https://github.com/crazycodeboy/react-native-splash-screen/issues/619

# Error handling

1. some time we can get pod install problem via flipper so read this and try step 1 & 2 https://stackoverflow.com/questions/78244457/reactnative-app-build-failing-with-flipper-error
   instead cd ios && pod install use cd ios && NO_FLIPPER=1 pod install

2. Sometime afer updaet you might get an error about provisioning profile so just connect your iphone and run on that it will solve this issue.

3. Logout / revoke apple account need different permissions please follow this https://www.youtube.com/watch?v=U1PIrZBgv0U

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
10. after install react-native-firebase and build application give me pod install problem for flipper.
11. anonymously login
12. Modal screen to load up and cover the screen plus it should close if you click on the screen
13. Tab with an extra page to navigate.
14. Implementation of Internationalazation and Theme control with dark and light theme.
15. DeepLinking so when you share a link it should open in the app.
16. DeepLinking give a web app link so app exists it open other open in the website

# TODO

1. Need to test network connectivity in the live device test.

## Deeplinking

https://developer.apple.com/documentation/Xcode/supporting-associated-domains
we need two part to implement deeplinking

1. Add in the app
   1.1 Open you project in xcode -> inside target -> signing and capabilities -> add 'Associated Domain'
   1.2 Enter value for domain like (applinks:wishlist-338a1.web.app for applinks) and (webcredentials:wishlist-338a1.web.app if you have any webcredentials)
   1.3 change domain into your APP.tsx where you manage linking of your app.
2. Add file to the web domain
   2.1 As above link create file name called "apple-app-site-association" without any extension and put below content in it.

```
{
  "applinks": {
      "details": [
           {
             "appIDs": [ "427784E4AN.org.reactjs.native.example.my-wishlist"],
             "components": [
               {
                  "#": "no_universal_links",
                  "exclude": true,
                  "comment": "Matches any URL with a fragment that equals no_universal_links and instructs the system not to open it as a universal link."
               },
               {
                  "/": "/wishlist/*",
                  "comment": "Matches any URL with a path that starts with /wishlist/."
               }
             ]
           }
       ]
   },
   "webcredentials": {
      "apps": [ "427784E4AN.org.reactjs.native.example.my-wishlist" ]
   }
}
```

As you see we have appIds - "427784E4AN.org.reactjs.native.example.my-wishlist" so 427784E4AN is a appId and org.reactjs.native.example.my-wishlist is a bundle id from the apple developer account for the app.

2.2 Upload file into a parent folder for next.js its public insdide a folder name .well-known.

# deploy Application

1. Xcode -> Product -> Archive
