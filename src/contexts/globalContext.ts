import { Dispatch, createContext } from 'react';

interface GlobalContextProps {
  eventId: string | undefined;
  setEventId?: Dispatch<React.SetStateAction<string>>;
}

export const GlobalContext = createContext<GlobalContextProps>({
  eventId: '',
  setEventId: () => {},
});
