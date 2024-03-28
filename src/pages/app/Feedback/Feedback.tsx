import styles from './Feedback.module.css';
import Theme from '../../../components/Theme/Theme';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { getEventId } from '../../../apis/events';
import {
    getEventDatas,
} from '../../../apis/publicpage';
import {
    getPostEventFields,
    getPostEventCategories,
    submitFeedback
} from '../../../apis/feedback';
import { motion } from 'framer-motion';
import { EventDetails, EventType, FormDataType, FormFieldType } from '../../../apis/types';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import EventHeader from '../EventPage/components/EventHeader/EventHeader';
import SuccessModal from '../EventPage/components/SuccessModal/SuccessModal';
import type { Data } from '../../../apis/feedback';
import { Helmet } from 'react-helmet';
import FourNotFour from '../../FourNotFour/FourNotFour';

const EventPage = () => {
    const { eventTitle } = useParams<{ eventTitle: string }>();
    const [formFields, setFormFields] = useState<FormFieldType[]>([]);
    const [eventData, setEventData] = useState<EventDetails>();
    const [formErrors, setFormErrors] = useState<any>({});
    const [eventId, setEventId] = useState<string>('');

    const [data, setData] = useState<Data>({
        title: '',
        description: '',
    })

    const [formData, setFormData] = useState<FormDataType>({});
    const [success, setSuccess] = useState<string>('');

    const [formNumber] = useState<number>(0);
    const [hasEvent, setHasEvent] = useState<boolean>(true);

    useEffect(() => {
        if (eventTitle) getEventId(eventTitle, setHasEvent);

        setTimeout(() => {
            setEventId(JSON.parse(localStorage.getItem('eventData') || '{}').event_id);
            if (eventId) {
                // getFormFields(eventId, setFormFields);
                getEventDatas(eventId, setEventData);
                // registerUpdateView(eventId);
            }
        }, 1000);
    }, [eventTitle, eventId]);

    useEffect(() => {
        if (eventId) {
            getPostEventFields(eventId, setFormFields, setData);
            getPostEventCategories(eventId);
            //getFeedback(eventId);
        }
    }, [eventId])

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo(0, 0);
        };

        scrollToTop();
    }, [success]);



    useEffect(() => {
        setFormData(
            formFields.reduce((data: any, field: any) => {
                data[field.field_key] = '';
                return data;
            }, {}),
        );
    }, [formFields]);

    const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
        setFormData({
            ...formData,
            [fieldName]: fieldValue,
        });

        if (formErrors[fieldName]) {
            setFormErrors({
                ...formErrors,
                [fieldName]: '',
            });
        }
    };

    return (
        <>
            {hasEvent ? (
                <>
                    <Helmet>
                        <meta charSet='utf-8' />
                        <title>{eventData?.title}</title>
                        <link
                            rel='shortcut icon'
                            href={eventData?.logo ?? '/favicon.ico'}
                            type='image/x-icon'
                        />
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
                        {eventData?.is_private && (
                            <motion.div
                                initial={{ opacity: 0, y: 35 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className={styles.center}
                            >
                                <EventHeader eventData={eventData as unknown as EventType} />
                                <p className={styles.privateEventText}>
                                    This is a private event. Please contact the event organizer for more details.
                                </p>
                            </motion.div>
                        )}

                        {!eventData?.is_private && formFields.length > 0 ? (
                            <div className={styles.eventPageContainer}>

                                <div className={styles.formContainer}>
                                    {formNumber === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 35 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.5 }}
                                            className={styles.eventForm}
                                        >
                                            <div className={styles.eventFormInnerContainer} id='formFields'>
                                                <div>
                                                    <p className={styles.eventFormTitle}>{data?.title}</p>
                                                    <p className={styles.eventHeaderDescription}>
                                                        {data?.description}
                                                    </p>
                                                </div>
                                                {formData && (
                                                    <DynamicForm
                                                        formFields={formFields}
                                                        formErrors={formErrors}
                                                        formData={formData}
                                                        onFieldChange={onFieldChange}
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className={styles.buttons}>
                                        <motion.button
                                            initial={{ opacity: 0, y: 35 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileTap={{ scale: 0.95 }}
                                            type='submit'
                                            onClick={() => {

                                                submitFeedback(
                                                    eventId,
                                                    formData,
                                                    setFormErrors,
                                                    setSuccess,
                                                    setFormData
                                                );

                                            }}
                                            className={styles.submitButton}
                                        >
                                            {'Submit'}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.center}>
                                <HashLoader color={'#46BF75'} size={50} />
                            </div>
                        )}
                    </Theme>
                </>
            ) : (
                <FourNotFour />
            )
            }
        </>
    );
};

export default EventPage;
