/**
 * @main stripe
 */

// ----------------- EXTERNAL MODULES --------------------------

import config from 'config/config';

// ----------------- STRIPE INITIALIZATION -----------------------------

window.Stripe.setPublishableKey(config.STRIPE_KEY);