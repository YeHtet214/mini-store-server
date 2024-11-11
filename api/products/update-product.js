import * as ProductService from '../../services/productService.js';
import multer from 'multer';

const upload = multer({ dest: '/tmp/uploads/' });

export const config = {
    api: {
        bodyParser: false, // Disable the default body parser to handle multipart form data
    },
};

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            const form = new multiparty.Form();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error processing form data' });
                }

                const data = fields;
                const image = files.image ? files.image[0].path : null;

                const updatedProduct = await ProductService.updateProduct({
                    ...data,
                    image,
                });

                return res.status(200).json(updatedProduct);
            });
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ error: 'Failed to update product' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
s