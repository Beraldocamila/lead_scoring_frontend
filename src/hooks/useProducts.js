import { useContext } from "react";
import ProductContext from "../contexts/ProductContext";

const useProducts = () => {
    const contextProduct = useContext(ProductContext);

    if (!contextProduct) {
        throw new Error("useProducts debe usarse dentro de un ProductProvider");
    }

    return contextProduct;
};

export default useProducts;