import express from "express";
import multer from "multer";
import * as ProductService from "../services/productService.js";
import * as api from "../services/api.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get('/', async (req, res) => {
      const products = await api.getAllProducts();
      res.json(products)
})

router.get('/:id', async (req, res) => {
      const id = req.params.id;
      const product = await ProductService.getProductById(id);
      res.json(product);
});

// Upload New Product by Admin Route
router.post('/manage/add', upload.single('image'), async (req, res) => {
      const { name, category, price, stock, description } = req.body;
      const image = req.file && req.file.path;
      const newProduct = await ProductService.uploadNewProductByAdmin({ name, category, price, stock, image, description});      
      res.json(newProduct);
});

// Update the Product Route
router.put('/manage/:id/update', upload.single('image'), async (req, res) => {
      const data = req.body;
      const image = req.file && req.file.path;
      const updatedProduct = await ProductService.updateProduct({ ...data, image });
      res.json(updatedProduct);
})

// Delete Product Route
router.delete('/manage/:id/delete', async (req, res) => {
      const productId = req.params.id;
      const deletedProduct = await ProductService.deletedProduct(productId);
      deletedProduct ? res.json(deletedProduct) : res.json({ msg: "Can't Delete the Product!"});
})

export default router;