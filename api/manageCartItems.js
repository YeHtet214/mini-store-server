import * as CartService from "../services/cartService.js";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method } = req;

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (method === 'GET') {
        try {
            const { user_id } = req.query;
            const cartItems = await CartService.getCartItemsByUserId(user_id);
            return res.status(200).json(cartItems);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching cart items", error });
        }
    }else if (method === 'POST') {
        // Creating a new cart item
        const { userId, productId, quantity } = req.body;
        console.log(req.body);
        try {
            const newCartItem = await CartService.insertNewCartItem(userId, productId, quantity);
            return res.status(200).json(newCartItem);
        } catch (error) {
            return res.status(500).json({ message: "Error creating cart item", error });
        }
    } else if (method === 'PUT') {
        // Updating cart item quantity
        const { userId, cartItemId, quantity } = req.body.data;
        try {
            const updatedItem = await CartService.updateCartItemQty(userId, cartItemId, quantity);
            return res.status(200).json(updatedItem);
        } catch (error) {
            return res.status(500).json({ message: "Error updating cart item quantity", error });
        }
    } else if (method === 'DELETE') {
        // Deleting a cart item
        const { userId, id } = req.body;
        try {
            const updatedItems = await CartService.deleteCartItem(userId, id);
            return res.status(200).json(updatedItems);
        } catch (error) {
            return res.status(500).json({ message: "Error deleting cart item", error });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
