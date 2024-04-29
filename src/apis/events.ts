import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Event, EventType } from './types';
import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router';

export const getEvents = async (setEvents: React.Dispatch<React.SetStateAction<Event[]>>) => {
  privateGateway
    .get(makeMyPass.listEvents)
    .then((response) => {
      setEvents(response.data.response.events);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getEventId = async (
  eventName: string,
  navigate?: NavigateFunction,
  setEventId?: React.Dispatch<React.SetStateAction<string>>,
  setCurrentUserRole?: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const localData = localStorage.getItem('eventData');
  if (!localData)
    privateGateway
      .get(makeMyPass.getEventId(eventName))
      .then((response) => {
        privateGateway
          .get(makeMyPass.getEvent(response.data.response.event_id))
          .then((response) => {
            const eventData = {
              title: response.data.response.title,
              date: response.data.response.date,
              current_user_role: response.data.response.current_user_role,
              event_name: response.data.response.name,
              logo: response.data.response.logo,
              event_id: response.data.response.id,
            };

            setEventId && setEventId(response.data.response.id);
            setCurrentUserRole && setCurrentUserRole([response.data.response.current_user_role]);

            if (!navigate) return;
            if (
              response.data.response.current_user_role === 'Admin' ||
              response.data.response.current_user_role === 'Owner'
            ) {
              navigate(`/${eventName.toLowerCase()}/overview/`);
            } else if (response.data.response.current_user_role === 'Volunteer') {
              navigate(`/${eventName.toLowerCase()}/checkins/`);
            } else if (response.data.response.current_user_role === 'Gamer') {
              navigate(`/${eventName.toLowerCase()}/spinwheel/`);
            }

            localStorage.setItem('eventData', JSON.stringify(eventData));
          })
          .catch((error) => {
            toast.error(error.response.data.message.general[0] || 'Error in Fetching Event Data');
          });
      })
      .catch(() => {
        toast.error('Event Not Found');
      });
};

export const getEventData = async (
  eventId: string,
  setEventData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      date: string;
      current_user_role: string;
      name: string;
      logo: string;
    }>
  >,
) => {
  privateGateway
    .get(makeMyPass.getEvent(eventId))
    .then((response) => {
      setEventData(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

//Api for Loading Home Page Events
// export const getPublicEvents = async (
//   setEvents: React.Dispatch<React.SetStateAction<PubllicEvent[]>>,
// ) => {
//   publicGateway
//     .get(makeMyPass.listPublicEvents)
//     .then((response) => {
//       setEvents(response.data.response);
//     })
//     .catch((error) => {
//       toast.error(error.response.data.message.general[0] || 'Unable to process the request');
//     });
// };

export const getCategories = async (
  eventId: string,
  setCategories: Dispatch<React.SetStateAction<string[]>>,
) => {
  privateGateway
    .get(makeMyPass.getCategories(eventId))
    .then((response) => {
      setCategories(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const createEvent = (eventTitle: string) => {
  privateGateway
    .post(makeMyPass.createEvent, {
      title: eventTitle,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Created Successfully');
      setTimeout(() => {
        window.location.href = `/${eventTitle.toLowerCase().replace(/\s/g, '-')}/manage`;
      }, 1000);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getEvent = (
  eventId: string,
  setEventTitle?: Dispatch<React.SetStateAction<string>>,
  setEventData?: Dispatch<React.SetStateAction<EventType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.getEvent(eventId))
    .then((response) => {
      setEventData && setEventData(response.data.response);
      setEventTitle && setEventTitle(response.data.response.title);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const editEvent = (eventId: string, eventData: object) => {
  privateGateway
    .patch(makeMyPass.editEvent(eventId), eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Updated Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
