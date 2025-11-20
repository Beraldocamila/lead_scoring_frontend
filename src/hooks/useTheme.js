import { useEffect, useState } from "react";

/**
 * Este es nuestro hook personalizado para manejar el tema (Claro/Oscuro)
 * Persiste la preferencia en localStorage y aniade la clase 'dark-mode' al body.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Revisamos si ya existe una preferencia guardada
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      }
      // De caso contrario, revisamos la preferencia del sistema operativo
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light"; // Default
  });

  useEffect(() => {
    const body = document.body;
    
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
}