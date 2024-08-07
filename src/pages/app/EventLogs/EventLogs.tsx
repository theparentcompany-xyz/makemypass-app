import { useEffect, useState } from 'react';
import Theme from '../../../components/Theme/Theme';
import styles from './EventLogs.module.css';
import { getAllMailLog } from '../../../apis/logs';
import { EmailType } from '../Guests/components/ViewGuest/types';
import { BiChevronDown } from 'react-icons/bi';
import { formatDate } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';

const EventLogs = () => {
  const [mailLogs, setMailLogs] = useState<EmailType[]>([]);

  const eventId = JSON.parse(sessionStorage.getItem('eventData') || '{}').event_id;

  useEffect(() => {
    getAllMailLog(eventId, setMailLogs);
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
          <div className={styles.mailsOuterContainer}>
            <p className={styles.mailLogsHeaders}>
              {mailLogs.length === 0 ? 'No logs available' : 'Mail Logs'}
            </p>
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
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default EventLogs;
