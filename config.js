import firebase from 'firebase';
require('@firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3xU4UQkDGE1UN46FEM8teEedY8gc3ksk",
  authDomain: "booksanta-a42d6.firebaseapp.com",
  projectId: "booksanta-a42d6",
  storageBucket: "booksanta-a42d6.appspot.com",
  messagingSenderId: "125404523441",
  appId: "1:125404523441:web:1f1fa5e0d546e482ef6b90"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
