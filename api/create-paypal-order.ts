import type { VercelRequest, VercelResponse } from '@vercel/node';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const MERCHANT_EMAIL = 'tu_email_paypal@example.com'; // Reemplaza con tu email de PayPal

async function createOrder(items: any[]) {
  const accessToken = await getPayPalAccessToken();
  
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const order = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
          },
          description: 'Rust VIP Packages',
          payee: {
            email_address: MERCHANT_EMAIL // Tu email de PayPal aquí
          }
        },
      ],
      application_context: {
        brand_name: 'RUST VIP CUBA_GAMER',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'https://tu-dominio.com/success',
        cancel_url: 'https://tu-dominio.com/cancel'
      }
    }),
  });

  return order.json();
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { items } = req.body;
    const order = await createOrder(items);
    res.status(200).json(order);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error creating PayPal order' });
  }
}
