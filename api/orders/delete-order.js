import * as OrderService from '../../services/orderService.js';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { orderId } = req.query;
        try {
            const deletedOrderId = await OrderService.deleteOrder(orderId);
            return res.status(200).json(deletedOrderId);
        } catch (error) {
            console.error('Error deleting order:', error);
            return res.status(500).json({ error: 'Failed to delete order' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
