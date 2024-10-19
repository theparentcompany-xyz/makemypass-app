import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { formatDate } from '../common/commonFunctions';
import { MapNewCode, multipleTicketCount } from '../pages/app/CheckIns/pages/ScanQR/types';
import { LogType } from '../pages/app/CheckIns/pages/Venue/Venue';
import type { checkInButtonsType } from '../pages/app/CheckIns/types';

type ResponseTicketType = {
  ticket_id: string;
  ticket_name: string;
  total_count: number;
  remaining_count: number;
  checked_in_count: number;
};

export const mapNewCode = async ({
  mappingNewCode,
  newCode,
  eventId,
  setMappingNewCode,
  setMessage,
}: {
  mappingNewCode: MapNewCode;
  newCode: string;
  eventId: string;
  setMappingNewCode: React.Dispatch<React.SetStateAction<MapNewCode | undefined>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}): Promise<unknown> => {

  

  return new Promise((resolve, reject) => {
    privateGateway
      .post(makeMyPass.scanGuestMapNewCode(eventId), {
        old_ticket_code: mappingNewCode.ticketCode,
        new_ticket_code: newCode,
      })
      .then((response) => {
        setMessage(response.data.message.general[0]);
        setMappingNewCode({
          apiConfirmation: false,
          ticketCode: '',
          modalConfirmation: false,
        });
        resolve(response);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Error in Mapping New Code');
        reject(error);
      });
  });
};

export const checkInUser = async ({
  ticketId,
  eventId,
  setScanLogs,
  setMessage,
  setChecking,
  setMultipleTickets,
  multipleTickets,
  setTrigger,
  roomNumber,
  setMappingNewCode,
}: {
  ticketId: string;
  eventId: string;
  setScanLogs?: React.Dispatch<React.SetStateAction<LogType[]>>;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  setChecking?: React.Dispatch<React.SetStateAction<boolean>>;
  setMultipleTickets?: React.Dispatch<React.SetStateAction<multipleTicketCount>>;
  multipleTickets?: multipleTicketCount;
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
  roomNumber?: string;
  setMappingNewCode?: React.Dispatch<React.SetStateAction<MapNewCode | undefined>>;
}) => {
  if (setChecking) {
    setChecking(true);
  }

  const dataToSend: {
    ticket_code: string;
    user_count?: { [key: string]: number };
    room_id?: string;
    confirmation?: boolean;
  } = {
    ticket_code: ticketId,
  };

  if (roomNumber) {
    dataToSend.room_id = roomNumber;
  }

  if (multipleTickets && multipleTickets.hasMultipleTickets) {
    dataToSend.user_count = multipleTickets.tickets?.reduce(
      (acc, ticket) => {
        acc[ticket.ticket_id] = ticket.checked_in_count || 0;
        return acc;
      },
      {} as { [key: string]: number },
    );

    dataToSend.confirmation = true;
  }

  privateGateway
    .post(makeMyPass.scanGuestCheckin(eventId), dataToSend)
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

      if (setMappingNewCode && response.data.response.map_new_code) {
        setMappingNewCode({
          apiConfirmation: true,
          ticketCode: ticketId,
          modalConfirmation: false,
        });
      }
    })
    .catch((error) => {
      if (error.response.data.statusCode === 1101 && setMultipleTickets) {
        if (setMessage) setMessage('Confirmation Required');
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: true,
          tickets: error.response.data.response.tickets.map((ticket: ResponseTicketType) => ({
            ticket_id: ticket.ticket_id,
            ticket_name: ticket.ticket_name,
            total_count: ticket.total_count,
            remaining_count: ticket.remaining_count,
            checked_in_count: ticket.remaining_count > 0 ? 1 : 0,
          })),
          userData: error.response.data.response.user_data,
          entryDate: error.response.data.response.entry_date,
        }));
      } else if (setMultipleTickets) {
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: false,
          tickets: [],
        }));
      }

      if (error.response.data.statusCode !== 1101) {
        if (setMappingNewCode && error.response.data.response.map_new_code) {
          setMappingNewCode({
            apiConfirmation: true,
            ticketCode: ticketId,
            modalConfirmation: false,
          });
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

export const checkOutUser = async (
  ticketId: string,
  eventId: string,
  setScanLogs: React.Dispatch<React.SetStateAction<LogType[]>>,
  setMessage?: React.Dispatch<React.SetStateAction<string>>,
  setChecking?: React.Dispatch<React.SetStateAction<boolean>>,
  setMultipleTickets?: React.Dispatch<React.SetStateAction<multipleTicketCount>>,
  multipleTickets?: multipleTicketCount,
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (setChecking) {
    setChecking(true);
  }

  const dataToSend: {
    ticket_code: string;
    user_count?: { [key: string]: number };
    confirmation?: boolean;
  } = {
    ticket_code: ticketId,
  };

  if (multipleTickets && multipleTickets.hasMultipleTickets) {
    dataToSend.user_count = multipleTickets.tickets?.reduce(
      (acc, ticket) => {
        acc[ticket.ticket_id] = ticket.checked_in_count || 0;
        return acc;
      },
      {} as { [key: string]: number },
    );

    dataToSend.confirmation = true;
  }

  privateGateway
    .post(makeMyPass.scanGuestCheckout(eventId), dataToSend)
    .then((response) => {
      if (setMessage) {
        if (setMultipleTickets) {
          setMultipleTickets({
            hasMultipleTickets: false,
            tickets: [],
          });
        }
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
        if (setMessage) setMessage('Confirmation Required');
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: true,
          userData: error.response.data.response.user_data,
          entryDate: error.response.data.response.entry_date,
          tickets: error.response.data.response.tickets.map((ticket: ResponseTicketType) => ({
            ticket_id: ticket.ticket_id,
            ticket_name: ticket.ticket_name,
            total_count: ticket.total_count,
            remaining_count: ticket.remaining_count,
            checked_in_count: ticket.remaining_count > 0 ? 1 : 0,
          })),
        }));
      } else if (setMultipleTickets) {
        setMultipleTickets((prevData) => ({
          ...prevData,
          hasMultipleTickets: false,
          tickets: [],
        }));
      }
      if (error.response.data.statusCode !== 1101)
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
    });
};

export const getCheckInButtons = async (
  eventId: string,
  setCheckInButtons: React.Dispatch<React.SetStateAction<checkInButtonsType | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.scanGuestButtons(eventId))
    .then((response) => {
      setCheckInButtons(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Check-In Buttons');
    });
};
