import * as OrderService from '../../services/orderService.js';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { orderId } = req.query;
        const status = req.body.value;

        try {
            const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
            return res.status(200).json(updatedOrder);
        } catch (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({ error: 'Failed to update order status' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
