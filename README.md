# tregua. — web

Web de una sola página de **tregua.** (automatización de tareas repetitivas para negocios, España y Perú).
Hecha a mano, sin librerías: HTML, CSS y un poco de JavaScript. No usa cookies ni rastreadores, y las tipografías van dentro del sitio.

## Verla en el ordenador

- **Rápido:** abrir `index.html` con doble clic.
  (En este modo el navegador no deja cargar las tipografías propias; si el PC tiene instalada Outfit se ve igual que publicada.)
- **Como quedará publicada:** en esta carpeta, `python -m http.server 8765` y abrir `http://127.0.0.1:8765`.
- `index.html?estatico` muestra todo ya terminado, sin animaciones (sirve para capturas).
- `index.html#ejemplo-videos` (o `-reportes`, `-documentos`, `-pedidos`) abre directamente ese ejemplo.

## Verla en el móvil (vista previa privada)

Enlace privado de claude.ai (solo lo abre Salva con su cuenta): https://claude.ai/artifact/8BQSDgmPeaKoi5gA4PNnav
Para actualizarlo tras un cambio: `python herramientas/vista_unica.py <salida.html>` y volver a publicar ese archivo en el mismo enlace.
Es una copia de vista previa: no es la web publicada (no hay dominio todavía).

## Qué hay

```
index.html            la página
aviso-legal.html      borrador (faltan datos del titular)
privacidad.html       borrador (faltan datos del responsable y del alojamiento)
assets/css/estilos.css
assets/js/main.js     pestañas, chats animados, aparición al hacer scroll; arriba se pone el número de WhatsApp
assets/fonts/         Outfit en woff2 (licencia OFL en la misma carpeta)
assets/img/           logo, iconos e imagen para compartir (og.png)
herramientas/         og.html (genera og.png), marco_movil.html (revisar el móvil) y vista_unica.py (un solo archivo para la vista previa)
```

Marca: Outfit · negro `#12151A` · blanco · blanco cálido `#F6F3EE` · rosa `#F2788F` solo de acento · trato de usted.
Los ejemplos (chats, reporte, vídeo, presupuesto, hoja) son maquetas hechas con la propia página, con datos inventados: no hay capturas ni fotos reales.

## Antes de publicar (decisiones de Salva)

1. **Dominio.** PUBLICADA gratis el 12/10 en GitHub Pages: https://salva-s1.github.io/tregua-web/ (repo público). Falta comprar dominio propio y apuntarlo aquí.
2. **WhatsApp:** poner el número en `assets/js/main.js` (`const WHATSAPP = ''`) para que aparezca el botón.
3. **Aviso legal y privacidad:** completar titular, NIF, domicilio y alojamiento; revisarlo con una gestoría.
4. **Confirmar lo que la web promete:** primera conversación sin coste · primera semana acompañada · los datos de cada cliente no se mezclan · precio por escrito antes de empezar · como mucho tres cosas nuevas que aprender · un resumen mensual (qué hizo, qué falló, qué se arregló, horas ahorradas) para quien tenga mantenimiento · **precios «desde» (propuesta del 18/10, sacada del análisis de mercado v4): informe US$ 150, automatización US$ 500, mantenimiento US$ 100/mes · el informe se descuenta si después se hace el trabajo · se paga por partes, a medida que se entrega.**
6. **Países:** desde el 18/10 la web no nombra España ni Perú (solo «trabajamos en remoto»), salvo las leyes de datos que se cumplen (RGPD y Ley 29733) y la AEPD en la privacidad. El ejemplo de presupuesto sigue en euros con IVA 21 %.
5. **Caso real:** permiso de la empresa para contarlo, dado (Salva, 18/10). Falta revisar las cifras con ella (45 min por reporte, ~25 eventos al mes).

## Idea central (desde el 18/10)

«La IA se adapta a su forma de trabajar, no al revés.» Está en la portada, en el bloque «Nuestro enfoque» (lo habitual frente a tregua.), en «Lo que cambia para usted/su equipo» de cada ejemplo, en los 5 pasos de «Cómo trabajamos» y en tres preguntas para quien desconfía de la IA. Si algo de eso deja de ser verdad, corregir la web.
