# tregua. — web

Web de una sola página de **tregua.** (automatización de tareas repetitivas para negocios, España y Perú).
Hecha a mano, sin librerías: HTML, CSS y un poco de JavaScript. No usa cookies ni rastreadores, y las tipografías van dentro del sitio.

## Verla en el ordenador

- **Rápido:** abrir `index.html` con doble clic.
  (En este modo el navegador no deja cargar las tipografías propias; si el PC tiene instalada Outfit se ve igual que publicada.)
- **Como quedará publicada:** en esta carpeta, `python -m http.server 8765` y abrir `http://127.0.0.1:8765`.
- `index.html?estatico` muestra todo ya terminado, sin animaciones (sirve para capturas).
- `index.html#ejemplo-videos` (o `-reportes`, `-documentos`, `-pedidos`) abre directamente ese ejemplo.

## Qué hay

```
index.html            la página
aviso-legal.html      borrador (faltan datos del titular)
privacidad.html       borrador (faltan datos del responsable y del alojamiento)
assets/css/estilos.css
assets/js/main.js     pestañas, chats animados, aparición al hacer scroll; arriba se pone el número de WhatsApp
assets/fonts/         Outfit en woff2 (licencia OFL en la misma carpeta)
assets/img/           logo, iconos e imagen para compartir (og.png)
herramientas/         og.html (genera og.png) y marco_movil.html (para revisar el móvil)
```

Marca: Outfit · negro `#12151A` · blanco · blanco cálido `#F6F3EE` · rosa `#F2788F` solo de acento · trato de usted.
Los ejemplos (chats, reporte, vídeo, presupuesto, hoja) son maquetas hechas con la propia página, con datos inventados: no hay capturas ni fotos reales.

## Antes de publicar (decisiones de Salva)

1. **Dominio y alojamiento.** Recomendado: comprar el dominio y alojar gratis en Cloudflare Pages o GitHub Pages. Nada publicado todavía.
2. **WhatsApp:** poner el número en `assets/js/main.js` (`const WHATSAPP = ''`) para que aparezca el botón.
3. **Aviso legal y privacidad:** completar titular, NIF, domicilio y alojamiento; revisarlo con una gestoría.
4. **Confirmar lo que la web promete:** primera conversación sin coste · primera semana acompañada · los datos de cada cliente no se mezclan · precio por escrito antes de empezar.
5. **Caso real:** que la empresa del caso (anonimizada) esté de acuerdo en que se cuente, y revisar las cifras (45 min por reporte, ~25 eventos al mes).
