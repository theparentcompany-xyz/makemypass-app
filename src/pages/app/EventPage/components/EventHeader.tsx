import { IoLocationOutline } from 'react-icons/io5';
import { EventDetails } from '../../../../apis/types';
import styles from './EventHeader.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { FaExpandAlt } from 'react-icons/fa';

const EventHeader = ({ eventData }: { eventData: EventDetails | undefined }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.eventHeaderContainer}>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.bannerContainer}
        onClick={() => {
          navigate(`/${eventData?.name}`);
        }}
      >
        <div className={styles.eventTopHeader}>
          <img className={styles.bannerImg} src={eventData?.banner} alt='' />
          <div>
            <p className={styles.eventTitle}>{eventData?.title}</p>
            <div className={styles.eventDatePlace}>
              <div className={styles.eventDate}>
                <div className={styles.dateBox}>
                  <p className={styles.eventMonth}>MAR</p>
                  <p className={styles.eventDateNum}>14</p>
                </div>
                <div className={styles.eventDateTimeText}>
                  <p className={styles.eventDateText}>{eventData?.start_date}</p>
                  <p className={styles.eventTimeText}>
                    {eventData?.start_time} - {eventData?.end_time} {eventData?.end_date}
                  </p>
                </div>
              </div>
              <div className={styles.eventPlace}>
                <div className={styles.locationBox}>
                  <IoLocationOutline size={25} className={styles.locationIcon} />
                </div>
                <div className={styles.eventDateTimeText}>
                  <p className={styles.eventDateText}>{eventData?.place}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={styles.row1} style={showFullDesc ? { flexDirection: 'column' } : {}}>
        <div className={styles.eventDescriptionContainer}>
          {eventData?.description && (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className={styles.eventDescHeading}>About the Event</p>
              <motion.p
                className={styles.eventDescription}
                initial={{ height: 'fit-content' }}
                animate={{ height: showFullDesc ? 'fit-content' : '60px' }}
                transition={{ duration: 0.5 }}
              >
                {showFullDesc ? (
                  <>
                    <p>
                      <strong>Building for Billions - Dawn of DPI</strong> is an event hosted by the
                      Sunbird community, bringing together practitioners from diverse backgrounds to
                      share their valuable experiences in building Digital Public Goods (DPGs) and
                      Digital Public Infrastructure (DPI) using Open-Source technology.
                    </p>

                    <p>
                      <strong>Event Objectives:</strong>
                    </p>
                    <ul>
                      <li>
                        Create awareness and grow the community around Digital Public Goods (DPGs)
                        and Sunbird Building Blocks by showcasing the next-generation tech stacks
                        and architectural concepts.
                      </li>
                      <li>
                        Illustrate the business opportunities that are opening up for organizations,
                        entrepreneurs, and other businesses in the field of technology, thanks to
                        the advent of DPI.
                      </li>
                      <li>
                        Discuss and brainstorm with the developer communities, the key concepts
                        around - architecture for scale and reliability, interoperability,
                        configurability etc. This would also provide tangible learning for the
                        participants.
                      </li>
                    </ul>

                    <p>
                      An exciting chance to deliberate on and explore business opportunities in
                      technology, this is a first-of-its kind event in Trivandrum that will host
                      some of the most eminent personalities in the technology domain in India
                      today.
                    </p>

                    <p>
                      This will also be an opportunity to engage with experts who have built tech
                      systems at national scale, a chance to expand your knowledge, and to gain
                      insights to play a crucial role in shaping the future of inclusive digital
                      innovation.
                    </p>

                    <p>
                      <strong>Event Experience:</strong>
                    </p>
                    <ul>
                      <li>
                        <strong>Discover</strong> - Insights by industry leaders, DPI and DPG
                        pioneers.
                      </li>
                      <li>
                        <strong>Explore</strong> - exhibits of diverse adoptions of Sunbird and
                        other DPGs.
                      </li>
                      <li>
                        <strong>Learn</strong> - about DPGs and OpenSource products presented by
                        practitioners, about the exciting business opportunities in the field, and
                        the prospects of collaboration.
                      </li>
                      <li>
                        <strong>Contribute</strong> - share ideas, feedback, practical experiences
                        and collaborate to brainstorm innovative solutions leveraging DPGs.
                      </li>
                      <li>
                        <strong>Transform</strong> - Participants will have the opportunity to get
                        the required knowledge to showcase their innovative solutions.
                      </li>
                    </ul>
                  </>
                ) : (
                  'Building for Billions - Dawn of DPI is an event hosted by the Sunbird community, bringing together practitioners from diverse backgrounds to share their valuable experiences in building Digital'
                )}
              </motion.p>
              <div className={styles.expandIcon}>
                <FaExpandAlt
                  onClick={() => {
                    setShowFullDesc((prev) => !prev);
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>

        <div className={styles.googleContainer}>
          <div className={styles.locationHeader}>
            <IoLocationOutline size={20} className={styles.locationIcon} />
            <p>Location</p>
          </div>
          <iframe
            style={{ width: '100%' }}
            src={`https://maps.google.com/maps?q=${eventData?.location.lat},${eventData?.location.lng}&z=16&output=embed`}
          ></iframe>

          <div className={styles.bottomLocationHeader}>
            <div className={styles.eventDateTimeText}>
              <p className={styles.eventDateText}>{eventData?.place}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
