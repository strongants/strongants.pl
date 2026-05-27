const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  try {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "pln",

            product_data: {
              name: "Strong Ants Produkt",
            },

            unit_amount: 6999,
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: "https://www.strongants.pl/dziekujemy.html",

      cancel_url: "https://www.strongants.pl/koszyk.html",
    });

    res.status(200).json({
      url: session.url,
    });

  } catch (err) {

    console.error("STRIPE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};
