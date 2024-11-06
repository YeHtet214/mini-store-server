import { client } from "../db/index.js";

// GET METHODS
export const getAllProductsFromDb = async () => {
    const { rows } = await client.query("SELECT * FROM products");

    return rows;
}

export const getProductById = async (id) => {
    try {
        const { rows } = await client.query("SELECT * FROM products WHERE id = $1", [id]);
        return rows[0];
    } catch(error) {
        console.log("Database error ", error);
    }
}

export const getProductByName = async (title) => {
    const { rows } = await client.query("SELECT * FROM products WHERE title = $1", [title]);

    return rows[0];
}

export const getProductsByCategory = async (category) => {
    const { rows } = await client.query("SELECT * FROM products WHERE category = $1", [category]);

    return rows;
}

// POST METHODS
export const createNewProduct = async ({ title, price, category, description, image, stock }) => {
    try {
        const res = await client.query(
                            "INSERT INTO products (name, price, category, description, image, stock) VALUES ($1, $2, $3, $4, $5, $6)",
                            [title, price, category, description, image, stock]
                        );
    } catch (error) {
        console.log(error);
    }
}

export const uploadNewProductByAdmin = async ({ name, category, price, stock, image, description }) => {
    try {
        const { rows } = await client.query(
            "INSERT INTO products (name, category, price, stock, image, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, category, Number(price), Number(stock), image, description]
        );
        return rows[0];
    } catch (err) {
        throw new Error(err);
    }
}

export const updateProduct = async ({ id, name, image, price, stock, description }) => {
    try {
        const { rows } = await client.query(`
            UPDATE products
            SET name = $1, price = $2, image = $3, stock = $4, description = $5
            WHERE id = $6 RETURNING *
            `, [name, price, image, stock, description, id])

        return rows[0];
    } catch (err) {
        throw new Error(err);
    }
}

export const deletedProduct = async (id) => {
    // Before deleting the product check the status of the order if processing not deleted
    const getPendingOrdersQuery =  `
        SELECT * FROM orders 
        WHERE order_id IN (
            SELECT order_id FROM orderitems
            WHERE product_id = $1
        )
        AND status = $2
    `;

    try {
        const pendingOrders = (await client.query(getPendingOrdersQuery, [id, 'pending'])).rows; 
        console.log(pendingOrders);
        if (pendingOrders.length > 0) {
            return { success: false, message: 'Cannot Delete the product. An order is still in the pending state'};
        }

        await client.query('DELETE FROM products WHERE id = $1', [id]);
        return { success: true, message: 'Product Successfully Deleted!'}

    } catch (error) {
        throw new Error(error);
    }
}