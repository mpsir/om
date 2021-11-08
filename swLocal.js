addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll([
      '/favicon.ico',
      '/App/App.html',
      '/lib/typeface-roboto/index.min.css',
      '/lib/@mdi/font/css/materialdesignicons.min2.css',
      '/lib/vuetify/vuetify.min2.css',  
      '/lib/codemirror/lib/codemirror.min.css',
      '/lib/codemirror/addon/fold/foldgutter.min.css',
      '/lib/codemirror/theme/ayu-dark.min.css',
      '/lib/jq.js',
      '/lib/vuetify/vue.min.js',
      '/lib/sortable.js',
      '/lib/vuedraggable.umd.js',
      '/lib/vuetify/vuetify.js',
      '/lib/beautify.min.js',
      '/lib/bean.min.js',
      '/lib/cod.js'
    ]);
  }());
});

addEventListener('fetch', (event) => {
  const { request } = event;

  event.respondWith(async function() {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try { return await fetch(request); } 
    catch (err) {
      if (request.mode === 'navigate') {
        return caches.match('/App/App.html');
      }

      throw err;
    }
  }());
});