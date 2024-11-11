import * as OrderService from '../../services/orderService.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const orderItems = await OrderService.getAllOrderItems();
            return res.status(200).json(orderItems);
        } catch (error) {
            console.error('Error fetching order items:', error);
            return res.status(500).json({ error: 'Failed to fetch order items' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
