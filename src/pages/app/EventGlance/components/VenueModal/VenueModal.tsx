import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { VenueCRUDType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import styles from './VenueModal.module.css';
import InputField from '../../../../auth/Login/InputField';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { listVenues, updateVenueList } from '../../../../../apis/venue';

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
  const selectedVenueId = useRef<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateStateVenueList = ({
    venueName,
    venueId,
  }: {
    venueName: string;
    venueId?: string;
  }) => {
    if (venueId) {
      const newVenues = venues.venues.map((venue) => {
        if (venue.id === venueId) {
          return {
            ...venue,
            name: venueName,
          };
        }
        return venue;
      });

      updateVenueList(newVenues, eventId)
        .then(() => {
          listVenues(eventId, setVenues);
        })
        .catch(() => {
          toast.error('Failed to update venue');
        });
    } else {
      const newVenue = {
        id: uuidv4(),
        name: venueName,
        count: 0,
      };

      updateVenueList([...venues.venues, newVenue], eventId)
        .then(() => {
          listVenues(eventId, setVenues);
        })
        .catch(() => {
          toast.error('Failed to add venue');
        });
    }
  };

  return (
    <>
      {showDeleteModal && (
        <Modal
          title='Delete Confirmation'
          onClose={() => setVenues({ ...venues, showModal: false })}
        >
          <div className={styles.deleteContainer}>
            <p className={styles.deleteText}>
              This venue has check-ins associated with it. Deleting this venue will delete all the
            </p>
            <div className={styles.deleteButtons}>
              <button
                onClick={() => {
                  const newVenues = venues.venues.filter(
                    (venue) => venue.id !== venues.venues[0].id,
                  );
                  updateVenueList(newVenues, eventId)
                    .then(() => {
                      listVenues(eventId, setVenues);
                    })
                    .catch(() => {
                      toast.error('Failed to delete venue');
                    })
                    .finally(() => {
                      setShowDeleteModal(false);
                    });
                }}
                className={styles.deleteButton}
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
      )}
      {!showDeleteModal && (
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
              if (newVenueName.current?.value && !selectedVenueId.current) {
                updateStateVenueList({ venueName: newVenueName.current.value });
                newVenueName.current.value = '';
              } else if (newVenueName.current?.value && selectedVenueId.current) {
                updateStateVenueList({
                  venueName: newVenueName.current.value,
                  venueId: selectedVenueId.current,
                });
                newVenueName.current.value = '';
                selectedVenueId.current = null;
              } else {
                toast.error('Please enter a venue name');
              }
            }}
            className={styles.uploadButton}
          >
            Save Venue
          </button>

          <hr className={styles.line} />

          <p className={styles.sectionHeader}>Upload Logs</p>
          <div className={styles.logsListingContainer}>
            {venues.venues.map((venue) => (
              <div className={styles.log}>
                <div className={styles.logDetails}>
                  <p className={styles.logName}>{venue.name}</p>
                  <p className={styles.total} style={{ marginTop: '0.25rem' }}>
                    {venue.count} Check Ins
                  </p>
                </div>

                <div className='row'>
                  <FaTrash
                    title='Download Report'
                    color='#8e8e8e'
                    className={styles.reportIcon}
                    onClick={() => {
                      if (venues.venues.length > 1) {
                        setShowDeleteModal(true);
                      } else {
                        const newVenues = venues.venues.filter((v) => v.id !== venue.id);
                        updateVenueList(newVenues, eventId)
                          .then(() => {
                            listVenues(eventId, setVenues);
                          })
                          .catch(() => {
                            toast.error('Failed to delete venue');
                          });
                      }
                    }}
                  />
                  <FaEdit
                    title='Edit Venue'
                    color='#8e8e8e'
                    className={styles.reportIcon}
                    onClick={() => {
                      newVenueName.current!.value = venue.name;
                      selectedVenueId.current = venue.id;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default VenueModal;
