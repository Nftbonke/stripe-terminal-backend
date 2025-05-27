const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.json());

const PORT = process.env.PORT || 4242;

// Replace with your Stripe Terminal Location ID
const TERMINAL_LOCATION_ID = 'tml_GCwUjw1s7h952T';

app.post('/register-reader', async (req, res) => {
  const { registrationCode, label } = req.body;

  try {
    const reader = await stripe.terminal.readers.create({
      registration_code: registrationCode,
      label: label,
      location: TERMINAL_LOCATION_ID,
    });
    res.json(reader);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card_present'],
      capture_method: 'manual',
    });
    res.json(paymentIntent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/capture-payment-intent', async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
