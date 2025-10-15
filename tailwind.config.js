/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
const config = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // COLORES PRINCIPALES:
                'primary': '#5038ED',   // Azul Principal (Títulos, Bordes de Info)
                'app-fondo': '#FFFFFF', // Fondo General de la App (Blanco)
                'texto-claro': '#000000', // Texto Negro

                // Colores de Scoring
                'scoring-verde': '#2FA86F',    // Scoring alto, Botón Correo
                'scoring-rojo': '#EF4444', // Scoring bajo
                'scoring-naranja': '#F97316', // Scoring medio
            },
        },
    },
    plugins: [],
};

export default config;