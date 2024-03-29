import { useContext, useEffect, useState } from 'react';
import { getFeedback } from '../../../apis/feedback';
import { GlobalContext } from '../../../contexts/globalContext';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
import Table from '../../../components/Table/Table';

const EventFeedback = () => {
  const { eventId } = useContext(GlobalContext);

  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (eventId) {
      getFeedback(eventId, setFeedback);
      console.log(feedback);
    }
  }, [eventId]);

  return (
    <Theme>
      <Header />
      <Glance tab='feedback' />
      <Table tableHeading='Feedback' tableData={[]} />
    </Theme>
  );
};

export default EventFeedback;
