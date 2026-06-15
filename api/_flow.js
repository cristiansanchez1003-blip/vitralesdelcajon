const crypto = require('crypto');
const VITRALES_PRODUCTS = require('../products.js');

const FLOW_API_BASE = process.env.FLOW_API_BASE || 'https://www.flow.cl/api';
const VALID_SHIPPING_AMOUNTS = [0, 7000, 12000];

function signParams(params, secretKey) {
  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map((key) => `${key}${params[key]}`).join('');
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

async function flowRequest(path, params, method = 'POST') {
  const secretKey = process.env.FLOW_SECRET_KEY;
  const signedParams = { ...params, s: signParams(params, secretKey) };
  const body = new URLSearchParams(signedParams);

  const url = `${FLOW_API_BASE}${path}`;
  const response = await fetch(method === 'GET' ? `${url}?${body.toString()}` : url, {
    method,
    headers: method === 'GET' ? undefined : { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: method === 'GET' ? undefined : body.toString()
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

function findProduct(id) {
  return VITRALES_PRODUCTS.find((product) => product.id === id);
}

function calculateAmount(items, shippingAmount) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error('El carrito está vacío.');
  }
  if (!VALID_SHIPPING_AMOUNTS.includes(Number(shippingAmount))) {
    throw new Error('Costo de envío inválido.');
  }

  let subtotal = 0;
  for (const item of items) {
    const product = findProduct(item.id);
    if (!product) throw new Error(`Producto no encontrado: ${item.id}`);
    if (product.inStock === false) throw new Error(`Producto sin stock: ${product.name}`);
    const qty = Number(item.qty) || 0;
    if (qty <= 0) throw new Error(`Cantidad inválida para: ${product.name}`);
    subtotal += product.price * qty;
  }

  return subtotal + Number(shippingAmount);
}

module.exports = { signParams, flowRequest, findProduct, calculateAmount, FLOW_API_BASE };
