import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export default async function handler(req, res) {

  try {

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

    console.log("BODY:", req.body);

    const items = req.body.items || [];

    const line_items = items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.nazwa || 'Produkt'
        },
        unit_amount: Math.round((item.cena || 0) * 100)
      },
      quantity: item.ilosc || 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,

      success_url: 'https://strongants.pl/dziekujemy.html',
      cancel_url: 'https://strongants.pl/koszyk.html',
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (err) {

    console.error("STRIPE ERROR:", err);

    return res.status(500).json({
      error: err.message
    });

  }

}
