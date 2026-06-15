const { flowRequest, calculateAmount } = require('./_flow');

function getSiteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${req.headers.host}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  try {
    const { items, shippingAmount, customer } = req.body || {};

    if (!customer || !customer.email) {
      res.status(400).json({ error: 'Falta el email del cliente.' });
      return;
    }

    const amount = calculateAmount(items, shippingAmount);
    const siteUrl = getSiteUrl(req);
    const commerceOrder = `VDC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const params = {
      apiKey: process.env.FLOW_API_KEY,
      commerceOrder,
      subject: `Pedido Vitrales del Cajón ${commerceOrder}`,
      currency: 'CLP',
      amount,
      email: customer.email,
      paymentMethod: 9,
      urlConfirmation: `${siteUrl}/api/confirm-payment`,
      urlReturn: `${siteUrl}/pago-resultado.html`
    };

    const { ok, data } = await flowRequest('/payment/create', params, 'POST');

    if (!ok || !data.url || !data.token) {
      res.status(502).json({ error: data.message || 'No se pudo crear el pago en Flow.' });
      return;
    }

    res.status(200).json({ url: data.url, token: data.token, flowOrder: data.flowOrder, commerceOrder });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al procesar el pago.' });
  }
};
