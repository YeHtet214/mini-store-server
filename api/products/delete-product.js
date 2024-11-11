import * as ProductService from '../../services/productService.js';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { id } = req.query;
        try {
            const deletedProduct = await ProductService.deletedProduct(id);
            if (deletedProduct) {
                return res.status(200).json(deletedProduct);
            } else {
                return res.status(404).json({ msg: "Can't Delete the Product!" });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Failed to delete product' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
