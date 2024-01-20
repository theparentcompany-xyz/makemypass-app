import toast from "react-hot-toast";
import { privateGateway, publicGateway } from "../../services/apiGateway";
import { buildVerse, makeMyPass } from "../../services/urls";

export const login = async (email: string, password: string) => {
    publicGateway
        .post(
            buildVerse.login,
            {
                email,
                password,
            },
            {
                headers: {
                    product: "buildverse",
                },
            }
        )
        .then((response) => {
            localStorage.setItem(
                "accessToken",
                response.data.response.access_token
            );
            localStorage.setItem(
                "refreshToken",
                response.data.response.refresh_token
            );
            onboardUser();
        })
        .catch((error) => {
            console.log(error);
            toast.error(error.response.data.detail.message);
        });
};

export const onboardUser = async () => {
    privateGateway
        .post(makeMyPass.onboardUser)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
};
