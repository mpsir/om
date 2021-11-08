addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll([
      'https://mpsir.github.io/om' + '/favicon.ico',
      'https://mpsir.github.io/om' + '/App/App.html',
      'https://mpsir.github.io/om' + '/lib/typeface-roboto/index.min.css',
      'https://mpsir.github.io/om' + '/lib/@mdi/font/css/materialdesignicons.min2.css',
      'https://mpsir.github.io/om' + '/lib/vuetify/vuetify.min2.css',  
      'https://mpsir.github.io/om' + '/lib/codemirror/lib/codemirror.min.css',
      'https://mpsir.github.io/om' + '/lib/codemirror/addon/fold/foldgutter.min.css',
      'https://mpsir.github.io/om' + '/lib/codemirror/theme/ayu-dark.min.css',
      'https://mpsir.github.io/om' + '/lib/jq.js',
      'https://mpsir.github.io/om' + '/lib/vuetify/vue.min.js',
      'https://mpsir.github.io/om' + '/lib/sortable.js',
      'https://mpsir.github.io/om' + '/lib/vuedraggable.umd.js',
      'https://mpsir.github.io/om' + '/lib/vuetify/vuetify.js',
      'https://mpsir.github.io/om' + '/lib/beautify.min.js',
      'https://mpsir.github.io/om' + '/lib/bean.min.js',
      'https://mpsir.github.io/om' + '/lib/cod.js'
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
        return caches.match('https://mpsir.github.io/om' + '/App/App.html');
      }

      throw err;
    }
  }());
});