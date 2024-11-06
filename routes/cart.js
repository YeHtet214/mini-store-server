import express from "express";
import * as CartService from "../services/cartService.js";

const router = express.Router();

// Route to get the cart items of the user
router.get('/:user_id/cartItems', async (req, res) => {
      const user_id = req.params.user_id;
      const cartItems = await CartService.getCartItemsByUserId(user_id);
      res.status(200).json(cartItems);
})

// Route to create new Cart Item
router.post('/items/update', async (req, res) => {
      const { userId,productId, quantity } = req.body.data;
      const updateCartItems = await CartService.insertNewCartItem(userId, productId, quantity);
      res.status(200).json(updateCartItems);
});

// Route to update Cart Item Qty 
router.put('/items/update', async (req, res) => {
      const { userId, cartItemId, quantity} = req.body.data;
      const updatedItems = await CartService.updateCartItemQty(userId, cartItemId, quantity);
      res.status(200).json(updatedItems);
})

// Route to Delete Cart Item
router.delete('/items/update', async (req, res) => {
      const { id, userId } = req.body;
      const updatedItems = await CartService.deleteCartItem(userId, id);
      res.status(200).json(updatedItems);
})


export default router;
