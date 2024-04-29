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
  currentUserRole: [],
  setEventId: () => {},
  hasEvent: true,
  setHasEvent: () => {},
});
