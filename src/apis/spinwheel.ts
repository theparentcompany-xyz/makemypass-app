import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';

const data = [
  { style: { backgroundColor: '#47C97E', textColor: '#1E2132' } },
  { style: { backgroundColor: '#7662FC', textColor: '#1E2132' } },
  { style: { backgroundColor: '#C33D7B', textColor: '#1E2132' } },
  { style: { backgroundColor: '#D2D4D7', textColor: '#1E2132' } },
  { style: { backgroundColor: '#35A1EB', textColor: '#1E2132' } },
  { style: { backgroundColor: '#FBD85B', textColor: '#1E2132' } },
  { style: { backgroundColor: '#47C97E', textColor: '#1E2132' } },
  { style: { backgroundColor: '#7662FC', textColor: '#1E2132' } },
];

export const listSpinWheelItems = async (eventId: string, setSpinWheelItems: any) => {
  privateGateway
    .get(makeMyPass.listSpinWheelItems(eventId))

    .then((response) => {
      const items = response.data.response.items;
      const updatedItems = items.map((item: any, index: number) => {
        return {
          option: item,
          style: {
            backgroundColor: data[index].style.backgroundColor,
            textColor: data[index].style.textColor,
          },
        };
      });
      console.log(updatedItems);
      setSpinWheelItems(updatedItems);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
