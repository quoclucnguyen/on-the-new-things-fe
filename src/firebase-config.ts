import {initializeApp} from "firebase/app";
import {connectAuthEmulator, getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFeWtq8ns2qpT1_JSoMgBSnfUc4lbxHtg",
    authDomain: "onthenewsthings.firebaseapp.com",
    databaseURL: "https://onthenewsthings-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "onthenewsthings",
    storageBucket: "onthenewsthings.appspot.com",
    messagingSenderId: "952329719588",
    appId: "1:952329719588:web:9a93d6008f9fdc359e2db1"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");
