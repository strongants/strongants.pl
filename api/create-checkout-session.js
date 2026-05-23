const Stripe = require('stripe');

module.exports = async function handler(req, res) {

  try {

    console.log("START API");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

    console.log("BODY:");
    console.log(req.body);

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

    console.log("LINE ITEMS:");
    console.log(line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',

      success_url: 'https://strongants.pl/dziekujemy.html',
      cancel_url: 'https://strongants.pl/koszyk.html',
    });

    console.log("SESSION OK");

    return res.status(200).json({
      url: session.url
    });

  } catch (err) {

    console.error("BŁĄD:");
    console.error(err);

    return res.status(500).json({
      error: err.message,
      full: err
    });

  }

};
