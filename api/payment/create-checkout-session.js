import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: product.image,
                },
                unit_amount: product.price * 100, // Stripe expects the amount in cents
            },
            quantity: product.quantity,
        }));

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: 'http://localhost:5173/success', // Update with actual domain
                cancel_url: 'http://localhost:5173/cancel', // Update with actual domain
            });

            res.status(200).json({ id: session.id });
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
