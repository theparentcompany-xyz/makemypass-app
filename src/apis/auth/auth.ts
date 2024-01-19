import { privateGateway, publicGateway } from "../../../services/apiGateway";
import { buildVerse, makeMyPass } from "../../../services/urls";

export const login = async (email: string, password: string) => {
    publicGateway
        .post(buildVerse.login, {
            email,
            password,
        })
        .then((response) => {
            console.log(response);
            onboardUser();
        })
        .catch((error) => {
            console.log(error);
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
