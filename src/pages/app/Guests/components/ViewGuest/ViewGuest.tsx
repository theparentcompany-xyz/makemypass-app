import styles from './ViewGuest.module.css';
import { ResentTicket, SelectedGuest } from '../../types';
import React, { Dispatch, useEffect, useState } from 'react';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { setGuestShortlistStatus } from '../../../../../apis/guest';
import { AnimatePresence, motion } from 'framer-motion';
import { BsTicketPerforatedFill } from 'react-icons/bs';
import { MdDownload, MdMail } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import { checkInUser } from '../../../../../apis/scan';
import { formatDate } from '../../../../../common/commonFunctions';
import { isArray } from 'chart.js/helpers';
import {
  deleteGuestSubmission,
  getGuestMailLog,
  getGuestVisistedVenues,
  initateGuestRefund,
} from '../../../../../apis/guests';
import { FaEdit, FaMailBulk, FaTrash, FaWalking } from 'react-icons/fa';
import Modal from '../../../../../components/Modal/Modal';
import { EmailType, VisitedVenues } from './types';
import { RegistrationDataType } from '../../../Overview/Overview/types';
import { BiChevronDown } from 'react-icons/bi';
import { HashLoader } from 'react-spinners';
import { multipleTicketCount } from '../../../CheckIns/pages/ScanQR/types';
import ScannerResponseModal from '../../../CheckIns/components/ScannerResponseModal/ScannerResponseModal';
import PreviewBox from '../../../EventGlance/components/MailModals/UpdateMail/components/PreviewBox/PreviewBox';

