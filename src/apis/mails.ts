import React from "react";
import { privateGateway } from "../../services/apiGateway";
import { makeMyPass } from "../../services/urls";
import { MailType } from "./types";

export const listMails = (eventId: string, setMails: React.Dispatch<React.SetStateAction<MailType[]>>) => {
    privateGateway.get(makeMyPass.listMails(eventId))
    .then(response => {
        setMails(response.data.response)
        console.log( response.data.response)
    }).catch(error => {
        console.log(error)
    })
};
 

export const getMail = (eventId: string, mailId: string) => {
    privateGateway.get(makeMyPass.getMail(eventId, mailId))
    .then(response => {
        console.log( response.data.response)
    }).catch(error => {
        console.log(error)
    })
}
