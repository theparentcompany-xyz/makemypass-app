import { useEffect, useState } from 'react';
import EventHeader from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './EventLogs.module.css';
import { getAllMailLog } from '../../../apis/logs';
import { EmailType } from '../Guests/components/ViewGuest/types';
import { BiChevronDown } from 'react-icons/bi';
import { formatDate } from '../../../common/commonFunctions';

const EventLogs = () => {
  const [mailLogs, setMailLogs] = useState<EmailType[]>([]);

  const eventId = JSON.parse(sessionStorage.getItem('eventData') || '{}').event_id;

  useEffect(() => {
    getAllMailLog(eventId, setMailLogs);
  }, []);

  const toggleMailContent = (id: string) => {
    console.log('id', id);

    setMailLogs((prevState) =>
      prevState.map((mail) => {
        if (mail.id === id) {
          return {
            ...mail,
            show_content: !mail.show_content as boolean,
          };
        }
        return mail;
      }),
    );
  };

  return (
    <>
      <Theme>
        <EventHeader previousPageNavigate='/events' />
        <Glance tab='Logs' />
        <p className={styles.mailLogsHeaders}>Mail logs</p>
        <div className={styles.mailsContainer}>
          {mailLogs.map((mail, index) => (
            <div className={styles.mail} key={index}>
              <div className={styles.expandIcon}>
                {
                  <BiChevronDown
                    onClick={() => toggleMailContent(mail.id)}
                    size={25}
                    style={{
                      transform: mail.show_content ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                }
              </div>

              <div className={styles.mailHeader}>
                <div className={styles.mailHeaderContents}>
                  <p className={styles.mailType}>
                    {mail.type} Mail @ {formatDate(mail.created_at, true)}
                  </p>
                  <p className={styles.mailSubject}>{mail.subject}</p>

                  <p className={styles.mailDescription}>
                    To: <span>{mail.send_to}</span> <br />
                    From: <span>{mail.send_from}</span>
                  </p>
                </div>
              </div>
              <hr className={styles.line} />
              <div className={styles.mailContent}>
                <pre>
                  {mail.show_content
                    ? mail.body
                    : mail.body.length > 100
                      ? mail.body.substring(0, 100) + '...'
                      : mail.body}
                </pre>
                {/* <div className={styles.attachment}>Ticket.png</div> */}
              </div>
            </div>
          ))}
        </div>
      </Theme>
    </>
  );
};

export default EventLogs;
