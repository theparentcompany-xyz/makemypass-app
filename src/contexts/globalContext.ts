import { Dispatch, createContext } from 'react';

interface GlobalContextProps {
  eventId: string;
  currentUserRole: string[];
  setEventId?: Dispatch<React.SetStateAction<string>>;
  hasEvent?: boolean;
  setHasEvent?: Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  eventId: '',
  currentUserRole: JSON.parse(localStorage.getItem('eventData')!).current_user_role as string[],
  setEventId: () => {},
  hasEvent: true,
  setHasEvent: () => {},
});
