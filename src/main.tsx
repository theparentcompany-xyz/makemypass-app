import ReactDOM from "react-dom/client";
import "./index.css";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Home from "./pages/app/Home/Home";
import "./index.css";
import LandingPage from "./pages/app/LandingPage/LandingPage";
import { Toaster, ToastPosition } from "react-hot-toast";
import AdminStats from "./pages/app/Overview/AdminStats";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/events",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/overview",
        element: <AdminStats />,
    },
]);

const toasterProps = {
    containerStyle: {
        fontFamily: "Inter, sans-serif",
    },
    toastOptions: {
        style: {
            backgroundColor: "#1B2725",
            border: "0.5px solid #232A2B",
            color: "#ffffff",
        },
    },
    position: "bottom-center" as ToastPosition,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <Toaster {...toasterProps} />
    </React.StrictMode>
);
