import { privateGateway } from "../../services/apiGateway";
import { makeMyPass } from "../../services/urls";

export const getEvents = async ({ setEvents }: { setEvents: (events: any) => void }) => {
    privateGateway
        .get(makeMyPass.listEvents)
        .then((response) => {
            console.log(response);
            setEvents(response.data.response.events);
        })
        .catch((error) => {
            console.log(error);
        });
};
