# Contract Tracker

Contract Tracker is a Laravel API + React frontend application. Product data is intended to use Firebase Auth plus Firestore client access, with Firestore Security Rules as the access-control boundary.

## Local Development

Install dependencies:

```powershell
composer install --ignore-platform-req=ext-zip
npm install
```

Prepare `.env`:

```powershell
copy .env.example .env
php artisan key:generate
```

Fill these Firebase web config values from Firebase Console > Project settings > Your apps > Web app config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Check the local setup:

```powershell
npm run check:dev
```

Run the app:

```powershell
composer dev
```

## Verification

Use these commands before handoff:

```powershell
composer test
npm run format:check
npm run lint:check
npm run types:check
npm run build
npm run test:firestore-rules
```

## Firebase

Firestore configuration lives in:

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `tests/firestore`

Deploy Firestore rules and indexes after logging in with Firebase CLI:

```powershell
firebase login
firebase deploy --only firestore
```

The Firebase web config values are public client config, not Firebase Admin secrets. Do not commit Firebase Admin service-account JSON files.

## NativePHP Releases

NativePHP is configured for Windows desktop builds through GitHub Actions. Local NativePHP publishing requires PHP `ext-zip`; normal app development can continue without it.
