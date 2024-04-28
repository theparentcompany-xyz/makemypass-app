import React from 'react';
import { TicketType } from '../../../../../../apis/types';
import SectionButton from '../../../../../../components/SectionButton/SectionButton';
import styles from './MultipleTicket.module.css';

type Props = {
  tickets: {
    [key: string]: TicketType;
  };
  setTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  setIsTicketSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const MultipleTicket = ({ tickets, setTicket, setIsTicketSelected }: Props) => {
  return (
    <>
      <div className={styles.multipleTicketContainer}>
        {Object.keys(tickets).map((key) => (
          <div className={styles.multipleTicket} key={key}>
            <SectionButton
              buttonText={key}
              onClick={() => {
                setTicket(tickets[key]);
                setIsTicketSelected(true);
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default MultipleTicket;
