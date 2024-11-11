import express from 'express';
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
    const {products} = req.body;

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: product.name,
                images: product.image
            },
            unit_amount: product.price
        },
        quantity: product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "https://mini-store-omega.vercel.app/success",
        cancel_url: "https://mini-store-omega.vercel.app/cancel"
    })

    res.json({id: session.id});
})

export default router;