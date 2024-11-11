import * as api from '../../services/api.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const products = await api.getAllProducts();
            return res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
