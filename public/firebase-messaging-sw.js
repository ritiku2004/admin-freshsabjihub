// firebase-messaging-sw.js - Required for background notifications
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Config object template - messagingSenderId is the essential part for background FCM
const firebaseConfig = {
  apiKey: "AIzaSyFakeKeyForInitialSetup",
  authDomain: "freshsabjihub.firebaseapp.com",
  projectId: "freshsabjihub",
  storageBucket: "freshsabjihub.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
