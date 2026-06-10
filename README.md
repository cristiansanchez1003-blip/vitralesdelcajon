# Vitrales del Cajón

Sitio web estático para catálogo, carrito, checkout y panel local de administración de Vitrales del Cajón.

## Archivos principales

- `index.html`: página principal.
- `catalogo.html`: catálogo completo con carrito.
- `checkout.html`: formulario de compra y resumen de pedido.
- `admin.html`: panel local de administración.
- `styles.css`: estilos principales.
- `script.js`: interacciones de la página principal.
- `assets/`: imágenes y recursos visuales.

## Ejecutar localmente

```bash
python -m http.server 8010
```

Luego abrir:

```text
http://127.0.0.1:8010/
```

## Notas

El catálogo, checkout y admin usan `localStorage` para funcionar en modo estático. El checkout envía el resumen de pedido al WhatsApp configurado del negocio.
