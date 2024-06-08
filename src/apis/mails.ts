import { privateGateway } from "../../services/apiGateway";
import { makeMyPass } from "../../services/urls";

export const listMails = (eventId: string) => {
    privateGateway.get(makeMyPass.listMails(eventId))
    .then(response => {
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
