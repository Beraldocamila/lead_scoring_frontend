import api from './api'; 

// Función de LOGIN
const login = (username, clave) => {
    return api.post("/login", {
        username,
        clave,
    });
};

// Función de REGISTRO
const register = (username, clave, email) => {
    return api.post("/register", {
        username,
        clave,
        email,
    })
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
};


const authService = {
    login,
    register,
};

export default authService;