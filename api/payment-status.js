const { flowRequest } = require('./_flow');

const STATUS_LABELS = {
  1: 'pendiente',
  2: 'pagado',
  3: 'rechazado',
  4: 'anulado'
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const token = req.query && req.query.token;
  if (!token) {
    res.status(400).json({ error: 'Falta el token de pago.' });
    return;
  }

  try {
    const { ok, data } = await flowRequest('/payment/getStatus', {
      apiKey: process.env.FLOW_API_KEY,
      token
    }, 'GET');

    if (!ok) {
      res.status(502).json({ error: data.message || 'No se pudo consultar el estado del pago.' });
      return;
    }

    res.status(200).json({
      status: data.status,
      statusText: STATUS_LABELS[data.status] || 'desconocido',
      commerceOrder: data.commerceOrder,
      flowOrder: data.flowOrder,
      amount: data.amount,
      payer: data.payer
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al consultar el pago.' });
  }
};
