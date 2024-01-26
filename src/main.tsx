import ReactDOM from "react-dom/client";
import "./index.css";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import "./index.css";
import LandingPage from "./pages/app/LandingPage/LandingPage";
import { Toaster, ToastPosition } from "react-hot-toast";

import Insights from "./pages/app/Insights/Insights";
import Overview from "./pages/app/Overview/Overview/Overview";
import Events from "./pages/app/Events/Events";
import AuthCheck from "./components/AuthCheck/AuthCheck";
import Guests from "./pages/app/Guests/Guests";
import TermsConditions from "./pages/app/TermsCondictions/TermsConditions";
import PrivacyPolicy from "./pages/app/PrivacyPolicy/PrivacyPolicy";
import FourNotFour from "./pages/FourNotFour/FourNotFour";
import CheckIns from "./pages/app/CheckIns/CheckIns";
import CheckIn from "./pages/app/CheckIns/pages/CheckIn/CheckIn";
import ScanQR from "./pages/app/CheckIns/pages/ScanQR/ScanQR";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/termsandconditions",
    element: <TermsConditions />,
  },
  {
    path: "/privacypolicy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/",
    element: <AuthCheck />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/:eventTitle/overview",
        element: <Overview />,
      },
      {
        path: "/:eventTitle/insights",
        element: <Insights />,
      },
      {
        path: "/:eventTitle/guests",
        element: <Guests />,
      },
      {
        path: "/:eventTitle/checkins",
        element: <CheckIns />,
      },
      {
        path: "/:eventTitle/checkins/checkin",
        element: <CheckIn />,
      },
      {
        path: "/:eventTitle/checkins/checkin/scan",
        element: <ScanQR />,
      },
    ],
  },
  {
    path: "*",
    element: <FourNotFour />,
  },
];

const router = createBrowserRouter(routes);

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
  </React.StrictMode>,
);
