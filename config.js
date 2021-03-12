import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyCGaNpi13FU5aIed3dCgzi1BK_kLBCFWt8",
    authDomain: "booksanta-74965.firebaseapp.com",
    projectId: "booksanta-74965",
    storageBucket: "booksanta-74965.appspot.com",
    messagingSenderId: "729018492859",
    appId: "1:729018492859:web:475f5faa3e44b1c2fe469e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();
 