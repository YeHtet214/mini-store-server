import { client } from "../db/index.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
const jwt_secret = process.env.JWT_SECRET;
import * as CartService from "../services/cartService.js";

const ROUND_SALT = 10;
const DEFAULT_ROLE = "user"; 

export const getUserByEmail = async (email) => {
      try {
            const userData = await client.query(
                  "SELECT * FROM users WHERE email=$1",
                  [email]
            )
            return userData.rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const getUserDataById = async (id) => {
      try {
            const userData = await client.query(
                  "SELECT * FROM users WHERE user_id=$1",
                  [id]
            )
            return userData.rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const getAllUsers = async () => {
      try {
            const { rows } = await client.query("SELECT * FROM users");
            return rows;
      } catch (error) {
            throw new Error(error);
      }
}

export const registerUser = async (name, email, enterPassword, role = DEFAULT_ROLE) => {
      try {
            const existingUser = await getUserByEmail(email);
            if (existingUser) { // if the user already exist, redirect to the login page again
                  // return await authenticateUser(email, enterPassword);
                  return { status: 409, msg: "User Already Exist! Please login again" }
            } else {
                  const hash = await bcrypt.hash(enterPassword, ROUND_SALT);
                  const newUser = await client.query(
                        `INSERT INTO users (name, email, password, role) 
                        VALUES ($1, $2, $3, $4) RETURNING *`,
                        [name, email, hash, role]
                  )
                  if (newUser.rows.length > 0) {
                        // Create cart for associate user
                        await CartService.createCart(newUser.rows[0].user_id);
                        let value = await authenticateUser(email, enterPassword);
                        return value;
                  }
            }
      } catch (error) {
            console.log(error);
            return ("Database Error");
      }
}

export const authenticateUser = async (email, enterPassword) => {
      const userData = await getUserByEmail(email);

      if (!userData) {
            throw new Error("Email not found")
      }
      const validPassword = await bcrypt.compare(enterPassword, userData.password);

      if (!validPassword) {
            throw new Error("Incorrect Password")
      }
      const payload = {
            id: userData.user_id,
            role: userData.email === "yhtet1934@gmail.com" || userData.role === "admin" ? "admin" : "user"
      }
      const token = jwt.sign(payload, jwt_secret);
      return {token, user_id: userData.user_id };
}

export const deleteUser = async (userId) => {
      try {
            const { rows } = await client.query(
                                    `DELETE FROM users
                                    WHERE user_id = $1
                                    RETURNING *`, 
                                    [userId]
                              );
            return rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const createNewUserByAdmin = async ({ name, email, password, role}) => {
      try {
            const existingUser = await getUserData(email);
            if (existingUser) res.sendStatus(303);
            const hash = await bcrypt.hash(password, ROUND_SALT);
            const newUser = await client.query(
                  `INSERT INTO users (name, email, password, role) 
                  VALUES ($1, $2, $3, $4) RETURNING *`,
                  [name, email, hash, role]
            )
            if (newUser.rows.length > 0) {
                  // Create cart for associate user
                  await CartService.createCart(newUser.rows[0].user_id);
                  let value = await authenticateUser(email, password);
                  if (value) return newUser.rows[0];
            }
      } catch (error) {
            console.log(error)
      }
}

export const updateUserByAdmin = async (userData, id) => {
      const UPDATE_COLS = [];
      const values = [];

      Object.keys(userData).forEach(key => {
            if (userData[key]) {
                  UPDATE_COLS.push(`${key}=$${UPDATE_COLS.length + 1}`);
                  values.push(userData[key]);
            }
      });

      const FORMAT_COLS_QUERY = UPDATE_COLS.join(", ");
      console.log(FORMAT_COLS_QUERY);
      values.push(id);
      const query = `UPDATE users SET ${UPDATE_COLS} WHERE user_id = $${values.length} RETURNING *`;
      console.log(query);
      console.log(values);
      try {
            const { rows } = await client.query(query, values);
            return rows[0];
      } catch (err) {
            console.log(err);
      }

}