import styles from './ViewGuest.module.css';
import { FormData, FormField } from '../../../../../apis/types';
import { ResentTicket, SelectedGuest } from '../../types';
import { Dispatch, useState } from 'react';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { shortListUser } from '../../../../../apis/guest';
import { AnimatePresence, motion } from 'framer-motion';
import { BsTicketPerforatedFill } from 'react-icons/bs';
import { MdDownload } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import { checkInUser } from '../../../../../apis/scan';
import { formatDate } from '../../../../../common/commonFunctions';

const ViewGuest = ({
  formFields,
  formData,
  setSelectedGuestId,
  eventId,
  setResentTicket,
}: {
  formFields: FormField[];
  formData: FormData;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  eventId: string;
  setResentTicket: Dispatch<React.SetStateAction<ResentTicket>>;
}) => {
  const [confirmClicked, setConfirmClicked] = useState({
    confirm: false,
    value: false,
  });

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      className={styles.viewGuestsContainer}
    >
      <div className={styles.closeButton}>
        <SecondaryButton
          buttonText='Close'
          onClick={() => {
            setSelectedGuestId(null);
          }}
        />
      </div>
      <div className={styles.viewGuests}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.tsTexts}>
              <p className={styles.name}>
                <span>
                  {formData['name']}{' '}
                  <span className={styles.rowType}>{formData['ticket_code']}</span>
                </span>
                {formData['is_shortlisted'] && <span className={styles.rowType}>Shortlisted</span>}
              </p>
              <p className={styles.emailAddress}>{formData['email']}</p>
            </div>
            <div className={styles.type}>Students</div>
          </div>
          <div className={styles.tsRow2}>
            <div
              className={styles.row}
              style={{
                justifyContent: 'flex-start',
              }}
            >
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Registered</p>
                <p className={styles.fieldData}>{formatDate(formData['registered_at'])}</p>
              </div>
              {formData['check_in_date'] && (
                <div className={styles.field}>
                  <p className={styles.fieldLabel}>Checked In</p>
                  <p className={styles.fieldData}>{formatDate(formData['check_in_date'])}</p>
                </div>
              )}
            </div>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={styles.guestActions}
              >
                <div className={styles.confirmButton}>
                  {!confirmClicked.confirm && formData['is_shortlisted'] ? (
                    <SecondaryButton
                      onClick={() => {
                        setConfirmClicked({
                          confirm: true,
                          value: false,
                        });
                      }}
                      buttonText='Decline'
                    />
                  ) : (
                    !confirmClicked.confirm && (
                      <SecondaryButton
                        onClick={() => {
                          setConfirmClicked({
                            confirm: true,
                            value: true,
                          });
                        }}
                        buttonText='Accept'
                      />
                    )
                  )}
                </div>

                {confirmClicked.confirm && (
                  <div className={styles.confirmButton}>
                    <SecondaryButton
                      onClick={() => {
                        setConfirmClicked({
                          confirm: false,
                          value: false,
                        });
                      }}
                      buttonText='No'
                    />
                    <SecondaryButton
                      onClick={() => {
                        shortListUser(
                          eventId,
                          formData['id'],
                          confirmClicked.value,
                          setSelectedGuestId,
                        );
                      }}
                      buttonText={confirmClicked.value ? 'Yes, Accept' : 'Yes, Decline'}
                    />
                    <p className={styles.alertText}>
                      {confirmClicked.value
                        ? 'Are you sure you want to accept this guest?'
                        : 'Are you sure you want to decline this guest?'}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {formData['is_shortlisted'] && (
            <div className={styles.guestActionButtons}>
              <div
                className={styles.icon}
                onClick={() => {
                  if (setResentTicket) {
                    setResentTicket((prevState) => ({
                      ...prevState,
                      status: true,
                      guestId: formData['id'],
                      name: formData['name'],
                    }));
                  }
                }}
              >
                <BsTicketPerforatedFill
                  style={{
                    marginRight: '5px',
                  }}
                  size={20}
                  title='Resend Ticket'
                  color='#8E8E8E'
                />
                <span>Resent Ticket</span>
              </div>
              <div
                className={styles.icon}
                onClick={() => {
                  if (setSelectedGuestId) {
                    setSelectedGuestId((prevState) => ({
                      ...prevState,
                      id: formData['id'],
                      type: 'download',
                    }));
                  }
                }}
              >
                <MdDownload size={20} color='#8E8E8E' />
                <span>Download Ticket</span>
              </div>
              {!formData['check_in_date'] && (
                <div
                  onClick={() => {
                    checkInUser(formData['ticket_code'], eventId);
                    setSelectedGuestId((prevState) => ({
                      ...prevState,
                      id: '',
                      type: '',
                    }));
                  }}
                  className={styles.icon}
                >
                  <FaCheck size={20} color='#8E8E8E' />
                  <span>Check-In User</span>
                </div>
              )}
            </div>
          )}
        </div>
        <hr className={styles.line} />
        <div className={styles.bottomSection}>
          {Object.keys(formData).map((key: string) => {
            let fieldName = formFields.find((field) => field.field_key === key)?.title;
            if (
              key !== 'name' &&
              key !== 'email' &&
              key !== 'registered_at' &&
              key !== 'check_in_date' &&
              fieldName
            ) {
              return (
                formData[key] && (
                  <div className={styles.field} key={key}>
                    <p className={styles.fieldLabel}>{key === 'amount' ? 'Amount' : fieldName}</p>
                    <p className={styles.fieldData}>
                      {key === 'amount' && Number(formData[key]) <= 0 ? 'Free' : formData[key]}
                    </p>
                  </div>
                )
              );
            }
            return null;
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ViewGuest;
