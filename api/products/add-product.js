import * as ProductService from '../../services/productService.js';
import multer from 'multer';

const upload = multer({ dest: '/tmp/uploads/' });

export const config = {
    api: {
        bodyParser: false,  // Disable the default body parser to handle multipart form data
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const form = new multiparty.Form();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error processing form data' });
                }

                const { name, category, price, stock, description } = fields;
                const image = files.image ? files.image[0].path : null;

                const newProduct = await ProductService.uploadNewProductByAdmin({
                    name,
                    category,
                    price,
                    stock,
                    image,
                    description,
                });

                return res.status(200).json(newProduct);
            });
        } catch (error) {
            console.error('Error uploading product:', error);
            return res.status(500).json({ error: 'Failed to upload new product' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
