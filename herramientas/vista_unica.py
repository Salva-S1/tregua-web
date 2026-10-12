"""Genera la web de tregua. en UN solo archivo HTML (CSS, fuentes, logos y JS dentro).
Sirve para la vista previa privada en claude.ai (se abre desde el móvil): esa plataforma pone ella misma
<!doctype>/<head>/<body>, así que el archivo empieza por <title>.
Uso:  python herramientas/vista_unica.py <ruta_de_salida.html>
El enlace privado actual: https://claude.ai/artifact/8BQSDgmPeaKoi5gA4PNnav (se actualiza volviendo a publicar el archivo generado)."""
import base64, io, os, re, sys

ORIGEN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ORIGEN, 'vista_unica.html')

h = io.open(os.path.join(ORIGEN, 'index.html'), encoding='utf-8').read()
cuerpo = h[h.index('<body>') + len('<body>'):h.index('</body>')]


def data_img(nombre):
    ruta = os.path.join(ORIGEN, 'assets', 'img', nombre)
    tipo = 'image/svg+xml' if nombre.endswith('.svg') else 'image/png'
    return 'data:' + tipo + ';base64,' + base64.b64encode(open(ruta, 'rb').read()).decode('ascii')


for nombre in ['tregua-claro.svg', 'tregua-oscuro.svg']:
    cuerpo = cuerpo.replace('src="assets/img/' + nombre + '"', 'src="' + data_img(nombre) + '"')
assert 'assets/img/' not in cuerpo, 'queda alguna imagen sin incrustar'

# las páginas legales no viajan en la vista previa: en el pie quedan como texto
cuerpo = cuerpo.replace('<a href="aviso-legal.html">Aviso legal</a>', '<span>Aviso legal (borrador)</span>')
cuerpo = cuerpo.replace('<a href="privacidad.html">Privacidad</a>', '<span>Privacidad (borrador)</span>')
cuerpo = cuerpo.replace('<script src="assets/js/main.js" defer></script>', '')

js = io.open(os.path.join(ORIGEN, 'assets', 'js', 'main.js'), encoding='utf-8').read()
css = io.open(os.path.join(ORIGEN, 'assets', 'css', 'estilos.css'), encoding='utf-8').read()


def incrustar(m):
    ruta = os.path.join(ORIGEN, 'assets', 'fonts', m.group(1))
    return 'url("data:font/woff2;base64,' + base64.b64encode(open(ruta, 'rb').read()).decode('ascii') + '")'


css, n = re.subn(r'url\("\.\./fonts/([a-z\-]+\.woff2)"\)', incrustar, css)
assert n == 5, n

pagina = ('<title>Web de tregua.</title>\n'
          "<script>document.documentElement.classList.add('js');document.documentElement.lang='es';</script>\n"
          '<style>\n' + css + '\n</style>\n'
          + cuerpo.strip() + '\n'
          '<script>\n' + js + '\n</script>\n')
io.open(SALIDA, 'w', encoding='utf-8', newline='\n').write(pagina)
print('listo:', SALIDA, round(os.path.getsize(SALIDA) / 1024), 'KB')
