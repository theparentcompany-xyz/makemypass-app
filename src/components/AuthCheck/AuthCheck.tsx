import { Navigate, Outlet } from "react-router-dom";

const AuthCheck: React.FC = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const redirection = window.location.pathname.slice(1);

    if (!refreshToken) {
        return <Navigate to={`/login?ruri=${redirection}`} />;
    }

    return <Outlet />;
};

export default AuthCheck;
