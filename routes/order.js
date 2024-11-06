import express from "express";
import * as OrderService from "../services/orderService.js";

const router = express.Router();

router.get("/", async (req, res) => {
      const { filter } = req.query;
      if (filter === "month") {
            const monthlyOrders = await OrderService.getMonthlyOrderTotal();
            res.status(200).json(monthlyOrders);
      } else {
            const orders = await OrderService.getAllOrders();
            res.status(200).json(orders);
      }
});

router.get("/items", async (req, res) => {
      const orderItems = await OrderService.getAllOrderItems();
      res.json(orderItems);
});

router.post("/", async (req, res) => {
      const { userId, totalAmount } = req.body;
      const order = await OrderService.createNewOrder({ userId, totalAmount });
      res.json(order);
})

router.post("/:orderId/add", async (req, res) => {
      const orderId = req.params.orderId;
      const items = req.body;
      if (!orderId || !items) {
          return res.status(304).json({ msg: "" });
      }
      const newItems = await OrderService.addOrderItems(orderId, items);
      return res.json(newItems);
})

router.put("/:orderId/update", async (req, res) => {
      const { orderId } = req.params;
      const status = req.body.value;
      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
})

router.delete("/:orderId/delete", async (req, res) => {
      const orderId = req.params.orderId;
      const deletedOrderId = await OrderService.deleteOrder(orderId);
      res.json(deletedOrderId);
})

router.post("/address", async (req, res) => {
    const address = req.body;
    const createdAddress = await OrderService.addNewAddress(address);
    return res.json(createdAddress);
});
  
export default router;