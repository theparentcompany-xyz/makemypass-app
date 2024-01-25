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
            console.log(response.data.response.events);
        })
        .catch((error) => {
            console.log(error);
        });
};

export const getEventId = async (eventName: string) => {
    privateGateway
        .get(makeMyPass.getEventId(eventName))
        .then((response) => {
            localStorage.setItem(
                "eventData",
                JSON.stringify(response.data.response)
            );
        })
        .catch((error) => {
            console.log(error);
        });
};

export const getEventData = async (
    eventId: string,
    setEventData: React.Dispatch<
        React.SetStateAction<{
            title: string;
            date: string;
            role: string;
        }>
    >
) => {
    privateGateway
        .get(makeMyPass.getEventData(eventId))
        .then((response) => {
            console.log(response.data.response);
            setEventData(response.data.response);
        })
        .catch((error) => {
            console.log(error);
        });
};
