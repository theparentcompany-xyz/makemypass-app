import toast from "react-hot-toast";
import { privateGateway } from "../../services/apiGateway";
import { makeMyPass } from "../../services/urls";
import { SetStateAction } from "react";

export const getUserInfo = async (ticketId: string, setCheckIn: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
    privateGateway
        .post(makeMyPass.userInfo(ticketId))
        .then((response) => {
            console.log(response);
            toast.success("Check-In Successful");
            setCheckIn(true);
        })
        .catch((error) => {
            console.log(error);
            toast.error("Check-In Failed");
            setCheckIn(false);
        });
};
