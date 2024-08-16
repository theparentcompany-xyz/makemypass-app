import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { PreviewData } from './types';
import { formatDate } from '../common/commonFunctions';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import { checkInButtonsType } from '../pages/app/CheckIns/types';
import { multipleTicketCount } from '../pages/app/CheckIns/pages/ScanQR/types';

export const checkInUser = async (
  ticketId: string,
  eventId: string,
  setScanLogs?: React.Dispatch<React.SetStateAction<LogType[]>>,
  setMessage?: React.Dispatch<React.SetStateAction<string>>,
  setChecking?: React.Dispatch<React.SetStateAction<boolean>>,
  setMultipleTickets?: React.Dispatch<React.SetStateAction<multipleTicketCount>>,
  multtipleTickets?: multipleTicketCount,
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (setChecking) {
    setChecking(true);
  }

  const dataToSend: { ticket_code: string; user_count?: { [key: string]: number } } = {
    ticket_code: ticketId,
  };

  if (multtipleTickets && multtipleTickets.hasMultipleTickets) {
    dataToSend.user_count = multtipleTickets.tickets?.reduce(
      (acc, ticket) => {
        acc[ticket.ticket_id] = ticket.checked_in_count || 0;
        return acc;
      },
      {} as { [key: string]: number },
    );
  }

  privateGateway
    .post(makeMyPass.checkInUser(eventId), dataToSend)
    .then((response) => {
      if (setMultipleTickets) {
        setMultipleTickets({
          hasMultipleTickets: false,
          tickets: [],
        });
      }
      if (setMessage) {
        setMessage(response.data.message.general[0] || 'Check-In Successful');
        if (setScanLogs)
          setScanLogs((prev) => [
            ...prev,
            {
              message: `${response.data.message.general[0]}`,
              timestamp: formatDate(new Date().toString(), true),
              hasError: false,
            },
          ]);
      } else {
        toast.success(response.data.message.general[0] || 'Check-In Successful');
      }
    })
    .catch((error) => {
      if (error.response.data.statusCode === 1101 && setMultipleTickets) {
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: true,
          tickets: error.response.data.response.tickets,
          userName: error.response.data.response.user_name,
          entryDate: error.response.data.response.entry_date,
        }));
      } else if (setMultipleTickets) {
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: false,
          tickets: [],
        }));
      }
      if (setMessage) {
        setMessage(error.response.data.message.general[0] || 'Check-In Failed');
        if (setScanLogs)
          setScanLogs((prev) => [
            ...prev,
            {
              message: ` ${error.response.data.message.general[0]}`,
              timestamp: formatDate(new Date().toString(), true),
              hasError: true,
            },
          ]);
      } else {
        toast.error(error.response.data.message.general[0] || 'Check-In Failed');
      }
    })
    .finally(() => {
      if (setChecking) {
        setChecking(false);
      }
      if (setTrigger) {
        setTrigger(false);
      }
    });
};

// export const getCheckInCount = async (
//   eventId: string,
//   setCheckInCount: React.Dispatch<React.SetStateAction<number>>,
// ) => {
//   privateGateway
//     .get(makeMyPass.checkInCount(eventId))
//     .then((response) => {
//       setCheckInCount(response.data.response.authorized_count);
//     })
//     .catch((error) => {
//       toast.error(error.response.data.message.general[0] || 'Error in Fetching Check-In Count');
//     });
// };

export const preview = async (
  eventId: string,
  ticketCode: string,
  setPreviewData: React.Dispatch<React.SetStateAction<PreviewData>>,
) => {
  privateGateway
    .get(makeMyPass.preview(eventId, ticketCode))
    .then((response) => {
      setPreviewData(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Check-In Count');
    });
};

export const checkOutUser = async (
  ticketId: string,
  eventId: string,
  setScanLogs: React.Dispatch<React.SetStateAction<LogType[]>>,
  setMessage?: React.Dispatch<React.SetStateAction<string>>,
  setChecking?: React.Dispatch<React.SetStateAction<boolean>>,
  setMultipleTickets?: React.Dispatch<React.SetStateAction<multipleTicketCount>>,
  multtipleTickets?: multipleTicketCount,
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (setChecking) {
    setChecking(true);
  }

  const dataToSend: { ticket_code: string; user_count?: { [key: string]: number } } = {
    ticket_code: ticketId,
  };

  if (multtipleTickets && multtipleTickets.hasMultipleTickets) {
    dataToSend.user_count = multtipleTickets.tickets?.reduce(
      (acc, ticket) => {
        acc[ticket.ticket_id] = ticket.checked_in_count || 0;
        return acc;
      },
      {} as { [key: string]: number },
    );
  }

  privateGateway
    .post(makeMyPass.checkOutUser(eventId), dataToSend)
    .then((response) => {
      if (setMessage) {
        setMessage(response.data.message.general[0] || 'Check-Out Successful');
        setScanLogs((prev) => [
          ...prev,
          {
            message: ` ${response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: false,
          },
        ]);
      } else {
        toast.success(response.data.message.general[0] || 'Check-Out Successful');
      }
    })
    .catch((error) => {
      if (error.response.data.statusCode === 1101 && setMultipleTickets) {
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: true,
          userName: error.response.data.response.user_name,
          entryDate: error.response.data.response.entry_date,
          tickets: error.response.data.response.tickets,
        }));
      } else if (setMultipleTickets) {
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: false,
          tickets: [],
        }));
      }
      if (setMessage) {
        setMessage(error.response.data.message.general[0] || 'Check-Out Failed');
        setScanLogs((prev) => [
          ...prev,
          {
            message: ` ${error.response.data.message.general[0]}`,
            timestamp: formatDate(new Date().toString(), true),
            hasError: true,
          },
        ]);
      } else {
        toast.error(error.response.data.message.general[0] || 'Check-Out Failed');
      }
    })
    .finally(() => {
      if (setChecking) {
        setChecking(false);
      }

      if (setTrigger) {
        setTrigger(false);
      }

      if (setMessage)
        setTimeout(() => {
          setMessage('');
        }, 2500);
    });
};

export const getCheckInButtons = async (
  eventId: string,
  setCheckInButtons: React.Dispatch<React.SetStateAction<checkInButtonsType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.checkInButtons(eventId))
    .then((response) => {
      setCheckInButtons(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Check-In Buttons');
    });
};
