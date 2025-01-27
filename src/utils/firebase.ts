 

//  // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBoIoGjiesIsbuA2dfpXx6pbQ3BwOuPNWc",
//   authDomain: "operating-in-the-black-68de2.firebaseapp.com",
//   projectId: "operating-in-the-black-68de2",
//   storageBucket: "operating-in-the-black-68de2.firebasestorage.app",
//   messagingSenderId: "713787476033",
//   appId: "1:713787476033:web:de90a6db870856f3341ec0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


  


import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoIoGjiesIsbuA2dfpXx6pbQ3BwOuPNWc",
  authDomain: "operating-in-the-black-68de2.firebaseapp.com",
  projectId: "operating-in-the-black-68de2",
  storageBucket: "operating-in-the-black-68de2.firebasestorage.app",
  messagingSenderId: "713787476033",
  appId: "1:713787476033:web:de90a6db870856f3341ec0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, storage };