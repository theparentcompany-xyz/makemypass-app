import { privateGateway } from "../../services/apiGateway";
import { makeMyPass } from "../../services/urls";

export const getHosts = async (
    eventId: string,
    setHosts: (arg0: any) => void
) => {
    privateGateway
        .get(makeMyPass.listHosts(eventId))
        .then((response) => {
            setHosts(response.data.response.hosts);
        })
        .catch((error) => {
            console.log(error);
        });
};
