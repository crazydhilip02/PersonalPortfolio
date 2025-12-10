import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseCredentials } from './credentials';

const firebaseConfig = firebaseCredentials;

const app = initializeApp(firebaseConfig);
console.log(`🔥 Firebase Initialized with Project: ${firebaseConfig.projectId}`);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
