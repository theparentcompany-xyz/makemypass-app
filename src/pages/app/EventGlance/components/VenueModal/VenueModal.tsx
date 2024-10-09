import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

import { VenueCRUDType } from '../../../../../apis/types';
import { createEventVenue, deleteEventVenue, updateEventVenue } from '../../../../../apis/venue';
import { isUserEditor } from '../../../../../common/commonFunctions';
import Modal from '../../../../../components/Modal/Modal';
import InputField from '../../../../auth/Login/InputField';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import styles from './VenueModal.module.css';

const VenueModal = ({
  eventId,
  venues,
  setVenues,
}: {
  eventId: string;
  venues: VenueCRUDType;
  setVenues: Dispatch<SetStateAction<VenueCRUDType>>;
}) => {
  const [venueData, setVenueData] = useState({ name: '', id: '', type: '' });

  return (
    <>
      {venueData && venueData.type === 'DELETE' ? (
        <Modal
          title='Delete Confirmation'
          onClose={() => setVenues({ ...venues, showModal: false })}
        >
          <div className={styles.deleteContainer}>
            <p className={styles.deleteText}>
              {venues.venueList.find((venue) => venue.id === venueData.id)?.count ?? 0 > 0
                ? 'This venue has check-ins associated with it. Deleting this venue will delete all the check-ins associated  with it.'
                : 'Are you sure you want to delete this venue?'}
            </p>
            <div className={styles.deleteButtons}>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  deleteEventVenue(eventId, venueData.id!);
                  const updateVenues = venues.venueList.filter(
                    (venue) => venue.id !== venueData.id,
                  );
                  setVenues({ ...venues, venueList: updateVenues, showModal: true });
                  setVenueData({ name: '', id: '', type: '' });
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setVenues({ ...venues, showModal: false })}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          title='Event Venue Management'
          onClose={() => setVenues({ ...venues, showModal: false })}
        >
          {venueData.type === 'CREATE' && (
            <div className={styles.createContainer}>
              <InputField
                title='Enter Venue Name'
                type='text'
                name='venue_name'
                id='venue_name'
                icon={<></>}
                onChange={(e) =>
                  setVenueData({ ...venueData, name: e.target.value, type: 'CREATE' })
                }
              />

              <div className={styles.createButtons}>
                <button
                  className={styles.uploadButton}
                  onClick={() => {
                    if (venueData.name) {
                      createEventVenue(eventId, venueData.name, setVenues);
                      setVenueData({ name: '', id: '', type: '' });
                    } else {
                      toast.error('Please enter a venue name');
                    }
                  }}
                >
                  Save Venue
                </button>
                <button
                  onClick={() => setVenueData({ name: '', id: '', type: '' })}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>

              <hr className={styles.line} />
            </div>
          )}

          <div className={styles.headerRow}>
            <p className={styles.sectionHeader}>{`Current Venues (${venues.venueList.length})`}</p>
            {isUserEditor() && (
              <SecondaryButton
                buttonText='Add Venue'
                icon={<></>}
                onClick={() => setVenueData({ name: '', id: '', type: 'CREATE' })}
              />
            )}
          </div>
          <div className={styles.logsListingContainer}>
            {venues.venueList.map((venue) => (
              <div className={styles.log}>
                <div className={styles.logDetails}>
                  {venueData.id && venueData.name && venueData.id === venue.id ? (
                    <InputField
                      title='Enter Venue Name'
                      type='text'
                      name='venue_name'
                      id='venue_name'
                      icon={<></>}
                      disabled={!isUserEditor()}
                      value={venueData.name}
                      onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                      style={{
                        margin: '0',
                      }}
                    />
                  ) : (
                    <p className={styles.venueName}>{venue.name}</p>
                  )}

                  {venueData && venueData.id === venue.id && venueData.type === 'EDIT' ? (
                    <div className='row'>
                      <SecondaryButton
                        buttonText='Save'
                        icon={<FaSave />}
                        key={venue.id}
                        onClick={() => {
                          if (venueData.name) {
                            updateEventVenue(
                              eventId,
                              { name: venueData.name, id: venueData.id },
                              setVenues,
                            );
                            setVenueData({ name: '', id: '', type: '' });
                          } else {
                            toast.error('Please enter a venue name');
                          }
                        }}
                      />
                    </div>
                  ) : (
                    isUserEditor() && (
                      <div className='row'>
                        <FaTrash
                          title='Delete Venue'
                          color='#8e8e8e'
                          className={styles.reportIcon}
                          onClick={() => {
                            setVenueData({ name: venue.name, id: venue.id, type: 'DELETE' });
                          }}
                        />
                        <FaEdit
                          title='Edit Venue'
                          color='#8e8e8e'
                          className={styles.reportIcon}
                          onClick={() => {
                            setVenueData({ name: venue.name, id: venue.id, type: 'EDIT' });
                          }}
                        />
                      </div>
                    )
                  )}
                </div>

                <p className={styles.total} style={{ marginTop: '0.25rem' }}>
                  {venue.count} Check Ins
                </p>
              </div>
            ))}

            {venues.venueList.length === 0 && (
              <p className={styles.noLogsText}>No venues added yet</p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default VenueModal;
