import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  console.log("START API");

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    console.log("BODY:", req.body);

    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        error: 'Brak items'
      });
    }

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

    console.log("LINE ITEMS:", line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',

      success_url: 'https://www.strongants.pl/dziekujemy.html',
      cancel_url: 'https://www.strongants.pl/koszyk.html',
    });

    console.log("SESSION:", session.url);

    return res.status(200).json({
      url: session.url
    });

  } catch (err) {

    console.error("BŁĄD:");
    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }
}
