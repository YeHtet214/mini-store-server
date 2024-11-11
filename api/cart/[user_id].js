import * as CartService from "../../services/cartService.js";

export default async function handler(req, res) {
    const { user_id } = req.query;

    if (req.method === 'GET') {
        try {
            const cartItems = await CartService.getCartItemsByUserId(user_id);
            return res.status(200).json(cartItems);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching cart items", error });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
