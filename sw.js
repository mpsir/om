

const bc = new BroadcastChannel('sw');

function sendMsg(msg){ bc.postMessage(msg); }

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    'https://mpsir.github.io/om/favicon.ico',
    'https://mpsir.github.io/om/App/',
    'https://mpsir.github.io/om/lib/typeface-roboto/files/roboto-latin-700.woff2',
    'https://mpsir.github.io/om/lib/typeface-roboto/files/roboto-latin-700.woff',
    'https://mpsir.github.io/om/lib/typeface-roboto/files/roboto-latin-500.woff2',
    'https://mpsir.github.io/om/lib/typeface-roboto/files/roboto-latin-500.woff'
    //'/sw.js'
]

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

var hmlFiles = [

    'https://mpsir.github.io/om/lib/typeface-roboto/index.min.css',
    'https://mpsir.github.io/om/lib/@mdi/font/css/materialdesignicons.min2.css',
    'https://mpsir.github.io/om/lib/vuetify/vuetify.min2.css',
    'https://mpsir.github.io/om/lib/jq.js',
    'https://mpsir.github.io/om/lib/vuetify/vue.min.js',
    'https://mpsir.github.io/om/lib/vue.min.js',
    'https://mpsir.github.io/om/lib/sortable.js',
    'https://mpsir.github.io/om/lib/vuedraggable.umd.js',
    'https://mpsir.github.io/om/lib/vuetify/vuetify.min.js',
    'https://mpsir.github.io/om/lib/bean.min.js',
    'https://mpsir.github.io/om/lib/io.js', 

    // '/lib/io.basic.js', 
    // 'http://localhost/lib/io.basic.js', 
    // 'https://mpsir.loca.lt/lib/io.basic.js',


    // 'http://localhost/lib/typeface-roboto/files/roboto-latin-700.woff2',
    // 'https://mpsir.loca.lt/lib/typeface-roboto/files/roboto-latin-700.woff2',
    
    // 'http://localhost/lib/typeface-roboto/files/roboto-latin-700.woff',
    // 'https://mpsir.loca.lt/lib/typeface-roboto/files/roboto-latin-700.woff'

]


addEventListener('fetch', (event) => {
    const { request } = event;
    console.log(event.request.url);
    event.respondWith(async function () {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        //var a = event.request.url   

        try {
            var a = await fetch(request)

            hmlFiles.forEach(element => {
                if (element == event.request.url) {
                    var responseToCache = a.clone();
                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                    return a;
                }
            });

            return a
        }
        catch (err) {
            if (request.mode === 'navigate') {
                return caches.match('https://mpsir.github.io/om/App/');
            }
            throw err;
        }
    }());
});

self.addEventListener('activate', event => {
    bc.postMessage('reload');
});