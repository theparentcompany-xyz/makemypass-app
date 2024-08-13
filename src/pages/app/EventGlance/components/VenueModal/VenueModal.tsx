import { Dispatch, SetStateAction, useRef } from 'react';
import { VenueCRUDType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import styles from './VenueModal.module.css';
import { BiSolidReport } from 'react-icons/bi';
import InputField from '../../../../auth/Login/InputField';
import { v4 as uuidv4 } from 'uuid';

const VenueModal = ({
  eventId,
  venues,
  setVenues,
}: {
  eventId: string;
  venues: VenueCRUDType;
  setVenues: Dispatch<SetStateAction<VenueCRUDType>>;
}) => {
  const newVenueName = useRef<HTMLInputElement>(null);
  console.log(eventId);

  return (
    <>
      <Modal title='Add Venue' onClose={() => setVenues({ ...venues, showModal: false })}>
        <div className={styles.bulkUploadContainer}>
          <InputField
            placeholder='Enter Venue Name'
            type='text'
            name='venue_name'
            id='venue_name'
            icon={<></>}
            ref={newVenueName}
          />
        </div>

        <button
          onClick={() => {
            const newVenue = {
              id: uuidv4(),
              name: newVenueName.current?.value || '',
              count: 0,
            };

            setVenues({
              ...venues,
              venues: [...venues.venues, newVenue],
            });
          }}
          className={styles.uploadButton}
        >
          Add Venue
        </button>

        <hr className={styles.line} />

        <p className={styles.sectionHeader}>Upload Logs</p>
        <div className={styles.logsListingContainer}>
          <div className={styles.log}>
            <div className={styles.logDetails}>
              <p className={styles.logName}>Hardcoded File Name</p>
              <p className={styles.total} style={{ marginTop: '0.25rem' }}>
                Hardcoded Ticket Status
              </p>
            </div>
            <p className={styles.logStatus}>Hardcoded Status</p>

            <BiSolidReport title='Download Report' color='#8e8e8e' className={styles.reportIcon} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VenueModal;
