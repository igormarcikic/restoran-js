let firebaseConfig = {
  apiKey: "AIzaSyC6tNz7BgUs7HnsPr9FLI90UrXDonfGQiA",
  authDomain: "restoran-js.firebaseapp.com",
  databaseURL: "https://restoran-js.firebaseio.com",
  projectId: "restoran-js",
  storageBucket: "",
  messagingSenderId: "903988107885",
  appId: "1:903988107885:web:825130d2c7b89597d47d64"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firestore = firebaseApp.firestore();

