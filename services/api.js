import axios from "axios";
import * as ProductServices from "./productService.js";
import { bulkCreate, checkIfDataFetched } from "../utils/index.js";

const config = {
    params: {
        offset: 5,
        limit: 5
    }
}

export const getAllProducts = async () => {
    const url = "https://fakestoreapi.com/products";

    try {
        if (await checkIfDataFetched()) { // Check to fetch or not, if data exist no longer fetch from api
            return await ProductServices.getAllProductsFromDb();
        }
        const response = await axios.get(url, config);
        const products = response.data;
        bulkCreate(products);
        return products;
    
    } catch (error) {
        console.log("Api error", error);
    }
}

