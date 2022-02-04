import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

require('dotenv').config();

// const firebaseConfig = {
//   apiKey: 'AIzaSyDbH_y_SLSTqKNo2MHeQ8rNcLkYoGlkIec',
//   authDomain: 'music-app-25172.firebaseapp.com',
//   projectId: 'music-app-25172',
//   storageBucket: 'music-app-25172.appspot.com',
//   appId: '1:345080771388:web:e35dbf4e674f87f7606439',
// };

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  appId: process.env.VUE_APP_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection('users');

export {
  auth,
  db,
  usersCollection,
};
