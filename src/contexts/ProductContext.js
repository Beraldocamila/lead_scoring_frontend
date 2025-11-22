import { createContext, useState, useEffect } from "react";
import productService from "../services/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState(null);

    useEffect(()=> {
        const fetchProducts = async () => {
            try {
                const res = await productService.getProducts();
                setProducts(res.data);
            } catch (error) {
                console.error("Error al traer los productos:", error);
                setProductError("No se pudieron cargar los productos.");
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                setProducts,
                loadingProducts,
                productError
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;
