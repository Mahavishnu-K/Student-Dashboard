import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD4XqYl7UtzGSwCmPqTHcCMrcoOeJ-SCxg",
  authDomain: "student-dashboard-48f61.firebaseapp.com",
  projectId: "student-dashboard-48f61",
  storageBucket: "student-dashboard-48f61.firebasestorage.app",
  messagingSenderId: "848869087716",
  appId: "1:848869087716:web:4fa5855fc70998f14e8ff1",
  measurementId: "G-XDRYJYFY1C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export { auth };