const ViewGuest = ({
  selectedGuestData,
  setSelectedGuestId,
  eventId,
  setResentTicket,
  setSelectedGuest,
  type,
  setTriggerFetch,
}: {
  selectedGuestData: RegistrationDataType | undefined;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  eventId: string;
  setResentTicket?: Dispatch<React.SetStateAction<ResentTicket>>;
  setSelectedGuest?: Dispatch<React.SetStateAction<RegistrationDataType | undefined>>;
  type?: string;
  setTriggerFetch?: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [confirmClicked, setConfirmClicked] = useState({
    confirm: false,
    value: false,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [mailLog, setMailLog] = useState<{
    showLog: boolean;
    logs: EmailType[];
  }>({
    showLog: false,
    logs: [],
  });

  const [visitedVenues, setVisitedVenues] = useState<VisitedVenues>({
    status: false,
    venues: [],
  });
  const [initateRefundClicked, setInitateRefundClicked] = useState(false);

  const toggleMailContent = (id: string) => {
    setMailLog((prevState) => ({
      ...prevState,
      logs: prevState.logs.map((mail) => {
        if (mail.id === id) {
          return {
            ...mail,
            show_content: !mail.show_content as boolean,
          };
        }
        return mail;
      }),
    }));
  };

  const [multipleTickets, setMultipleTickets] = useState<multipleTicketCount>({
    hasMultipleTickets: false,
  });
  const [trigger, setTrigger] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (selectedGuestData && selectedGuestData['id'] && trigger) {
      checkInUser({
        ticketId: selectedGuestData['ticket_code'],
        eventId,
        setMessage,
        setMultipleTickets,
        multipleTickets,
        setTrigger,
      });
    }
  }, [trigger, eventId, selectedGuestData]);

  return (
    <>
      <ScannerResponseModal
        message={message}
        setMessage={setMessage}
        setTrigger={setTrigger}
        setMultipleTickets={setMultipleTickets}
        multipleTickets={multipleTickets}
        type='checkIn'
      />
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
                    if (selectedGuestData) {
                      deleteGuestSubmission(
                        eventId,
                        selectedGuestData['id'] as string,
                        setTriggerFetch,
                      );
                    }
                    setSelectedGuestId(null);
                    setDeleteModal(false);
                  }}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
      {visitedVenues.status && (
        <div className={styles.topLayer}>
          <Modal
            title='Visited Venues'
            onClose={() => {
              setVisitedVenues({
                status: false,
                venues: [],
              });
            }}
          >
            <div className={styles.visitedVenues}>
              {visitedVenues.venues.length > 0 ? (
                visitedVenues.venues.map((venue) => {
                  return (
                    <div className={styles.venue}>
                      <p className={styles.venueName}>{`${venue.name},`}</p>
                      <p className={styles.venueTime}>{formatDate(venue.visited_at, true)}</p>
                    </div>
                  );
                })
              ) : (
                <p className={styles.noVisitedVenues}>No Visited Venues</p>
              )}
            </div>
          </Modal>
        </div>
      )}
      {mailLog.showLog && (
        <Modal
          title='Mail Log'
          onClose={() =>
            setMailLog({
              showLog: false,
              logs: [],
            })
          }
          style={{
            maxWidth: '40rem',
            alignItems: 'flex-start',
          }}
        >
          <div className={styles.mailsContainer}>
            {mailLog.logs.map((mail, index) => {
              return (
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
                    <MdMail size={25} />
                    <div className={styles.mailHeaderContents}>
                      <p className={styles.mailType}>{mail.type} Mail</p>
                      <p className={styles.mailSubject}>{mail.subject}</p>
                      <p className={styles.mailDescription}>
                        To: <span>{mail.send_to}</span> <br />
                        From: <span>{mail.send_from}</span>
                      </p>

                      {mail.show_content && (
                        <>
                          <hr className={styles.line} />
                          <div className={styles.mailContent}>
                            <pre> {mail.body}</pre>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
      <Modal
        type='side'
        title='View Guest'
        onClose={() => {
          setSelectedGuestId(null);
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
        {selectedGuestData &&
        Object.keys(selectedGuestData).length > 0 &&
        selectedGuestData.submissions.length > 0 ? (
          <div className={styles.viewGuests}>
            <div className={styles.topSection}>
              <div className={styles.row}>
                <div className={styles.tsTexts}>
                  <p className={styles.name}>
                    <span>
                      {Array.isArray(selectedGuestData.submissions) &&
                        selectedGuestData.submissions.find(
                          (submission) => submission.title === 'Name',
                        )?.value}{' '}
                    </span>
                    {selectedGuestData['is_approved'] && (
                      <span className={styles.rowType}>Shortlisted</span>
                    )}
                    {selectedGuestData['category'] && (
                      <div className={styles.type}>{selectedGuestData['category']}</div>
                    )}
                  </p>
                  <p className={styles.emailAddress}>
                    {Array.isArray(selectedGuestData.submissions) &&
                      selectedGuestData.submissions.find(
                        (submission) => submission.type === 'email',
                      )?.value}
                  </p>
                  <p className={styles.ticketCode}>
                    <span>Ticket Code:</span> {selectedGuestData['ticket_code']}
                  </p>
                </div>
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
                    {!isArray(selectedGuestData['registered_at']) && (
                      <p className={styles.fieldData}>
                        {formatDate(selectedGuestData['registered_at'], true)}
                      </p>
                    )}
                  </div>
                  {selectedGuestData['check_in_date'] && (
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>Checked In</p>
                      {!isArray(selectedGuestData['check_in_date']) && (
                        <p className={styles.fieldData}>
                          {formatDate(selectedGuestData['check_in_date'], true)}
                        </p>
                      )}
                    </div>
                  )}
                  {selectedGuestData['check_out_date'] && (
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>Checked Out</p>
                      {!isArray(selectedGuestData['check_out_date']) && (
                        <p className={styles.fieldData}>
                          {formatDate(selectedGuestData['check_out_date'], true)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {selectedGuestData['event_approval_required'] && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className={styles.guestActions}
                    >
                      <div className={styles.confirmButton}>
                        {!confirmClicked.confirm && selectedGuestData['is_approved'] === null ? (
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
                          selectedGuestData['is_approved'] &&
                          selectedGuestData['check_in_date'] === null ? (
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
                          selectedGuestData['check_in_date'] === null && (
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
                              if (!isArray(selectedGuestData['id']))
                                setGuestShortlistStatus(
                                  eventId,
                                  selectedGuestData['id'],
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
                )}
              </div>
              {selectedGuestData['is_approved'] && (
                <div className={styles.guestActionButtons}>
                  {type !== 'overview' && (
                    <div
                      className={styles.icon}
                      onClick={() => {
                        if (setResentTicket && Array.isArray(selectedGuestData.submissions)) {
                          setResentTicket((prevState) => ({
                            ...prevState,
                            status: true,
                            guestId: selectedGuestData['id'],
                            name: selectedGuestData.submissions.find(
                              (submission) => submission.title === 'Name',
                            )?.value as string,
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
                      <span>Resend Ticket</span>
                    </div>
                  )}
                  <div
                    className={styles.icon}
                    onClick={() => {
                      if (setSelectedGuestId) {
                        setSelectedGuestId((prevState) => ({
                          ...prevState,
                          id: selectedGuestData['id'].toString(),
                          type: 'download',
                        }));
                      }
                    }}
                  >
                    <MdDownload size={20} color='#8E8E8E' />
                    <span>View Ticket</span>
                  </div>
                  {selectedGuestData['is_checked_in'] && selectedGuestData['has_venues'] && (
                    <div
                      className={styles.icon}
                      onClick={() => {
                        setVisitedVenues((prevState) => ({
                          ...prevState,
                          status: true,
                        }));
                        if (typeof selectedGuestData['id'] === 'string')
                          getGuestVisistedVenues(
                            eventId,
                            selectedGuestData['id'],
                            setVisitedVenues,
                          );
                      }}
                    >
                      <FaWalking size={20} color='#8E8E8E' />
                      <span>View Visisted Venues</span>
                    </div>
                  )}
                  {selectedGuestData['show_checked_in_button'] && (
                    <div
                      onClick={() => {
                        if (!isArray(selectedGuestData['ticket_code']))
                          checkInUser({
                            ticketId: selectedGuestData['ticket_code'],
                            eventId,
                            setMessage,
                            setMultipleTickets,
                            multipleTickets,
                            setTrigger,
                          });
                      }}
                      className={styles.icon}
                    >
                      <FaCheck size={20} color='#8E8E8E' />
                      <span>Check-In User</span>
                    </div>
                  )}
                  <div
                    className={styles.icon}
                    onClick={() => {
                      if (typeof selectedGuestData['id'] === 'string')
                        getGuestMailLog(eventId, selectedGuestData['id'], setMailLog);
                    }}
                  >
                    <FaMailBulk size={20} color='#8E8E8E' />
                    <span>View Mail Log</span>
                  </div>
                </div>
              )}
              <div className='row'>
                <div
                  className={styles.deleteIcon}
                  onClick={() => {
                    setDeleteModal(true);
                  }}
                >
                  <FaTrash size={15} color='#8E8E8E' />
                  <span> Delete Submission</span>
                </div>
                {!type && (
                  <div
                    className={styles.deleteIcon}
                    onClick={() => {
                      if (setSelectedGuest) setSelectedGuest(selectedGuestData);
                      setSelectedGuestId((prevState) => ({
                        ...prevState,
                        id: selectedGuestData['id'],
                        type: 'edit',
                      }));
                    }}
                  >
                    <FaEdit size={15} color='#8E8E8E' />
                    <span> Edit Submission</span>
                  </div>
                )}
              </div>

              {import.meta.env.VITE_CURRENT_ENV === 'dev' &&
                Number(selectedGuestData['amount']) > 0 &&
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
                        if (!isArray(selectedGuestData['id']))
                          initateGuestRefund(
                            eventId,
                            selectedGuestData['id'],
                            setInitateRefundClicked,
                          );
                      }}
                      buttonText='Yes, Initate Refund'
                    />
                    <p className={styles.alertText}>Are you sure you want to initiate refund.</p>
                  </div>
                ))}
            </div>{' '}
            {selectedGuestData['consumed_by'] &&
              Object.entries(selectedGuestData['consumed_by']).length > 0 && (
                <>
                  <hr className={styles.line} />
                  <div className={styles.invitedBy}>
                    <div className={styles.invitedByText}>
                      Tickets Consumed By
                      <ul>
                        {Object.entries(selectedGuestData['consumed_by']).map(([key, value]) => (
                          <li key={key}>
                            <span
                              onClick={() => {
                                setSelectedGuestId((prevState) => ({
                                  ...prevState,
                                  id: value.id,
                                  type: 'view',
                                }));
                              }}
                              style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              {value.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            {selectedGuestData['bought_by'] && (
              <>
                <hr className={styles.line} />
                <div className={styles.invitedBy}>
                  {selectedGuestData['bought_by'] && (
                    <p className={styles.invitedByText}>
                      Ticket Bought By{' '}
                      <span
                        onClick={() => {
                          setSelectedGuestId((prevState) => ({
                            ...prevState,
                            id: selectedGuestData['bought_by'].id,
                            type: 'view',
                          }));
                        }}
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {selectedGuestData['bought_by'].name}
                      </span>
                    </p>
                  )}
                </div>
                <hr className={styles.line} />
              </>
            )}
            {selectedGuestData['invited_by'] && (
              <>
                <div className={styles.invitedBy}>
                  {selectedGuestData['invited_by'] && (
                    <p
                      className={styles.invitedByText}
                    >{`Invited By ${selectedGuestData['invited_by']}`}</p>
                  )}
                  {selectedGuestData['entry_date'] &&
                    typeof selectedGuestData['entry_date'] === 'string' && (
                      <>
                        <p
                          className={styles.invitedByText}
                        >{`Registered For ${formatDate(selectedGuestData['entry_date'])}`}</p>
                        <hr className={styles.line} />
                      </>
                    )}
                </div>
              </>
            )}
            {Number(selectedGuestData['amount']) > 0 && (
              <>
                <hr className={styles.line} />
                <div
                  className={styles.invitedBy}
                  style={{
                    justifyContent: 'flex-start',
                    columnGap: '4px',
                  }}
                >
                  {selectedGuestData['amount'] && (
                    <p
                      className={styles.invitedByText}
                    >{`Paid Rs.${selectedGuestData['amount']}`}</p>
                  )}
                  {selectedGuestData['ticket_count'] && (
                    <p
                      className={styles.invitedByText}
                    >{` for ${selectedGuestData['ticket_count']} tickets`}</p>
                  )}
                  {selectedGuestData['extra_ticket'] > 0 && (
                    <p
                      className={styles.invitedByText}
                    >{` & ${selectedGuestData['extra_ticket']} extra tickets.`}</p>
                  )}
                  {selectedGuestData['coupon_code'] && (
                    <p
                      className={styles.invitedByText}
                    >{` with coupon code ${selectedGuestData['coupon_code']}`}</p>
                  )}
                </div>
                <hr className={styles.line} />
              </>
            )}
            <div className={styles.bottomSection}>
              {Array.isArray(selectedGuestData.submissions) &&
                selectedGuestData.submissions.map((submission, index) => {
                  return (
                    <div className={styles.field} key={index}>
                      <p className={styles.fieldLabel}>{submission.title}</p>
                      <p className={styles.fieldData}>
                        <div className={styles.previewBoxContainer}>
                          {submission.type === 'file' ? (
                            Array.isArray(submission.value) ? (
                              submission.value.map((file, index) => {
                                return (
                                  <PreviewBox
                                    key={index}
                                    index={index}
                                    preview={{
                                      previewURL: file,
                                      previewExtension: 'image/png',
                                      previewName: file.split('/').pop() as string,
                                    }}
                                  />
                                );
                              })
                            ) : (
                              <PreviewBox
                                key={index}
                                index={index}
                                preview={{
                                  previewURL: submission.value,
                                  previewExtension: 'image/png',
                                  previewName: submission.value.split('/').pop() as string,
                                }}
                              />
                            )
                          ) : (
                            submission.value
                          )}
                        </div>
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className={styles.loader}>
            <HashLoader color='#47c97e' size={50} />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewGuest;
