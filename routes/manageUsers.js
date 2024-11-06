import express from "express";
import * as UserService from "../services/userService.js";

const router = express.Router();

router.post('/users/create', async (req, res) => {
    const userData = req.body;
    const createdUser = await UserService.createNewUserByAdmin(userData);
    res.json(createdUser);
})

router.put('/users/:id/update', async (req, res) => {
    const userData = req.body;
    const updatedUser = await UserService.updateUserByAdmin(userData, req.params.id);
    res.json(updatedUser);
})

export default router;