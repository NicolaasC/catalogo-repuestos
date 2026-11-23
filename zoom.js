// Zoom de fotos con PhotoSwipe 5.4.4 (MIT), alojado en /vendor.
import PhotoSwipe from '/vendor/photoswipe.esm.min.js';

if (!document.querySelector('link[href="/vendor/photoswipe.css"]'))
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/vendor/photoswipe.css">');

// PhotoSwipe necesita el tamaño real de cada foto.
const medir = src => new Promise(ok => {
  const i = new Image();
  i.onload = () => ok({ src, width: i.naturalWidth, height: i.naturalHeight });
  i.onerror = () => ok({ src, width: 1000, height: 1000 });
  i.src = src;
});

export async function abrir(lista, inicio = 0){
  const dataSource = await Promise.all(lista.map(medir));
  const pswp = new PhotoSwipe({
    dataSource, index: inicio, bgOpacity: .94, showHideAnimationType: 'fade',
    maxZoomLevel: 4, secondaryZoomLevel: 2.5, wheelToZoom: true,
    closeTitle: 'Cerrar', zoomTitle: 'Acercar', arrowPrevTitle: 'Anterior', arrowNextTitle: 'Siguiente',
    errorMsg: 'No se pudo cargar la foto',
    // Si hay una ventana modal abierta (vista rápida), el zoom debe vivir dentro de ella o quedaría bloqueado.
    appendToEl: document.querySelector('dialog[open]') || document.body
  });
  pswp.init();
}
