import api from "./api";

// GET todos los productos
const getProducts = () => {
    return api.get("/productos");
};

// POST nuevo producto
const addProduct = (data) => {
    return api.post("/productos", data);
};

// PUT producto existente
const updateProduct = (id, data) => {
    return api.put(`/productos/${id}`, data); 
};

// DELETE producto por ID
const deleteProduct = (id) => {
    return api.delete(`/productos/${id}`);
};

const productService = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};

export default productService;