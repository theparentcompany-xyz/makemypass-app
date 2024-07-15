import styles from './ViewGuest.module.css';
import { FormDataType, FormFieldType } from '../../../../../apis/types';
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
import { isArray } from 'chart.js/helpers';
import { deleteSubmission, initateRefund } from '../../../../../apis/guests';
import { FaTrash } from 'react-icons/fa';
import Modal from '../../../../../components/Modal/Modal';

const ViewGuest = ({
  formFields,
  formData,
  setSelectedGuestId,
  eventId,
  setResentTicket,
  type,
}: {
  formFields: FormFieldType[];
  formData: FormDataType;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  eventId: string;
  setResentTicket?: Dispatch<React.SetStateAction<ResentTicket>>;
  type?: string;
}) => {
  const [confirmClicked, setConfirmClicked] = useState({
    confirm: false,
    value: false,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [initateRefundClicked, setInitateRefundClicked] = useState(false);

  return (
    <>
      {deleteModal && (
        <>
          <Modal
            title='Delete Submission'
            onClose={() => {
              setDeleteModal(false);
            }}
          >
            <div className={styles.deleteModal}>
              <p className={styles.deleteModalText}>
                Are you sure you want to delete this submission?
              </p>
              <div className={styles.deleteModalButtons}>
                <SecondaryButton
                  buttonText='Cancel'
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                />
                <SecondaryButton
                  buttonText='Delete'
                  onClick={() => {
                    deleteSubmission(eventId, formData['id'] as string);
                    setSelectedGuestId(null);
                    setDeleteModal(false);
                  }}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
      <Modal
        type='side'
        title='View Guest'
        onClose={() => setSelectedGuestId(null)}
        style={{
          maxWidth: '30%',
        }}
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
                  <span>{formData['name'] || formData['fullname']} </span>
                  {formData['is_approved'] && <span className={styles.rowType}>Shortlisted</span>}
                </p>
                <p className={styles.ticketCode}>Ticket Code: {formData['ticket_code']}</p>
                <p className={styles.emailAddress}>{formData['email']}</p>
              </div>
              {formData['category'] && <div className={styles.type}>{formData['category']}</div>}
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
                  {!isArray(formData['registered_at']) && (
                    <p className={styles.fieldData}>
                      {formatDate(formData['registered_at'], true)}
                    </p>
                  )}
                </div>
                {formData['check_in_date'] && (
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Checked In</p>
                    {!isArray(formData['check_in_date']) && (
                      <p className={styles.fieldData}>
                        {formatDate(formData['check_in_date'], true)}
                      </p>
                    )}
                  </div>
                )}
                {formData['check_out_date'] && (
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Checked Out</p>
                    {!isArray(formData['check_out_date']) && (
                      <p className={styles.fieldData}>
                        {formatDate(formData['check_out_date'], true)}
                      </p>
                    )}
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
                    {!confirmClicked.confirm && formData['is_approved'] === null ? (
                      <>
                        <SecondaryButton
                          onClick={() => {
                            setConfirmClicked({
                              confirm: true,
                              value: false,
                            });
                          }}
                          buttonText='Decline'
                        />

                        <SecondaryButton
                          onClick={() => {
                            setConfirmClicked({
                              confirm: true,
                              value: true,
                            });
                          }}
                          buttonText='Accept'
                        />
                      </>
                    ) : !confirmClicked.confirm &&
                      formData['is_approved'] &&
                      formData['check_in_date'] === null ? (
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
                      !confirmClicked.confirm &&
                      formData['check_in_date'] === null && (
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
                          if (!isArray(formData['id']))
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
            {formData['is_approved'] && (
              <div className={styles.guestActionButtons}>
                {type !== 'overview' && (
                  <div
                    className={styles.icon}
                    onClick={() => {
                      if (setResentTicket) {
                        setResentTicket((prevState) => ({
                          ...prevState,
                          status: true,
                          guestId: formData['id'],
                          name: formData['name'] || formData['fullname'],
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
                )}
                <div
                  className={styles.icon}
                  onClick={() => {
                    if (setSelectedGuestId) {
                      setSelectedGuestId((prevState) => ({
                        ...prevState,
                        id: formData['id'].toString(),
                        type: 'download',
                      }));
                    }
                  }}
                >
                  <MdDownload size={20} color='#8E8E8E' />
                  <span>View Ticket</span>
                </div>
                {!formData['check_in_date'] && (
                  <div
                    onClick={() => {
                      if (!isArray(formData['ticket_code']))
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
            <div
              className={styles.deleteIcon}
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              <FaTrash size={15} color='#8E8E8E' />
              <span> Delete Submission</span>
            </div>

            {import.meta.env.VITE_CURRENT_ENV === 'dev' &&
              Number(formData['amount']) > 0 &&
              (!initateRefundClicked ? (
                <SecondaryButton
                  onClick={() => {
                    setInitateRefundClicked(true);
                  }}
                  buttonText='Initate Refund'
                />
              ) : (
                <div className={styles.confirmButton}>
                  <SecondaryButton
                    onClick={() => {
                      setInitateRefundClicked(false);
                    }}
                    buttonText='No'
                  />
                  <SecondaryButton
                    onClick={() => {
                      if (!isArray(formData['id']))
                        initateRefund(eventId, formData['id'], setInitateRefundClicked);
                    }}
                    buttonText='Yes, Initate Refund'
                  />
                  <p className={styles.alertText}>Are you sure you want to initiate refund.</p>
                </div>
              ))}
          </div>{' '}
          {formData['invited_by'] && (
            <>
              <hr className={styles.line} />
              <div className={styles.invitedBy}>
                {formData['invited_by'] && (
                  <p className={styles.invitedByText}>{`Invited By ${formData['invited_by']}`}</p>
                )}
                {formData['entry_date'] && typeof formData['entry_date'] === 'string' && (
                  <p
                    className={styles.invitedByText}
                  >{`Registered For ${formatDate(formData['entry_date'])}`}</p>
                )}
              </div>
              <hr className={styles.line} />
            </>
          )}
          {Number(formData['amount']) > 0 && (
            <>
              <hr className={styles.line} />
              <div
                className={styles.invitedBy}
                style={{
                  justifyContent: 'flex-start',
                  columnGap: '4px',
                }}
              >
                {formData['amount'] && (
                  <p className={styles.invitedByText}>{`Paid Rs.${formData['amount']}`}</p>
                )}
                {formData['ticket_count'] && (
                  <p
                    className={styles.invitedByText}
                  >{` for ${formData['ticket_count']} tickets.`}</p>
                )}
              </div>
              <hr className={styles.line} />
            </>
          )}
          <div className={styles.bottomSection}>
            {Object.keys(formData).map((key: string) => {
              const fieldName = formFields.find((field) => field.field_key === key)?.title;
              if (
                key !== 'name' &&
                key !== 'email' &&
                key !== 'registered_at' &&
                key !== 'is_checked_in' &&
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
      </Modal>
    </>
  );
};

export default ViewGuest;
