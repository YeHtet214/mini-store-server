import { client } from "../db/index.js";

const getCartIdByUser = async (userId) => {
      try {
            const { rows } = await client.query("SELECT id FROM cart WHERE user_id = $1", [userId]);
            const cartId = rows[0] ? rows[0].id : null;
            return cartId;
      } catch (error) {
            console.log(error);
            throw new Error(error);
      }
}

export const getCartItemsByUserId = async (user_id) => {
      const cartId = await getCartIdByUser(user_id);
      const query = `
                  SELECT 
                        cart_items.*,
                        products.name,
                        products.category,
                        products.price,
                        products.image,
                        products.description
                  FROM 
                        cart_items
                  INNER JOIN 
                        cart ON cart_items.cart_id = cart.id
                  INNER JOIN
                        products ON cart_items.product_id = products.id
                  WHERE cart.id = $1
            `;
      try {
            const res = await client.query(query, [cartId]);
            return res.rows;
      } catch (error) {
            throw new Error(error.message);
      }
}

export async function getCartItemsByItemId(id) {
      const query = `
      SELECT 
            cart_items.*,
            products.name,
            products.category,
            products.image,
            products.description
      FROM 
            cart_items
      INNER JOIN
            products ON cart_items.product_id = products.id
      WHERE cart_items.id = $1`;

      try {
            const res = await client.query(query, [id]);
            return res.rows;
      } catch (error) {
            throw new Error(error.message);
      }
}

export const createCart = async (user_id) => {
      try {
            const isExist = (await client.query("SELECT * FROM cart WHERE user_id = $1", [user_id])).rows.length > 0;
            if (isExist) return;
            const { rows } = await client.query("INSERT INTO cart (user_id) VALUES ($1) RETURNING *;", [user_id]);
            const res = await client.query("SELECT * FROM cart WHERE user_id = $1", [user_id]);
            return { message: 'success' };
      } catch (error) {
            console.log("Cart Creation Error: ", error);
            throw new Error(error);
      }
}

export const insertNewCartItem = async (user_id, productId, quantity) => {
      const cartId = await getCartIdByUser(user_id);
      console.log("Cart if of user", cartId, user_id);
      try {
            await client.query("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *", [cartId, productId, quantity]);
            return getCartItemsByUserId(user_id);
      } catch (error) {
            throw new Error(error.message);
      }
}

export const updateCartItemQty = async (user_id, cartItemId, quantity) => {
      await client.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [quantity, cartItemId]);
      return getCartItemsByUserId(user_id);
}

export const deleteCartItem = async (user_id, cartItemId) => {
      await client.query("DELETE FROM cart_items WHERE id = $1", [cartItemId]);
      return getCartItemsByUserId(user_id);
}
