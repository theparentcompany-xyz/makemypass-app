import { useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { HashLoader } from 'react-spinners';

import { getEventMailLog } from '../../../apis/logs';
import { formatDate } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Theme from '../../../components/Theme/Theme';
import type { EmailType } from '../Guests/components/ViewGuest/types';
import styles from './EventLogs.module.css';

const EventLogs = () => {
  const [mailLogs, setMailLogs] = useState<EmailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const eventId = JSON.parse(sessionStorage.getItem('eventData') || '{}').event_id;

  useEffect(() => {
    getEventMailLog(eventId, setMailLogs, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMailContent = (id: string) => {
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
        <DashboardLayout prevPage='/events' tabName='logs'>
          {!isLoading ? (
            <div className={styles.mailsOuterContainer}>
              <p className={styles.mailLogsHeaders}>
                {mailLogs.length === 0 ? 'No logs available' : 'Mail Logs'}
              </p>
              <div className={styles.mailsContainer}>
                {mailLogs.map((mail, index) => (
                  <div
                    className={styles.mail}
                    key={index}
                    onClick={() => toggleMailContent(mail.id)}
                  >
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

                        {mail.opened_at && (
                          <p className={styles.mailType}>
                            Mail Opened @ {formatDate(mail.opened_at, true)}
                          </p>
                        )}
                        <p className={styles.mailSubject}>{mail.subject}</p>

                        <p className={styles.mailDescription}>
                          To: <span>{mail.send_to}</span> <br />
                          From: <span>{mail.send_from}</span>
                        </p>
                      </div>
                    </div>
                    {mail.show_content && (
                      <>
                        <hr className={styles.line} />
                        <div className={styles.mailContent}>
                          <pre> {mail.body}</pre>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='center'>
              <HashLoader color={'#46BF75'} size={50} />
            </div>
          )}
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default EventLogs;
