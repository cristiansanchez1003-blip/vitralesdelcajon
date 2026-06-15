const { list, put } = require('@vercel/blob');

const BLOB_PATH = 'vitrales-products.json';
const ADMIN_SECRET = 'vitrales2026';

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: BLOB_PATH });
      const match = blobs.find((b) => b.pathname === BLOB_PATH);
      if (!match) {
        res.status(200).json({ products: null });
        return;
      }
      const response = await fetch(`${match.url}?t=${Date.now()}`);
      const products = await response.json();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al leer el catálogo.' });
    }
    return;
  }

  if (req.method === 'PUT') {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${ADMIN_SECRET}`) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }

    const products = req.body;
    if (!Array.isArray(products) || !products.length) {
      res.status(400).json({ error: 'Formato de catálogo inválido.' });
      return;
    }

    try {
      await put(BLOB_PATH, JSON.stringify(products), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json'
      });
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al guardar el catálogo.' });
    }
    return;
  }

  res.status(405).json({ error: 'Método no permitido.' });
};
