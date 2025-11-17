import "./spinner.css";

const LoadingSpinner = ({ text }) => {
    return (
        <div className="container-spinner">
            <div className="spinner-circle"></div>
            <p>{text}</p>
        </div>
    );
};

export default LoadingSpinner;