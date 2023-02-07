// const VERSION = '1.0.6';

// self.addEventListener('install', self.skipWaiting);

// self.addEventListener('activate', (event) => {
//     event.waitUntil(caches.keys().then((keys) => {
//         return Promise.all(keys.map((key) => {
//             if(key === VERSION) return;
//             return caches.delete(key);
//         }));
//     }));
// });

// self.addEventListener('fetch', (event) => {
//     event.respondWith((async () => {
//         const file = await caches.match(event.request);
//         if(file) return file;
//         try {
//             const response = await fetch(event.request);
//             if(!event.request.url.includes('/api')) {
//                 const cache = await caches.open(VERSION);
//                 cache.put(event.request, response.clone());
//             }
//             return response;
//         }
//         catch(error) {
//            // console.error(error);
//         }
//     })());
// });

const version = '1.1.1';
let staticName = `staticCache-${version}`;
let dynamicName = `dynamicCache`;
let imageName = `imageCache-${version}`;

//starter html and css and js files
let assets = ['/', '/profile', '/manifest.json', '/dist/cdn.min.js', '/dist/main.css', '/dist/main.js'];
//starter images
let imageAssets = ['/favicon.ico', '/icons/android-chrome-192x192.png', '/icons/tabler-sprite.svg'];

self.addEventListener('install', (ev) => {
    self.skipWaiting().then(
        caches
            .open(staticName)
            .then((cache) => {
                cache.addAll(assets).then(
                    () => {
                        //addAll == fetch() + put()
                        console.log(`${staticName} has been updated.`);
                    },
                    (err) => {
                        console.log(`failed to update ${staticName}.`, err);
                    }
                );
            })
            .then(() => {
                caches.open(imageName).then((cache) => {
                    cache.addAll(imageAssets).then(
                        () => {
                            console.log(`${imageName} has been updated.`);
                        },
                        (err) => {
                            console.log(`failed to update ${staticName}.`);
                        }
                    );
                });
            })
            .then(() => console.log(`Version ${version} installed`))
    )
});

self.addEventListener('installs', (ev) => {
    console.log(`Version ${version} installed`);

    // build a cache
    caches
        .open(staticName)
        .then((cache) => {
             cache.addAll(assets).then(
                () => {
                    //addAll == fetch() + put()
                    console.log(`${staticName} has been updated.`);
                    console.log('test', ev)
                    console.log('test', self)
                    self.skipWaiting;
                },
                (err) => {
                    console.log(`failed to update ${staticName}.`, err);
                }
            );
        })
        /*.then(() => {
            caches.open(imageName).then((cache) => {
                cache.addAll(imageAssets).then(
                    () => {
                        console.log(`${imageName} has been updated.`);

                    },
                    (err) => {
                        console.log(`failed to update ${staticName}.`);
                    }
                );
            });
        })*/

});

self.addEventListener('activate', (ev) => {
    // when the service worker has been activated to replace an old one.
    //Extendable Event
    console.log('activated');
    // delete old versions of caches.
    ev.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => {
                        if (key != staticName && key != imageName) {
                            return true;
                        }
                    })
                    .map((key) => {
                        console.log(`Cache wurde gelöscht: ${key}`)
                        caches.delete(key)
                    })
            ).then((empties) => {
                //empties is an Array of boolean values.
                //one for each cache deleted
            });
        })
    );
});

self.addEventListener('fetch', (ev) => {
    // Extendable Event.
    console.log(`MODE: ${ev.request.mode} for ${ev.request.url}`);

    ev.respondWith(
        caches.match(ev.request).then((cacheRes) => {
            return (
                cacheRes ||
                Promise.resolve().then(() => {
                    let opts = {
                        mode: ev.request.mode, //cors, no-cors, same-origin, navigate
                        cache: 'no-cache',
                    };
                    if (!ev.request.url.startsWith(location.origin)) {
                        //not on the same domain as my html file
                        opts.mode = 'cors';
                        opts.credentials = 'omit';
                    }
                    return fetch(ev.request.url).then(
                        (fetchResponse) => {
                            //we got a response from the server.
                            if (fetchResponse.ok) {
                                return handleFetchResponse(fetchResponse, ev.request);
                            }
                            //not ok 404 error
                            if (fetchResponse.status == 404) {
                                //TODO: ses check if route then 404 or no internet
                                console.log('404 error')
                                if (ev.request.url.match(/\.html/i)) {
                                    return caches.open(staticName).then((cache) => {
                                        return cache.match('/404.html');
                                    });
                                }
                                //TODO: ses check if image return image not found
                                if (
                                    ev.request.url.match(/\.jpg$/i) ||
                                    ev.request.url.match(/\.png$/i)
                                ) {
                                    return caches.open(imageName).then((cache) => {
                                        return cache.match('/img/distracted-boyfriend.jpg');
                                    });
                                }
                            }
                        },
                        (err) => {
                            //TODO: ses check 404 or no internet
                            //this is the network failure
                            //return the 404.html file if it is a request for an html file
                            console.log('404 error internet')
                            if (ev.request.url.match(/\.html/i)) {
                                return caches.open(staticName).then((cache) => {
                                    return cache.match('/404.html');
                                });
                            }
                        }
                    );
                    //.catch()
                })
            );
        }) //end of match().then()
    ); //end of respondWith
}); //end of fetch listener

const handleFetchResponse = (fetchResponse, request) => {
    let type = fetchResponse.headers.get('content-type');
    // console.log('handle request for', type, request.url);
    if (type && type.match(/^image\//i)) {
        //save the image in image cache
        console.log(`SAVE ${request.url} in image cache`);
        return caches.open(imageName).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
        });
    } else {
        //save in dynamic cache - html, css, fonts, js, etc
        console.log(`SAVE ${request.url} in dynamic cache`);
        return caches.open(dynamicName).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
        });
    }
};
self.addEventListener('message', (ev) => {
    //message from web page ev.data.
    //Extendable Event
    console.log(ev)
});