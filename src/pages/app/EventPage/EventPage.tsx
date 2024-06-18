/* eslint-disable react-hooks/exhaustive-deps */
import styles from './EventPage.module.css';
import Theme from '../../../components/Theme/Theme';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { getEventInfo } from '../../../apis/publicpage';
import { motion } from 'framer-motion';
import { EventType } from '../../../apis/types';

import EventHeader from './components/EventHeader/EventHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import { Helmet } from 'react-helmet';
import EventForm from './components/EventForm/EventForm';
import { successModalProps } from './types';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [eventData, setEventData] = useState<EventType>();
  const [success, setSuccess] = useState<successModalProps>({
    showModal: false,
    ticketCode: '',
    email: '',
    eventTitle: '',
  });

  const [eventNotFound, setEventNotFound] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const claimCode = searchParams.get('claim_code');

  useEffect(() => {
    if (eventTitle) getEventInfo(eventTitle, setEventData, setEventNotFound, setSuccess, claimCode);
  }, [eventTitle]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
  }, [success]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{eventData?.title}</title>
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
        <meta name='title' content={eventData?.title} />
        <meta
          name='description'
          content={
            eventData?.description
              ? eventData?.description
              : 'Don not miss out! Register now for this event to learn, network and more. Click the link below to get started.'
          }
        />
      </Helmet>
      <Theme type='eventForm'>
        <SuccessModal
          success={success}
          setSuccess={setSuccess}
          hasShortlisting={eventData?.shortlist}
        />

        {eventData?.err_message && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={styles.eventPageContainer}
              style={{
                maxWidth: '32rem',
                margin: 'auto',
                padding: '0 1rem',
              }}
            >
              <EventHeader eventData={eventData} />
            </motion.div>
            <p className={styles.privateEventText}>{eventData?.err_message}</p>
          </>
        )}

        {eventData && eventData?.form?.length > 0 ? (
          <div className={styles.eventPageContainer}>
            {typeParam !== 'embed' && (
              <div className={styles.eventHeaderContainer}>
                <EventHeader eventData={eventData} />
              </div>
            )}
            <div className={styles.formContainer}>
              <EventForm
                eventFormData={{
                  id: eventData.id,
                  form: eventData.form,
                  tickets: eventData.tickets,
                  select_multi_ticket: eventData.select_multi_ticket ?? false,
                  is_sub_event: eventData.is_sub_event ?? false,
                  parse_audio: eventData.parse_audio ?? false,
                  coupon: eventData.coupon ?? false,
                  claim_ticket_id: eventData.claim_ticked_id,
                }}
                setSuccess={setSuccess}
                setEventData={setEventData}
                eventTitle={eventTitle}
                claimCode={claimCode}
              />
            </div>
          </div>
        ) : eventNotFound ? (
          <div className={styles.eventPageContainer}>
            <p className={`${styles.privateEventText} ${styles.center}`}>
              This event does not have any registration form. Please contact the event organizer for
              more information.
            </p>
          </div>
        ) : (
          !(eventData && eventData.title) && (
            <div className={styles.center}>
              <HashLoader color='#46BF75' size={50} />
            </div>
          )
        )}
      </Theme>
    </>
  );
};

export default EventPage;
