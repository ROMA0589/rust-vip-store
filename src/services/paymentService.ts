import { CartItem } from '../types';

export const createPayPalOrder = async (items: CartItem[]) => {
  try {
    console.log('Iniciando pago...', items);
    
    // Llamada directa a PayPal Sandbox
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PayPal-Request-Id': Date.now().toString(),
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_PAYPAL_CLIENT_ID}:${import.meta.env.VITE_PAYPAL_CLIENT_SECRET}`)}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: items.reduce((sum, item) => sum + item.price, 0).toFixed(2)
          },
          description: `Compra VIP - ${items.map(item => item.name).join(', ')}`
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error PayPal:', data);
      throw new Error(data.message || 'Error en el proceso de pago');
    }

    console.log('Respuesta PayPal:', data);
    return data;
  } catch (err: any) {
    console.error('Error detallado:', err);
    throw new Error('Error al conectar con PayPal. Verifica tu conexión.');
  }
};
