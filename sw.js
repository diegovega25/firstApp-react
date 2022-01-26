// EN consola, revisen la sección Network antes de establecer la caché

const CACHE_ELEMENTS = [
  "./",
  "https://unpkg.com/react@17/umd/react.production.min.js",
  "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "./style.css",
  "./components/Contador.js",
];

const CACHE_NAME = "v3_cache_contador_react"; //Este nombre lleva la versión de la caché, recuerden que se actualiza automáticamente en el navegador

//INSTALL: Primer parte de un ciclo de vida de un SW
//Carga la caché
self.addEventListener("install", (e) => {
  e.waitUntil(//espera a que algo suceda, en este caso el install
    caches.open(CACHE_NAME).then((cache) => {//caches permite utilizar la memoria caché de los dispositivos, retorna una promesa
      cache
        .addAll(CACHE_ELEMENTS)//retorna otra promesa
        .then(() => {
          self.skipWaiting();//recargue cache
        })
        .catch(console.log);
    })
  );
});

//2da etapa del ciclo de vida
//Activate: Busca las caches, encuentra una versión vieja de la nuestra, borra la anterior, la actualiza
//si es la misma, la setea
self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];//mapear las caches que trabajamos

  e.waitUntil(
    caches
      .keys() //retorna las claves de las caches del navegador, nuestras versiones anteriores
      .then((cacheNames) => {
        return Promise.all(//Promise.All recibe un array y resuelve las promesas
          cacheNames.map((cacheName) => {//Forma el array
            return ( //el && no es un "y" es un if sin else
              cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName) //sino está en nuestra whitelist, elimine la versión
            );
          })
        );
      })
      .then(() => self.clients.claim())//setea la caché
  );
});

//se dispara cada que hay una petición (puede ser una url externa)
//en caché existe el contenido de la petición?
//obtenerlo de internet
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(e.request);
    })
  );
});
