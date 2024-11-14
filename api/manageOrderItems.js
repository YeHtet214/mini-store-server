import * as OrderService from '../services/orderService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method } = req;

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (method === 'GET') {
        try {
            const orderItems = await OrderService.getAllOrderItems();
            return res.status(200).json(orderItems);
        } catch (error) {
            console.error('Error fetching order items:', error);
            return res.status(500).json({ error: 'Failed to fetch order items' });
        }
    } else if (method === 'POST') {
        try {
            const orderId = req.query;
            const items = req.body;
            const newItems = await OrderService.addOrderItems(orderId, items);
            return res.status(201).json(newItems);
        } catch (error) {
            console.error('Error creating order items:', error);
            return res.status(500).json({ error: 'Failed to create order items' });
        }

    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
