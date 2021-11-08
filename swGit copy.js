console.log('from git');
var urlsToCache = [
  '/om/App/App.html',
  '/om/lib/typeface-roboto/index.min.css',
  '/om/lib/@mdi/font/css/materialdesignicons.min2.css',
  '/om/lib/vuetify/vuetify.min2.css',  
  '/om/lib/codemirror/lib/codemirror.min.css',
  '/om/lib/codemirror/addon/fold/foldgutter.min.css',
  '/om/lib/codemirror/theme/ayu-dark.min.css',
  '/om/lib/jq.js',
  '/om/lib/vuetify/vue.min.js',
  '/om/lib/sortable.js',
  '/om/lib/vuedraggable.umd.js',
  '/om/lib/vuetify/vuetify.min.js',
  '/om/lib/beautify.min.js',
  '/om/lib/bean.min.js',
  '/om/lib/cod.js'
];



addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(urlsToCache);
  }());
});

// See https://developers.google.com/web/updates/2017/02/navigation-preload#activating_navigation_preload
addEventListener('activate', event => {
  event.waitUntil(async function() {
    // Feature-detect
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      await self.registration.navigationPreload.enable();
    }
    await self.registration.navigationPreload.enable();
  }());
});

addEventListener('fetch', (event) => {
  const { request } = event;

  // Always bypass for range requests, due to browser bugs
  if (request.headers.has('range')) return;
  event.respondWith(async function() {
    // Try to get from the cache:
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      // See https://developers.google.com/web/updates/2017/02/navigation-preload#using_the_preloaded_response
      const response = await event.preloadResponse;
      if (response) return response;

      // Otherwise, get from the network
      return await fetch(request);
    } catch (err) {
      // If this was a navigation, show the offline page:
      if (request.mode === 'navigate') {
        return caches.match('/om/App/App.html');
      }

      // Otherwise throw
      throw err;
    }
  }());
});

///////////////

// console.log('from swLocal.js ok3');
// var CACHE_NAME = 'my-site-cache-v2';


// self.addEventListener('install', function(event) {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }

//         try {
//         return fetch(event.request);
//         } catch (error) {
//           return caches.match('offline.html');
//         }

//       }
//     )
//   );
// });


