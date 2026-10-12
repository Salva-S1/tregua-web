/* tregua. — comportamiento de la página (sin librerías).
   - Cabecera con fondo al hacer scroll.
   - Aparición suave de bloques (.revela).
   - Pestañas de «Ejemplos» accesibles (flechas, Inicio/Fin, enlace directo #ejemplo-…).
   - Conversaciones que se reproducen solas cuando se ven; lo que dependa de un mensaje (data-tras="id") se activa cuando ese mensaje aparece.
   Con «movimiento reducido» del sistema, o con ?estatico en la dirección, todo se muestra ya terminado. */
(() => {
  'use strict';

  // Si se quiere un botón de WhatsApp, poner aquí el número con prefijo de país y sin «+» (ej. '34600000000').
  const WHATSAPP = '';
  const MENSAJE_WHATSAPP = 'Hola, quiero contarles una tarea que nos quita tiempo.';

  const d = document;
  const estatico = /[?&]estatico\b/.test(location.search) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera = ms => new Promise(r => setTimeout(r, ms));
  if (estatico) d.documentElement.classList.add('estatico');

  /* ---------- cabecera ---------- */
  const cabecera = d.querySelector('.cabecera');
  const alHacerScroll = () => cabecera.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  /* ---------- aparición al hacer scroll ---------- */
  const bloques = d.querySelectorAll('.revela');
  if (estatico || !('IntersectionObserver' in window)) {
    bloques.forEach(b => b.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    bloques.forEach(b => io.observe(b));
  }

  /* ---------- conversaciones ---------- */
  class Conversacion {
    constructor(panel) {
      this.panel = panel;
      this.cuerpo = panel.querySelector('.chat__cuerpo');
      this.mensajes = [...panel.querySelectorAll('.msg')];
      this.dependientes = [...panel.querySelectorAll('[data-tras]')];
      this.turno = 0;
      this.hecha = false;
      this.escribiendo = d.createElement('div');
      this.escribiendo.className = 'escribiendo oculto';
      this.escribiendo.setAttribute('aria-hidden', 'true');
      this.escribiendo.innerHTML = '<span></span><span></span><span></span>';
      this.cuerpo.appendChild(this.escribiendo);
    }
    mostrar(m, animar) {
      m.classList.remove('oculto');
      if (animar) { m.classList.remove('entra'); void m.offsetWidth; m.classList.add('entra'); }
      const id = m.dataset.id;
      if (id) this.dependientes.forEach(el => { if (el.dataset.tras === id) el.classList.add('listo'); });
    }
    reiniciar() {
      this.turno++;
      this.mensajes.forEach(m => m.classList.add('oculto'));
      this.dependientes.forEach(el => el.classList.remove('listo'));
      this.escribiendo.classList.add('oculto');
    }
    completa() {
      this.turno++;
      this.escribiendo.classList.add('oculto');
      this.mensajes.forEach(m => this.mostrar(m, false));
      this.hecha = true;
    }
    async reproducir() {
      if (estatico) { this.completa(); return; }
      this.reiniciar();
      const mio = this.turno;
      await espera(500);
      for (const m of this.mensajes) {
        if (mio !== this.turno) return;
        const entra = m.classList.contains('msg--in');
        await espera(entra ? 650 : 900);
        if (mio !== this.turno) return;
        if (entra) {
          this.cuerpo.appendChild(this.escribiendo);
          this.escribiendo.classList.remove('oculto');
          await espera(900 + Math.min(1100, m.textContent.length * 9));
          if (mio !== this.turno) return;
          this.escribiendo.classList.add('oculto');
        }
        this.cuerpo.insertBefore(this.escribiendo, null);
        this.mostrar(m, true);
      }
      this.hecha = true;
    }
  }

  const paneles = [...d.querySelectorAll('[role="tabpanel"]')];
  const conversaciones = new Map(paneles.map(p => [p, new Conversacion(p)]));
  // sin interacción todavía: que se vean terminadas (por si no se llega a reproducir)
  conversaciones.forEach(c => (estatico ? c.completa() : c.reiniciar()));

  let seccionVisible = false;
  const panelActivo = () => paneles.find(p => !p.hidden);
  const reproducirActivo = () => { const p = panelActivo(); if (p) conversaciones.get(p).reproducir(); };

  const ejemplos = d.getElementById('ejemplos');
  if (!estatico && 'IntersectionObserver' in window && ejemplos) {
    const ioChat = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        seccionVisible = e.isIntersecting;
        if (!e.isIntersecting) return;
        const p = panelActivo();
        if (p && !conversaciones.get(p).hecha && conversaciones.get(p).turno <= 1) reproducirActivo();
      });
    }, { threshold: 0.35 });
    paneles.forEach(p => ioChat.observe(p.querySelector('.telefono')));
  }

  d.querySelectorAll('.repetir').forEach(b => b.addEventListener('click', () => {
    const p = b.closest('[role="tabpanel"]');
    conversaciones.get(p).reproducir();
  }));

  /* ---------- pestañas ---------- */
  const pestanas = [...d.querySelectorAll('[role="tab"]')];
  const activar = (pestana, enfocar) => {
    pestanas.forEach(t => {
      const sel = t === pestana;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      const panel = d.getElementById(t.getAttribute('aria-controls'));
      if (sel) {
        panel.hidden = false;
        panel.classList.remove('entra-panel'); void panel.offsetWidth; panel.classList.add('entra-panel');
      } else {
        panel.hidden = true;
        conversaciones.get(panel).reiniciar();
        conversaciones.get(panel).hecha = false;
      }
    });
    if (enfocar) pestana.focus();
    pestana.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: estatico ? 'auto' : 'smooth' });
    const panel = d.getElementById(pestana.getAttribute('aria-controls'));
    if (estatico) conversaciones.get(panel).completa();
    else if (seccionVisible) conversaciones.get(panel).reproducir();
    if (history.replaceState) history.replaceState(null, '', '#' + panel.id);
  };
  pestanas.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % pestanas.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + pestanas.length) % pestanas.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = pestanas.length - 1;
      if (j !== null) { e.preventDefault(); activar(pestanas[j], true); }
    });
  });
  // enlace directo a un ejemplo: #ejemplo-videos, #ejemplo-pedidos…
  const directo = location.hash && pestanas.find(t => '#' + t.getAttribute('aria-controls') === location.hash);
  if (directo) {
    activar(directo, false);
    requestAnimationFrame(() => ejemplos.scrollIntoView({ behavior: 'auto' }));
  }

  /* ---------- WhatsApp (solo si hay número) ---------- */
  const botonWa = d.getElementById('boton-whatsapp');
  if (botonWa && WHATSAPP) {
    botonWa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(MENSAJE_WHATSAPP);
    botonWa.target = '_blank';
    botonWa.rel = 'noopener';
    botonWa.hidden = false;
  }

  /* ---------- año del pie ---------- */
  const anio = d.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
