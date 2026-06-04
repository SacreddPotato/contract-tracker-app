import type { FirebaseApp } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

type FirebaseRuntime = {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
};

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfigKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
] as const;

export const hasFirebaseConfig = requiredConfigKeys.every((key) =>
    Boolean(firebaseConfig[key]),
);

export const firebaseRuntime: FirebaseRuntime | null = hasFirebaseConfig
    ? (() => {
          const app = getApps()[0] ?? initializeApp(firebaseConfig);

          return {
              app,
              auth: getAuth(app),
              firestore: getFirestore(app),
          };
      })()
    : null;

export function requireFirebaseRuntime(): FirebaseRuntime {
    if (!firebaseRuntime) {
        throw new Error(
            'Firebase is not configured. Set the VITE_FIREBASE_* environment variables.',
        );
    }

    return firebaseRuntime;
}
