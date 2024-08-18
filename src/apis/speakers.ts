import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import toast from 'react-hot-toast';
import { SpeakerCRUDType, SpeakerType } from './types';

export const listSpeakers = async (
  eventId: string,
  setSpeakers: Dispatch<React.SetStateAction<SpeakerCRUDType>>,
) => {
  privateGateway
    .get(makeMyPass.eventSpeakerList(eventId))
    .then((response) => {
      setSpeakers((prev) => ({
        ...prev,
        speakerList: response.data.response.speakers,
      }));
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateSpeakerList = (speakers: SpeakerType[], eventId: string) => {
  return new Promise((resolve, reject) => {
    privateGateway
      .post(makeMyPass.eventSpeakerUpdate(eventId), {
        speakers,
      })
      .then((response) => {
        toast.success(response.data.message.general[0]);
        resolve(response.data.message.general[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
