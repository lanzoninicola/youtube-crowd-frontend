import Router from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

import { UserInfoWithToken } from "./auth.interface";
import { createUser } from "./db";
import firebase from "./firebase";

const authContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

/**
 * @description useProvideAuth - Hook to get the current user and sign in/out functionality
 *
 * @returns {object} { user, loading,  signinWithEmail, signinWithGoogle, signout }
 *
 */
function useProvideAuth() {
  const [user, setUser] = useState<UserInfoWithToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * @description This function does the following:
   * - Create the user in database
   * - Set the user in the state
   * - Set the cookie
   * - Set the loading state to false
   */
  const handleUserSignIn = async (rawUser: firebase.User) => {
    const user = await formatUser(rawUser);
    const { token, ...userInfo } = user;

    createUser(user.uid, userInfo);
    setUser(user);

    //   cookie.set("fast-feedback-auth", true, {
    //     expires: 1,
    //   });

    setLoading(false);
    return user;
  };

  /**
   * @description This function does the following:
   * - Reset the user state
   * - Remove the cookie
   * - Set the loading state to true
   */
  const handleUserSignOut = () => {
    setUser(null);
    //   cookie.remove("fast-feedback-auth");

    setLoading(false);
  };

  const signinWithEmail = (email: string, password: string) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUserSignIn(response.user);
        Router.push("/sites");
      });
  };

  const signinWithGoogle = (redirect) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUserSignIn(response.user);

        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signout = () => {
    Router.push("/");

    return firebase
      .auth()
      .signOut()
      .then(() => handleUserSignOut());
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUserSignIn);

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithEmail,
    signinWithGoogle,
    signout,
  };
}

/**
 * @description Get the user returned by firebase as input and format it
 */
const formatUser = async (user: firebase.User): Promise<UserInfoWithToken> => {
  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    token,
  };
};
