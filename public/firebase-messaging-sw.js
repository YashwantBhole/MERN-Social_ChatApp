/* eslint-disable no-undef */
// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyBIm0oJfO6aDuiPILY9MqSvRPchrfGoSLU",
  authDomain: "mern-firebase-app-54dce.firebaseapp.com",
  projectId: "mern-firebase-app-54dce",
  storageBucket: "mern-firebase-app-54dce.firebasestorage.app",
  messagingSenderId: "753823504978",
  appId: "1:753823504978:web:74352ab9dc12ea6fd8dd8b",
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "New Message", {
    body: body || "You have a new message.",
  });
});
