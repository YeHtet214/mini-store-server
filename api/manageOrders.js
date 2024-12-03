import * as OrderService from '../services/orderService.js';
import Order from "../routes/order.js";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method } = req;

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (method === 'GET') {
        const { filter } = req.query;
        try {
            const orders = filter && filter === "month" ? await OrderService.getMonthlyOrderTotal() : await OrderService.getAllOrders();
            console.log("Getting all order returned: ", orders);
            return res.status(200).json(orders);

        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
    } else if (method === 'POST') {
        const { userId, totalAmount, city, country, postcode, state, address } = req.query;
        console.log(userId, city, country, postcode);
        try {
            if (city && country && postcode) { // add new address rather than user
                const createdAddress = await OrderService.addNewAddress(userId, { city, country, postcode, address, state });
                return res.status(201).json(createdAddress);
            } else {
                const order = await OrderService.createNewOrder({ userId, totalAmount });
                console.log(order);
                return res.status(201).json(order);
            }
        }

         catch (error) {
            console.error('Error creating order:', error);
            return res.status(500).json({ error: 'Failed to create order' });
        }
    } else if (method === 'DELETE') {
        const { orderId } = req.query;
        try {
            const deletedOrderId = await OrderService.deleteOrder(orderId);
            return res.status(200).json(deletedOrderId);
        } catch (error) {
            console.error('Error deleting order:', error);
            return res.status(500).json({ error: 'Failed to delete order' });
        }
    } else if (method === 'PUT') {
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
