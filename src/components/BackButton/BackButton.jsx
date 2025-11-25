import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./backButton.css";

const BackButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // vuelve a la página anterior
    } else {
      navigate(fallback); // si no hay historial, usa fallback
    }
  };

  return (
    <div className="fixed-return-button" onClick={handleBack}>
      <FaArrowLeft className="return-icon" />
      <span className="return-text-hover">Volver</span>
    </div>
  );
};

export default BackButton;
