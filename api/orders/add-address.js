import * as OrderService from '../../services/orderService.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const address = req.body;
        try {
            const createdAddress = await OrderService.addNewAddress(address);
            return res.status(201).json(createdAddress);
        } catch (error) {
            console.error('Error adding address:', error);
            return res.status(500).json({ error: 'Failed to add address' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
