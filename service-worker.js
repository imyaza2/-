// A unique cache name for the application assets
const CACHE_NAME = 'persian-calendar-v1';

// List of essential assets to cache for offline functionality
const assetsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
];

// --- SERVICE WORKER LIFECYCLE EVENTS ---

// 1. Install Event: Caches essential app assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(assetsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Caching failed', error);
      })
  );
});

// 2. Activate Event: Cleans up old caches to ensure the latest version is used
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event: Serves cached assets when offline (Cache-first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found, otherwise fetch from the network
        return response || fetch(event.request);
      })
  );
});


// --- NOTIFICATION SCHEDULING LOGIC ---

// A store for all active notification timeouts
let notificationTimeouts = [];

/**
 * Displays a notification using the service worker's registration.
 * @param {string} title - The body text of the notification.
 */
const showNotification = (title) => {
  // Check for permission before trying to show a notification
  if (Notification.permission === 'granted') {
    self.registration.showNotification('یادآوری رویداد', {
      body: title,
      icon: '/vite.svg',
      badge: '/vite.svg',
      dir: 'rtl',
      lang: 'fa-IR',
      vibrate: [100, 50, 100], // Vibrate for 100ms, pause for 50ms, then vibrate for 100ms
    });
  } else {
    console.warn('Notification permission is not granted.');
  }
};

// Listen for messages from the main application thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    console.log('Service Worker: Received notification schedule.');
    
    // Clear any previously scheduled timeouts to prevent duplicates
    notificationTimeouts.forEach(clearTimeout);
    notificationTimeouts = [];

    const notifications = event.data.payload;

    notifications.forEach(notif => {
      const delay = notif.timestamp - Date.now();
      
      // Only schedule notifications that are in the future
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          showNotification(notif.title);
        }, delay);
        notificationTimeouts.push(timeoutId);
      }
    });

    console.log(`Service Worker: Scheduled ${notificationTimeouts.length} notifications.`);
  }
});