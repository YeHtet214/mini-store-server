import * as ProductService from '../../services/productService.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;
        try {
            const product = await ProductService.getProductById(id);
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
