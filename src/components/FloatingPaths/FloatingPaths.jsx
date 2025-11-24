import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingPaths = ({ position, paused }) => {
    const paths = useMemo(() => {
        return Array.from({ length: 36 }, (_, i) => ({
            id: i,
            d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
                380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
                152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
                684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
            width: 0.5 + i * 0.03,
            duration: 20 + Math.random() * 10 
        }));
    }, [position]);

    return (
        <div className="floating-paths-container">
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 696 316" fill="none">
            <title>Floating Paths</title>
            {paths.map((path) => (
            <motion.path
                key={path.id}
                d={path.d}
                stroke="currentColor"
                strokeWidth={path.width}
                strokeOpacity={0.1 + path.id * 0.03}
                initial={{ pathLength: 0.3, opacity: 0.6 }}
                // Pausa
                animate={paused 
                ? { opacity: 0, strokeWidth: 0 } // Si pausa: Desaparecer y hacerse finas
                : { 
                    opacity: [0.3, 0.6, 0.3], 
                    pathOffset: [0, 1, 0],
                    strokeWidth: path.width // Mantener ancho original
                }
            }
            transition={paused
                // Si se preciona la pausa va a tardar 1.5s en desaparecer suavemente (sin repeat)
                ? { duration: 1.5, ease: "easeInOut" } 
                // Si estamos en modo play la animacion es normal e infinita
                : { 
                    duration: path.duration,
                    repeat: Infinity,
                    ease: "linear",
                    // Aseguramos que el pathOffset use la duracion correcta
                    pathOffset: { duration: path.duration, repeat: Infinity, ease: "linear" }
                }
            }
            />
            ))}
        </svg>
        </div>
    );
};

export default FloatingPaths;