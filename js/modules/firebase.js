import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcyO-c1q99WKZasFaF_UP7Fzab9uLB8aE",
  authDomain: "newswebsite-af357.firebaseapp.com",
  projectId: "newswebsite-af357",
  storageBucket: "newswebsite-af357.appspot.com",
  messagingSenderId: "447702770064",
  appId: "1:447702770064:web:81195a3f39c1e88fb9d315",
  measurementId: "G-9ZTNNRGHPT",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      console.log("email verification sent to user");
    }

    return user;
  } catch (error) {
    console.log(error.code, error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error) {
    throw error;
  }
};
