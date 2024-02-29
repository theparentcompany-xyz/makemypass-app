import { createContext } from 'react';

interface GlobalContextProps {
  eventId: string;
}

export const GlobalContext = createContext<GlobalContextProps>({
  eventId: '',
});
