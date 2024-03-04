import { Dispatch, createContext } from 'react';

interface GlobalContextProps {
  eventId: string;
  setEventId?: Dispatch<React.SetStateAction<string>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  eventId: '',
  setEventId: () => {},
});
