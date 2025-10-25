import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 설정 값 확인 (디버깅용)
console.log('Firebase 설정 확인:', {
  apiKey: firebaseConfig.apiKey ? '설정됨' : '없음',
  authDomain: firebaseConfig.authDomain || '없음',
  projectId: firebaseConfig.projectId || '없음',
  storageBucket: firebaseConfig.storageBucket || '없음',
  messagingSenderId: firebaseConfig.messagingSenderId || '없음',
  appId: firebaseConfig.appId ? '설정됨' : '없음'
});

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 인스턴스
export const db = getFirestore(app);

// Authentication 인스턴스
export const auth = getAuth(app);
