import { createNewProduct, getAllProductsFromDb } from "../services/productService.js";

export const checkIfDataFetched = async () => {
      try {
            const products = await getAllProductsFromDb();
            return (true ? products.length : false);
      } catch (error) {
            console.log(error);
      }
}

export const bulkCreate = (products) => {
      products?.map(prod => {
            if (!prod.stock) prod.stock = Math.floor((Math.random() * 140) + 10);
            createNewProduct(prod);
      })
}