import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        error: 'Brak produktów',
      });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.nazwa || 'Produkt',
        },
        unit_amount: Math.round(Number(item.cena) * 100),
      },
      quantity: item.ilosc || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',

      success_url:
        'https://strongants.pl/dziekujemy.html',

      cancel_url:
        'https://strongants.pl/koszyk.html',
    });

    return res.status(200).json({
      url: session.url,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
