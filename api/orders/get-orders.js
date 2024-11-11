import * as OrderService from '../../services/orderService.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { filter } = req.query;
        try {
            if (filter === "month") {
                const monthlyOrders = await OrderService.getMonthlyOrderTotal();
                return res.status(200).json(monthlyOrders);
            } else {
                const orders = await OrderService.getAllOrders();
                return res.status(200).json(orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
