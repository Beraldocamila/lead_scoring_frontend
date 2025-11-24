import { createContext, useState } from "react";
import productService from "../services/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState(null);

    // Estados para producto seleccionado
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loadingSelectedProduct, setLoadingSelectedProduct] = useState(false);
    const [selectedProductError, setSelectedProductError] = useState(null);

    // Traer todos los productos (Explícito, no auto-ejecutado)
    const getProducts = async () => {
        setLoadingProducts(true);
        setProductError(null);
        try {
            const res = await productService.getProducts();
            setProducts(res.data);
            setProductError(null); 
        } catch (error) {
            console.error("Error al traer los productos:", error);
            setProductError(error); 
            throw error;
        } finally {
            setLoadingProducts(false);
        }
    };

    // Funciones CRUD que llaman a getProducts para refrescar la lista
    const addProduct = async (formData) => {
        try {
            await productService.addProduct(formData);
            await getProducts();
        } catch (error) {
            throw error;
        }
    };

    const updateProduct = async (id, formData) => {
        try {
            await productService.updateProduct(id, formData);
            await getProducts();
        } catch (error) {
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productService.deleteProduct(id);
            await getProducts(); 
        } catch (error) {
            throw error;
        }
    };

    const getProductByIdContext = async (id) => {
        setLoadingSelectedProduct(true);
        try {
            const product = products.find(p => p.id_producto === id);
            
            if (!product) {
                throw new Error("Producto no encontrado.");
            }
            
            setSelectedProduct(product);
            setSelectedProductError(null);
        } catch (error) {
            console.error("Error al obtener producto:", error);
            setSelectedProductError(error);
            setSelectedProduct(null);
        } finally {
            setLoadingSelectedProduct(false);
        }
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                loadingProducts,
                productError,
                
                selectedProduct,
                loadingSelectedProduct,
                selectedProductError,

                getProducts,      
                getProductByIdContext,
                addProduct,      
                updateProduct,   
                deleteProduct,   
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
export default ProductContext;
