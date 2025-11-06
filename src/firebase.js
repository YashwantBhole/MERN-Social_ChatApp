import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messaging;

export async function initFirebase() {
  if (messaging) return;
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);

  // Foreground message handler
  onMessage(messaging, async (payload) => {
    console.log("Foreground message:", payload);
    if (Notification.permission === "granted") {
      const reg = await navigator.serviceWorker.getRegistration();
      const { title, body } = payload.notification || {};
      const options = { body, data: payload.data || {} };
      reg?.showNotification ? reg.showNotification(title, options) : new Notification(title, options);
    }
  });
}

export async function requestAndSaveToken(email, backendUrl) {
  if (!messaging) initFirebase();

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return console.warn("Notifications blocked.");
  }

  try {
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    if (!token) return console.warn("No FCM token received");

    await fetch(`${backendUrl}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    console.log("✅ FCM token saved on server");
    return token;
  } catch (err) {
    console.error("Firebase token error:", err.message);
  }
}
