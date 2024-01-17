import ReactDOM from "react-dom/client";
import "./index.css";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Auth/Login/Login";
import Home from "./Pages/App/Home/Home";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "login",
        element: <Login />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
