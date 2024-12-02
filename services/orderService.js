import { client } from "../db/index.js";

export const getAllOrders = async () => {
      try {
            const { rows } = await client.query(`
                  SELECT order_id, user_id, order_date, total_amount, order_status 
                  FROM orders
//                   INNER JOIN users 
//                   ON orders.user_id = users.user_-id;
            `);
            return rows;
      } catch (error) {
          return {success: false, msg: "There is an error getting the orders: ", error};
      }
}

export const getAllOrderItems = async () => {
      try {
            const { rows } = await client.query(`
                  SELECT order_item_id, name, order_id, orderitems.price, orderitems.quantity, sub_total
                  FROM orderitems
                  INNER JOIN products 
                  ON orderitems.product_id = products.id;
            `);
            return rows;
      } catch (error) {
            return { success: false, msg: "There is an error getting the order items: ", error};
      }
}

export const createNewOrder = async ({ userId, totalAmount }) => {
    const query = `
            INSERT INTO orders (user_id, total_amount, order_status)
            VALUES ($1, $2, $3)
            RETURNING *
      `;

    try {
        const { rows } = await client.query(query, [
            userId,
            parseInt(totalAmount),
            "Processing",
        ]);
        console.log("Created order: ", rows);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const addOrderItems = async (orderId, items) => {
    const query = `
            INSERT INTO order_item (order_id, product_id, quantity, sub_total)
            VALUES ($1, $2, $3, $4)
            RETURNING *
      `;

    try {
        const NEW_ORDER_ITEMS = await Promise.all(
            items?.map(async (item) => {
                const { rows } = await client.query(query, [
                    parseInt(orderId),
                    item.product_id,
                    item.quantity,
                    item.quantity * item.price,
                ]);
                return rows[0];
            })
        );

        console.log("New order Items: ", NEW_ORDER_ITEMS)

        return NEW_ORDER_ITEMS;
    } catch (error) {
        console.log(error);
    }
};

export const updateOrderStatus = async (orderId, status) => {
    const query = `
            UPDATE orders SET status = $1
            WHERE order_id = $2 RETURNING *;
      `;
    try {
        const { rows } = await client.query(query, [status, orderId]);
        return rows[0];
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const { rows } = await client.query(
            `
                  DELETE FROM orders 
                  WHERE order_id = $1
                  Returning order_id
            `,
            [orderId]
        );
        return rows[0];
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

export const getMonthlyOrderTotal = async () => {
    try {
        const { rows } = await client.query(`
                  SELECT 
                        TO_CHAR(DATE_TRUNC('month', order_date), 'YYYY-MM') AS month,
                        SUM(total_amount) AS total_sales
                  FROM
                        orders
                  GROUP BY 
                        DATE_TRUNC('month', order_date)
                  ORDER BY 
                        month;`);
        return rows;
    } catch (error) {
        console.log(error);
    }
};

export const addNewAddress = async (userId, location) => {
    const { city, postcode, country, address, state } = location;
    console.log("Address", address, "City: ", city, "State: ", state, "Postcode: ", postcode, "Country: ", country);
    try {
        const { rows } = await client.query(
            `
                  INSERT INTO addresses (address_line_1, city, state, postal_code, country, user_id)
                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
            `,
            [address, city, state, postcode, country, userId]
        );
        return rows[0];
    } catch (error) {
        if (error.code == 23505) {
            // checking error code for duplilcate entry
            return { status: 200, msg: "Address already exist", data: location  };
        } else {
            console.log(error);
        }
    }
};
