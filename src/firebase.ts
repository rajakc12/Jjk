import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { initializeFirestore, collection, addDoc, query, where, getDocs, onSnapshot, doc, getDocFromServer, Timestamp, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDZ8UzlpY02Ge7455CDn0gOi6pAVirAWM",
  authDomain: "gen-lang-client-0897738388.firebaseapp.com",
  projectId: "gen-lang-client-0897738388",
  storageBucket: "gen-lang-client-0897738388.firebasestorage.app",
  messagingSenderId: "534468487466",
  appId: "1:534468487466:web:47b47f56b6386b7a0d5653"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with long polling to avoid "client is offline" errors in some environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  setDoc,
  serverTimestamp,
  getDoc,
  doc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  getDocFromServer,
  Timestamp
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
