// Para saber si el navegador soporta el serviceWorker
// en la consola escribir Navigator, entre las respuestas debe estar


if (navigator.serviceWorker) {
  navigator.serviceWorker.register("./sw.js");
}
