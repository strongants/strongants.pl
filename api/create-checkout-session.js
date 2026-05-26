const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {

  console.log("API START");

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    console.log("BODY:", body);

    const items = body.items || [];

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
      line_items,
      mode: 'payment',
      success_url: 'https://www.strongants.pl/dziekujemy.html',
      cancel_url: 'https://www.strongants.pl/koszyk.html',
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }
}
