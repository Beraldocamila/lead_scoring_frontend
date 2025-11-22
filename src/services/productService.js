import api from "./api";

// GET todos los productos
const getProducts = () => {
    return api.get("/productos");
};

const productService = {
    getProducts
};

export default productService;