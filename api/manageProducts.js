import * as api from '../services/api.js';
import * as ProductService from "../services/productService.js";
import multer from 'multer';
import multiparty from 'multiparty';  // Import multiparty for parsing form data

const upload = multer({ dest: '/tmp/uploads/' });

export const config = {
    api: {
        bodyParser: false,  // Disable the default body parser to handle multipart form data
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method } = req;

    // Handle OPTIONS method for CORS preflight request
    if (method === 'OPTIONS') {
        return res.status(200).end(); // Respond OK to preflight
    }

    if (method === 'GET') {
        try {
            if (req.query.id) { // get product by id
                const product = await ProductService.getProductById(req.query.id);
                return res.status(200).json(product);
            } else {
                const products = await api.getAllProducts();
                return res.status(200).json(products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    } else if (method === 'POST') {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error processing form data' });
            }

            const { name, category, price, stock, description } = fields;
            const image = files.image ? files.image[0].path : null;

            try {
                const newProduct = await ProductService.uploadNewProductByAdmin({
                    name,
                    category,
                    price,
                    stock,
                    image,
                    description,
                });
                return res.status(200).json(newProduct);
            } catch (error) {
                console.error('Error uploading product:', error);
                return res.status(500).json({ error: 'Failed to upload new product' });
            }
        });
    } else if (method === 'DELETE') {
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
    } else if (method === 'PUT') {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error processing form data' });
            }

            const data = fields;
            const image = files.image ? files.image[0].path : null;

            try {
                const updatedProduct = await ProductService.updateProduct({
                    ...data,
                    image,
                });
                return res.status(200).json(updatedProduct);
            } catch (error) {
                console.error('Error updating product:', error);
                return res.status(500).json({ error: 'Failed to update product' });
            }
        });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
