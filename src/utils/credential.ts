import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';

// Login with Apple 
const onAppleButtonPress = async (setUserDetail: any) => {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
        }

        // Create a Firebase credential from the response
        const {identityToken, nonce, fullName} = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
        );

        // Sign the user in with the credential
        const userCredential = await auth().signInWithCredential(appleCredential);
        const {user} = userCredential;

        // Check if full name or email is missing
        if (!user.displayName || !user.email) {
        let displayName = '';
        if (fullName) {
            displayName = `${fullName.givenName} ${fullName.familyName}`;
            await user.updateProfile({
            displayName: displayName,
            });
        }

        // Update user details in store
        setUserDetail({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || displayName,
        });
        } else {
        setUserDetail({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        });
        console.log('User signed in:', user.displayName, user.email);
        }
};

// Login us a Guest User
const onContinueAsGuest = async (setUserDetail: any) => {
    const subscriber = auth().onAuthStateChanged(async user => {
            if (user) {
            await setUserDetail(user);
            } else {
            await auth()
                .signInAnonymously()
                .then(userCredential => {
                setUserDetail(userCredential.user);
                })
                .catch(error => {
                console.log(error);
                });
            }
    });
    return subscriber;
};

// Revoke Apple token account
const revokeSignInWithAppleToken = async () => {
    try {
        // Get an authorizationCode from Apple
        const {authorizationCode} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.REFRESH,
        });
    
        // Ensure Apple returned an authorizationCode
        if (!authorizationCode) {
        throw new Error('Apple Revocation failed - no authorizationCode returned');
        }
    
        // Revoke the token
        return auth().revokeToken(authorizationCode);
    }catch (error: any) {
        console.log(`Error login as Guest: ${error.message}`);
    }
};
  
// Reauthenticate with Apple
const reauthenticateWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
  
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }
  
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
  
      await auth().currentUser?.reauthenticateWithCredential(appleCredential);
    } catch (error) {
      throw new Error(`Re-authentication with Apple failed: ${error}`);
    }
};

// Linking with apple account
const linkWithApple = async (setUserDetail: any) => {
        // Perform the Apple sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identity token returned');
        }

        // Create a Firebase credential with the token
        const { identityToken, nonce, fullName } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // Link the credential to the current user
        const userCredential = await auth().currentUser?.linkWithCredential(appleCredential);

        if (!userCredential) {
            throw new Error('Linking with Apple credential failed.');
        }
        const {user} = userCredential;

        // Check if full name or email is missing
        if (!user.displayName || !user.email) {
            let displayName = '';
            if (fullName) {
            displayName = `${fullName.givenName} ${fullName.familyName}`;
            await user.updateProfile({
                displayName: displayName,
            });
            }

            // Update user details in store
            setUserDetail({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || displayName,
            });
        } else {
            setUserDetail({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            });
            console.log('User signed in:', user.displayName, user.email);
        }

      console.log('Account successfully linked with Apple!');
  };
  

export {
    onAppleButtonPress, 
    onContinueAsGuest,
    revokeSignInWithAppleToken,
    reauthenticateWithApple,
    linkWithApple
}