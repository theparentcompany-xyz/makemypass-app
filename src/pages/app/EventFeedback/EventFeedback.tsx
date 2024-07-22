// import { useContext, useEffect, useState } from 'react';
// import { getFeedback } from '../../../apis/feedback';
// import { GlobalContext } from '../../../contexts/globalContext';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
// import GenericTable from '../../../components/Table/GenericTable';
import styles from './EventFeedback.module.css';

const EventFeedback = () => {
  // const { eventId } = useContext(GlobalContext);

  // const [feedback, setFeedback] = useState([]);

  // useEffect(() => {
  //   if (eventId) {
  //     getFeedback(eventId, setFeedback);
  //   }
  // }, [eventId]);

  return (
    <Theme>
      <div className={styles.feedbackContainer}>
        <Header previousPageNavigate='-1' />
        <Glance tab='feedback' />

        {/* <GenericTable tableHeading='Feedbacks Recevied' tableData={feedback} /> */}
      </div>
    </Theme>
  );
};

export default EventFeedback;
