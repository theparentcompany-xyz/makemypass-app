import axios from "axios";
import { buildVerse } from "./urls.ts";
import toast from "react-hot-toast";

export const publicGateway = axios.create({
    baseURL:  (import.meta as any).env.VITE_BACKEND_URL as string,
    //The beackend requires the timezone and product headers to be set for every request hence the following code.
    headers: {
        "Content-Type": "application/json",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        product: "Wizard",
    },
});

// Add a request interceptor
publicGateway.interceptors.request.use(
    function (config) {
        console.log(config);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const privateGateway = axios.create({
    baseURL: (import.meta as any).env.VITE_BACKEND_URL as string,
    headers: {
        "Content-Type": "application/json",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        product: "Wizard",
    },
});

// Add a request interceptor
privateGateway.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Request Interceptor: Ensure that the URL ends with a trailing slash~
// If the URL doesn't terminate with a slash, this interceptor appends one.
privateGateway.interceptors.request.use(
    function (config) {
        if (config.url) {
            if (!config.url.endsWith("/")) {
                config.url += "/";
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
privateGateway.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (error.response?.data?.detail.statusCode === 1000) {
            try {
                const response = await publicGateway.post(
                    buildVerse.getAccessToken,
                    {
                        refresh_token: localStorage.getItem("refreshToken"),
                    }
                );
                localStorage.setItem(
                    "accessToken",
                    response.data.response.access_token
                );
                // Retry the original request
                const { config } = error;
                config.headers[
                    "Authorization"
                ] = `Bearer ${localStorage.getItem("accessToken")}`;
                return await new Promise((resolve, reject) => {
                    privateGateway
                        .request(config)
                        .then((response_1) => {
                            resolve(response_1);
                        })
                        .catch((error_1) => {
                            reject(error_1);
                        });
                });
            } catch (error_2) {
                toast.error("Your session has expired. Please login again.");
                setTimeout(() => {
                    localStorage.clear();
                }, 3000);
                return await Promise.reject(error_2);
            }
        } else {
            // Any status codes that fall outside the range of 2xx cause this function to trigger
            // Do something with response error

            // toast.error(error.response?.data?.detail.message || 'Something went wrong');
            return await Promise.reject(error);
        }
    }
);
