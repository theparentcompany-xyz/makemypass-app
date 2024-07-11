import { motion } from 'framer-motion';

const PoppingText = ({
  totalGuests,
  todayCheckIns,
  targetGuests,
}: {
  totalGuests: number;
  targetGuests: number;
  todayCheckIns?: number;
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.25, 1],
        marginRight: [0, 5, 0],
        color: ['#47c97e', '#fdfdfd', '#47c97e'],
      }}
      transition={{
        duration: 0.75,
      }}
      key={totalGuests}
    >
      <p style={totalGuests >= targetGuests ? { color: '#47c97e' } : { color: '#fdfdfd' }}>
        {todayCheckIns && todayCheckIns >= 0 ? todayCheckIns : totalGuests}
      </p>
    </motion.div>
  );
};

export default PoppingText;
