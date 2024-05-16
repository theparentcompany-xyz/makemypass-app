import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { ErrorMessages, Event, EventType } from './types';
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
  const localData = sessionStorage.getItem('eventData');
  const accessToken = localStorage.getItem('accessToken');

  if (!localData || JSON.parse(localData).event_name !== eventName)
    privateGateway
      .get(makeMyPass.getEventId(eventName))
      .then((response) => {
        if (accessToken)
          privateGateway
            .get(makeMyPass.getEvent(response.data.response.id))
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

              // localStorage.setItem('eventData', JSON.stringify(eventData));
              sessionStorage.setItem('eventData', JSON.stringify(eventData));
            })
            .catch((error) => {
              toast.error(error.response.data.message.general[0] || 'Error in Fetching Event Data');
            });
      })
      .catch(() => {
        toast.error('Event Not Found');
      });
  else {
    const eventData = JSON.parse(localData);
    setEventId && setEventId(eventData.event_id);
    setCurrentUserRole && setCurrentUserRole([eventData.current_user_role]);

    if (!navigate) return;
    if (eventData.current_user_role === 'Admin' || eventData.current_user_role === 'Owner') {
      navigate(`/${eventName.toLowerCase()}/overview/`);
    } else if (eventData.current_user_role === 'Volunteer') {
      navigate(`/${eventName.toLowerCase()}/checkins/`);
    } else if (eventData.current_user_role === 'Gamer') {
      navigate(`/${eventName.toLowerCase()}/spinwheel/`);
    }
  }
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

export const editEvent = (eventId: string, eventData: object,setFormErrors?:Dispatch<React.SetStateAction<ErrorMessages>>) => {
  privateGateway
    .patch(makeMyPass.editEvent(eventId), eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Updated Successfully');
      setTimeout(() => {
        window.location.href = `/${response.data.response.name}/manage`;
      }, 1000);
    })
    .catch((error) => {
        setFormErrors && setFormErrors(error.response.data.message);
        toast.error(error?.response?.data?.message?.general[0] || 'Unable to process the request');
    });
};

export const deleteEvent = (eventId: string) => {
  privateGateway
    .delete(makeMyPass.deleteEvent(eventId))
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Event Deleted Successfully');
      setTimeout(() => {
        window.location.href = '/events';
      }, 1000);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    }); 
};

export const duplicateEvent = async (eventId: string) => {
  privateGateway
    .post(makeMyPass.duplicateEvent(eventId))
    .then((response) => {
      toast.success('Event Duplicated Successfually');
      getEventId(response.data.response.event_name);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
