import { Dispatch } from 'react';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import toast from 'react-hot-toast';
import { SpeakerCRUDType, SpeakerType } from './types';

export const listEventSpeakers = async (
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

export const createEventSpeaker = async (
  eventId: string,
  speakerData: SpeakerType,

  setSpeakers: Dispatch<React.SetStateAction<SpeakerCRUDType>>,
) => {
  const backendData = new FormData();
  backendData.append('name', speakerData.name);
  backendData.append('position', speakerData.position);
  backendData.append('image', speakerData.image!);

  privateGateway
    .post(makeMyPass.eventSpeakerCreate(eventId), backendData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setSpeakers((prev) => ({
        ...prev,
        speakerList: [...prev.speakerList, response.data.response.speaker],
        showModal: false,
      }));
      toast.success('Speaker added successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const deleteEventSpeaker = async (
  eventId: string,
  speakerId: string,
  setSpeakers: Dispatch<React.SetStateAction<SpeakerCRUDType>>,
) => {
  privateGateway
    .delete(makeMyPass.eventSpeakerUpdate(eventId, speakerId))
    .then(() => {
      setSpeakers((prev) => ({
        ...prev,
        speakerList: prev.speakerList.filter((speaker) => speaker.id !== speakerId),
      }));
      toast.success('Speaker deleted successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateEventSpeaker = async (
  eventId: string,
  speakerData: SpeakerType,
  setSpeakers: Dispatch<React.SetStateAction<SpeakerCRUDType>>,
) => {
  const backendData = new FormData();
  backendData.append('name', speakerData.name);
  backendData.append('position', speakerData.position);
  backendData.append('image', speakerData.image!);

  privateGateway
    .put(makeMyPass.eventSpeakerUpdate(eventId, speakerData.id), backendData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setSpeakers((prev) => ({
        ...prev,
        speakerList: prev.speakerList.map((speaker) =>
          speaker.id === speakerData.id ? response.data.response.speaker : speaker,
        ),
        showModal: false,
      }));
      toast.success('Speaker updated successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
