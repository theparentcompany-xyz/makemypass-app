import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

import { claimScratchCard } from '../../../../../../apis/publicpage';
import type { SuccessModalProps } from '../../../types';
import styles from '../SuccessModal.module.css';

const SuccessButtonsContainer = ({
  success,
  setSuccess,
  hasScratchCard,
  setScratchCard,
  redirectButtonRef,
}: {
  success: SuccessModalProps;
  setSuccess: React.Dispatch<React.SetStateAction<SuccessModalProps>>;
  hasScratchCard?: boolean;
  setScratchCard: React.Dispatch<
    React.SetStateAction<{ name: string; image: string; isFetching: boolean }>
  >;
  redirectButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  return (
    <div className={styles.modalContainer}>
      {!success.loading ? (
        <div className={styles.modalTexts}>
          <div dangerouslySetInnerHTML={{ __html: success.followupMessage || '' }}></div>

          {success.is_approved && (
            <>
              <button
                onClick={() => {
                  const eventTitle = JSON.parse(sessionStorage.getItem('eventData')!).event_name;
                  window.open(`/${eventTitle}/view-ticket/${success.eventRegisterId}`, '_blank');
                }}
                className={styles.downloadTicketButton}
              >
                View Ticket
              </button>

              {success.is_approved && (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(success.is_approved || '');
                      const blob = await response.blob();

                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute('download', 'ticket.png');

                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      URL.revokeObjectURL(link.href);
                    } catch (error) {
                      toast.error('Failed to download ticket');
                    }
                  }}
                  className={styles.downloadTicketButton}
                >
                  Download Ticket
                </button>
              )}
            </>
          )}

          {success.show_sub_event && (
            <>
              <button
                onClick={() => {
                  const eventTitle = JSON.parse(sessionStorage.getItem('eventData')!).event_name;
                  window.open(`/${eventTitle}/sub-event/${success.eventRegisterId}`, '_blank');
                }}
                className={styles.downloadTicketButton}
              >
                Sub Event Registration
              </button>
            </>
          )}

          {hasScratchCard && (
            <button
              onClick={() => {
                setSuccess({ ...success, showModal: false });

                if (success.eventRegisterId)
                  claimScratchCard(success.eventRegisterId, setScratchCard);
              }}
              className={styles.viewTicketButton}
            >
              Next
            </button>
          )}

          {!hasScratchCard && success?.redirection?.url && (
            <button
              onClick={() => {
                window.open(success.redirection?.url, '_blank');
              }}
              ref={redirectButtonRef}
              className={styles.viewTicketButton}
            >
              Next
            </button>
          )}

          <p className={styles.contactUs}>
            If you create similar events connect us at hello@makemypass.com
          </p>
        </div>
      ) : (
        <div className={styles.loaderContainer}>
          <HashLoader color='#46BF75' size={50} />
        </div>
      )}
    </div>
  );
};

export default SuccessButtonsContainer;
