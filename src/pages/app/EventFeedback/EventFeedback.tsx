import { useContext, useEffect } from 'react';
import { getFeedback } from '../../../apis/feedback';
// import { useParams } from 'react-router';
// import { EventDetails } from '../../../apis/types';
import { GlobalContext } from '../../../contexts/globalContext';
import Theme from '../../../components/Theme/Theme';
import Header from '../../../components/EventHeader/EventHeader';
import Glance from '../../../components/Glance/Glance';
import Table from '../../../components/Table/Table';

const EventFeedback = () => {
  // const { eventTitle } = useParams<{ eventTitle: string }>();
  // const [eventData, setEventData] = useState<EventDetails>();
  const { eventId } = useContext(GlobalContext);

  useEffect(() => {
    if (eventId) {
      getFeedback(eventId);
    }
  }, []);

  return (
    <Theme>
      <Header />
      <Glance tab='feedback' />
      <Table tableHeading='Feedback' tableData={[]} />
    </Theme>
  );
};

export default EventFeedback;
