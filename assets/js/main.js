/* tregua. — comportamiento de la página (sin librerías).
   - Cabecera con fondo al hacer scroll.
   - Aparición suave de bloques (.revela).
   - Pestañas de «Ejemplos» accesibles (flechas, Inicio/Fin, enlace directo #ejemplo-…).
   - Conversaciones completas en reposo que se reproducen solas al verse; lo que dependa de un mensaje (data-tras="id") se activa cuando ese mensaje aparece.
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
  // En reposo cada conversación se ve COMPLETA (quien no baja, una miniatura o un enlace compartido la ven entera).
  // Justo antes de entrar en pantalla se vacía (fuera de la vista) y, al verse, se reproduce una vez. «Ver otra vez» la repite.
  class Conversacion {
    constructor(panel) {
      this.panel = panel;
      this.telefono = panel.querySelector('.telefono');
      this.cuerpo = panel.querySelector('.chat__cuerpo');
      this.mensajes = [...panel.querySelectorAll('.msg')];
      this.dependientes = [...panel.querySelectorAll('[data-tras]')];
      this.turno = 0;
      this.vista = false;
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
    vaciar() {
      this.turno++;
      this.mensajes.forEach(m => m.classList.add('oculto'));
      this.dependientes.forEach(el => el.classList.remove('listo'));
      this.escribiendo.classList.add('oculto');
    }
    completa() {
      this.turno++;
      this.escribiendo.classList.add('oculto');
      this.mensajes.forEach(m => this.mostrar(m, false));
    }
    async reproducir() {
      this.vista = true;
      if (estatico) { this.completa(); return; }
      this.vaciar();
      const mio = this.turno;
      await espera(450);
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
        this.mostrar(m, true);
      }
    }
  }

  const paneles = [...d.querySelectorAll('[role="tabpanel"]')];
  const conversaciones = new Map(paneles.map(p => [p, new Conversacion(p)]));
  conversaciones.forEach(c => c.completa());
  const enVista = el => { const r = el.getBoundingClientRect(); return r.height > 0 && r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.2; };

  if (!estatico && 'IntersectionObserver' in window) {
    const enPantalla = new Set();
    const deTelefono = t => conversaciones.get(t.closest('[role="tabpanel"]'));
    // se acerca a la pantalla: se vacía mientras aún no se ve
    const cerca = new IntersectionObserver(es => es.forEach(e => {
      const c = deTelefono(e.target);
      if (e.isIntersecting && !c.vista && !enPantalla.has(e.target)) c.vaciar();
    }), { rootMargin: '0px 0px 35% 0px' });
    // ya se ve: se reproduce (una vez)
    const visible = new IntersectionObserver(es => es.forEach(e => {
      const c = deTelefono(e.target);
      if (e.isIntersecting) { enPantalla.add(e.target); if (!c.vista) c.reproducir(); }
      else enPantalla.delete(e.target);
    }), { threshold: 0.35 });
    conversaciones.forEach(c => { cerca.observe(c.telefono); visible.observe(c.telefono); });
  }

  d.querySelectorAll('.repetir').forEach(b => b.addEventListener('click', () => {
    conversaciones.get(b.closest('[role="tabpanel"]')).reproducir();
  }));

  /* ---------- pestañas ---------- */
  const ejemplos = d.getElementById('ejemplos');
  const pestanas = [...d.querySelectorAll('[role="tab"]')];
  const activar = (pestana, enfocar) => {
    let elegido = null;
    pestanas.forEach(t => {
      const sel = t === pestana;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      const panel = d.getElementById(t.getAttribute('aria-controls'));
      const c = conversaciones.get(panel);
      if (sel) {
        panel.hidden = false;
        panel.classList.remove('entra-panel'); void panel.offsetWidth; panel.classList.add('entra-panel');
        elegido = c;
      } else {
        panel.hidden = true;
        c.completa();
        c.vista = false;
      }
    });
    if (enfocar) pestana.focus();
    pestana.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: estatico ? 'auto' : 'smooth' });
    if (!estatico && elegido) {
      if (enVista(elegido.telefono)) elegido.reproducir();
      else { elegido.completa(); elegido.vista = false; }
    }
    try { history.replaceState(null, '', '#' + pestana.getAttribute('aria-controls')); } catch (e) { /* algunos marcos no lo permiten */ }
  };
  pestanas.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let k = null;
      if (e.key === 'ArrowRight') k = (i + 1) % pestanas.length;
      else if (e.key === 'ArrowLeft') k = (i - 1 + pestanas.length) % pestanas.length;
      else if (e.key === 'Home') k = 0;
      else if (e.key === 'End') k = pestanas.length - 1;
      if (k !== null) { e.preventDefault(); activar(pestanas[k], true); }
    });
  });
  // enlace directo a un ejemplo: #ejemplo-videos, #ejemplo-pedidos… (al cargar la página o desde un enlace de la propia página)
  const pestanaDe = hash => hash && pestanas.find(t => '#' + t.getAttribute('aria-controls') === hash);
  const directo = pestanaDe(location.hash);
  if (directo) {
    activar(directo, false);
    requestAnimationFrame(() => ejemplos.scrollIntoView({ behavior: 'instant' }));
  }
  d.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#ejemplo-"]');
    const t = a && pestanaDe(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    activar(t, false);
    ejemplos.scrollIntoView({ behavior: estatico ? 'instant' : 'smooth' });
  });

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
