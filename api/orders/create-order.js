import * as OrderService from '../../services/orderService.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, totalAmount } = req.body;
        try {
            const order = await OrderService.createNewOrder({ userId, totalAmount });
            return res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);
            return res.status(500).json({ error: 'Failed to create order' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
