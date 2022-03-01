// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa3-GQIxIFdL8-Fd8CFBVnTrRth7nLod4",
  authDomain: "demochatrealtime-6a9d0.firebaseapp.com",
  projectId: "demochatrealtime-6a9d0",
  storageBucket: "demochatrealtime-6a9d0.appspot.com",
  messagingSenderId: "253398504805",
  appId: "1:253398504805:web:8636ce3980e15462cb3d8c",
  measurementId: "G-FM2TH7752V"
};



let app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth , storage};
