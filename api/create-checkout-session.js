import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    console.log("API działa");

    const { items } = req.body;

    console.log(items);

    const line_items = items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.nazwa
        },
        unit_amount: Math.round(item.cena * 100)
      },
      quantity: item.ilosc
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',

      success_url: 'https://strongants.pl/dziekujemy.html',
      cancel_url: 'https://strongants.pl/koszyk.html',
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (err) {

    console.error("BŁĄD STRIPE:");
    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }
}
