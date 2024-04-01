import { Dispatch, createContext } from 'react';

interface GlobalContextProps {
  eventId: string;
  setEventId?: Dispatch<React.SetStateAction<string>>;
  hasEvent?: boolean;
  setHasEvent?: Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  eventId: '',
  setEventId: () => { },
  hasEvent: true,
  setHasEvent: () => { },
});
