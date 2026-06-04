import type { FirebaseApp } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import {
    hasRequiredFirebaseConfig,
    resolveFirebaseConfig,
} from '@/lib/firebase-config';
import type { FirebaseWebConfig } from '@/lib/firebase-config';

type FirebaseRuntime = {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
};

const viteFirebaseConfig: FirebaseWebConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const firebaseConfig = resolveFirebaseConfig({
    runtimeConfig:
        typeof window === 'undefined'
            ? {}
            : window.__contractTrackerConfig?.firebase,
    viteConfig: viteFirebaseConfig,
});

export const hasFirebaseConfig = hasRequiredFirebaseConfig(firebaseConfig);

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
