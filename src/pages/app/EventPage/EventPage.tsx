/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { getEventInfo } from '../../../apis/publicpage';
import { EventType } from '../../../apis/types';
import Theme from '../../../components/Theme/Theme';
import EventForm from './components/EventForm/EventForm';
import EventHeader from './components/EventHeader/EventHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import styles from './EventPage.module.css';
import type { ClaimCodeExceedType, SuccessModalProps } from './types';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [showTicketFirst, setShowTicketFirst] = useState<boolean>(false);
  const [eventData, setEventData] = useState<EventType>();
  const [success, setSuccess] = useState<SuccessModalProps>({
    showModal: false,
    eventTitle: eventData?.title,
    eventRegisterId: '',
    loading: false,
  });

  const [claimCodeExceed, setClaimCodeExceed] = useState<ClaimCodeExceedType>({
    exceeded: false,
    message: '',
  });

  const [eventNotFound, setEventNotFound] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const claimCode = searchParams.get('claim_code');

  useEffect(() => {
    if (eventTitle)
      getEventInfo({
        eventTitle,
        setEventData,
        setEventNotFound,
        claimCode,
        setClaimCodeExceed,
        setShowTicketFirst,
        setSuccess,
        utmData: {
          source: searchParams.get('source'),
          medium: searchParams.get('medium'),
          campaign: searchParams.get('campaign'),
          term: searchParams.get('term'),
          content: searchParams.get('content'),
        },
      });
  }, [eventTitle]);

  useEffect(() => {
    if (success.showModal && eventTitle)
      getEventInfo({
        eventTitle,
        setEventData,
        setEventNotFound,
        claimCode,
        setClaimCodeExceed,
        setShowTicketFirst,
      });
  }, [success]);

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
              : 'Do not miss out! Register now for this event to learn, network and more. Click the link below to get started.'
          }
        />

        {eventData?.script_injection &&
          eventData?.script_injection.length > 0 &&
          eventData?.script_injection.map((scriptObject) => {
            if (scriptObject.type === 'script') {
              return <script type='text/javascript'>{scriptObject.value}</script>;
            } else if (scriptObject.type === 'asyncURL') {
              return <script src={scriptObject.value} async />;
            } else if (scriptObject.type === 'url') {
              return <script src={scriptObject.value} />;
            }
          })}
      </Helmet>
      <Theme type='eventForm'>
        <SuccessModal
          success={success}
          setSuccess={setSuccess}
          hasScratchCard={eventData?.is_scratch_card}
        />

        {eventData?.err_message && (
          <div>
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
            <p className={styles.privateEventText} dangerouslySetInnerHTML={
              { __html: eventData.err_message }
            }></p>
          </div>
        )}

        {eventData && !eventData?.err_message && eventData?.form?.length > 0 ? (
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
                  is_grouped_ticket: eventData.is_grouped_ticket,
                  show_ticket_first: showTicketFirst,
                }}
                setSuccess={setSuccess}
                setEventData={setEventData}
                eventTitle={eventTitle}
                claimCode={eventData.claim_ticked_id ? claimCode : ''}
                claimCodeExceed={claimCodeExceed}
                utmData={{
                  source: searchParams.get('source'),
                  medium: searchParams.get('medium'),
                  campaign: searchParams.get('campaign'),
                  term: searchParams.get('term'),
                  content: searchParams.get('content'),
                }}
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
