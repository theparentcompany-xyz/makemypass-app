import { SetStateAction } from "react";
import { privateGateway } from "../../services/apiGateway";
import { makeMyPass } from "../../services/urls";

export const getEvents = async (setEvents: {
    (
        value: SetStateAction<
            {
                id: string;
                title: string;
                members: number;
                logo: string | null;
                date: string;
                day: string;
            }[]
        >
    ): void;
    (arg0: any): void;
}) => {
    privateGateway
        .get(makeMyPass.listEvents)
        .then((response) => {
            console.log(response);
            setEvents(response.data.response.events);
            console.log(response.data.response.events)
        })
        .catch((error) => {
            console.log(error);
        });
};
