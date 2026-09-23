# Salón Belleza

Sitio web de una sola página para un salón de belleza: servicios, sobre nosotros, galería, reseñas, reserva de turnos por WhatsApp y contacto.

HTML, CSS y JavaScript puros, sin dependencias ni proceso de build. Para verlo, abrí `index.html` en el navegador.

## Qué tenés que personalizar

| Qué | Dónde |
| --- | --- |
| Nombre del salón | `index.html`: logo, `<title>` y pie de página |
| Número de WhatsApp para reservas | `script.js` → `WHATSAPP_NUMBER` (solo dígitos, con código de país; ej. `5491123456789`) |
| Servicios, duraciones y precios | `index.html`, sección `#servicios` (los precios dicen `Desde $ —`) |
| Tu nombre, historia y formación | `index.html`, sección `#nosotros` |
| Fotos | Reemplazá cada `<div class="ph ...">` por `<img src="img/archivo.jpg" alt="descripción">` |
| Reseñas | `index.html`, sección `#resenas`: **son de ejemplo**, usá reseñas reales con permiso o borrá la sección |
| Dirección, teléfono, email, horarios | `index.html`, sección `#contacto` |
| Mapa | Google Maps → Compartir → Insertar un mapa, y pegá el `<iframe>` en lugar del placeholder |
| Instagram / Facebook | Links en `#galeria` y `#contacto` |
| Respuestas del asistente | `script.js` → `FAQ` (palabras clave y respuesta de cada pregunta) |
| Colores y tipografías | `styles.css` → variables en `:root` |

Mientras `WHATSAPP_NUMBER` esté vacío, el formulario valida los campos pero no envía nada y le muestra al visitante un aviso.

## Publicarlo gratis con GitHub Pages

1. En GitHub: **Settings → Pages**.
2. En *Source* elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En uno o dos minutos queda online en `https://<tu-usuario>.github.io/Salon-Belleza/`.
