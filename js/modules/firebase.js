import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
export const db = getFirestore(app);

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
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};
export const createUser = async (uid, userData) => {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, userData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    alert(`Error adding document: ${error.message}`);
    throw error;
  }
};

export const getUser = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const updateUser = async (uid, updateData) => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, updateData);
    console.log("Document updated with ID: ", docRef.id);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};
