const { flowRequest } = require('./_flow');
const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

async function sendConfirmationEmail(data) {
  const transporter = createTransport();

  const statusLabel = data.status === 2 ? 'Pagado' : `Estado ${data.status}`;
  const amount = data.amount ? `$${Number(data.amount).toLocaleString('es-CL')} CLP` : 'N/A';

  await transporter.sendMail({
    from: `"Vitrales del Cajón" <${process.env.GMAIL_USER}>`,
    to: 'vitralesdelcajon@gmail.com',
    subject: `Nuevo pago recibido - Orden ${data.commerceOrder}`,
    html: `
      <h2>Nuevo pago confirmado</h2>
      <table style="border-collapse:collapse;font-family:sans-serif">
        <tr><td style="padding:6px 12px;font-weight:bold">Orden comercio</td><td style="padding:6px 12px">${data.commerceOrder}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Orden Flow</td><td style="padding:6px 12px">${data.flowOrder}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Monto</td><td style="padding:6px 12px">${amount}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Estado</td><td style="padding:6px 12px">${statusLabel}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Pagador</td><td style="padding:6px 12px">${data.payer || 'N/A'}</td></tr>
      </table>
    `
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = (req.body && req.body.token) || (req.query && req.query.token);
    if (!token) {
      res.status(400).end();
      return;
    }

    const { data } = await flowRequest('/payment/getStatus', {
      apiKey: process.env.FLOW_API_KEY,
      token
    }, 'GET');

    console.log('[Flow confirmation]', JSON.stringify({
      commerceOrder: data.commerceOrder,
      flowOrder: data.flowOrder,
      status: data.status,
      amount: data.amount
    }));

    if (data.status === 2) {
      await sendConfirmationEmail(data);
      console.log('[Email enviado] Confirmación de pago enviada a vitralesdelcajon@gmail.com');
    }

    res.status(200).end();
  } catch (error) {
    console.error('[Flow confirmation error]', error.message);
    res.status(200).end();
  }
};
