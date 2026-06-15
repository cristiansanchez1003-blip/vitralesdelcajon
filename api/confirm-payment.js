const { flowRequest } = require('./_flow');

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

    res.status(200).end();
  } catch (error) {
    console.error('[Flow confirmation error]', error.message);
    res.status(200).end();
  }
};
