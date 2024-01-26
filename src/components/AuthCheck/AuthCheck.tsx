import { Navigate, Outlet, useParams } from "react-router-dom";

const AuthCheck: React.FC = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const redirection = window.location.pathname.slice(1);

  const { eventTitle } = useParams<{ eventTitle: string }>();

  if (!refreshToken) {
    return <Navigate to={`/login?ruri=${redirection}`} />;
  }

  if (window.location.pathname === `/${eventTitle}`) {
    return <Navigate to={`/${eventTitle}/overview`} />;
  }

  return <Outlet />;
};

export default AuthCheck;
