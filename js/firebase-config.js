/**
 * U&B GAS SERVICE PUNE — FIREBASE CLOUD FIRESTORE INITIALIZATION
 * Connects directly to Google Cloud Firestore (Spark Free Plan) for realtime cloud database storage.
 */

const firebaseConfig = {
  apiKey: "AIzaSyD0PFnti613RRK4netkpvwY-zbdYaYZanA",
  authDomain: "ub-gas-service.firebaseapp.com",
  projectId: "ub-gas-service",
  storageBucket: "ub-gas-service.firebasestorage.app",
  messagingSenderId: "182688565205",
  appId: "1:182688565205:web:b6f975d07dd6ca4264df5c",
  measurementId: "G-HF350B9ZFX"
};

let db = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log("✓ Firebase Cloud Firestore initialized successfully for project:", firebaseConfig.projectId);
  } else {
    console.warn("Firebase SDK script not loaded. Falling back to local storage.");
  }
} catch (err) {
  console.warn("Firebase initialization notice:", err);
}

window.firebaseConfig = firebaseConfig;
window.firebaseDb = db;
