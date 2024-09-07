import { ClipLoader } from 'react-spinners';

import styles from './ButtonLoader.module.css';

type Props = {
  loading?: boolean | undefined;
};

const LoaderButton = ({ loading }: Props) => {
  return (
    <div className={`${styles.loaderButton} ${loading ? styles.loading : ''}`}>
      <ClipLoader color='white' loading={true} size={10} aria-label='Loading Spinner' />
    </div>
  );
};

export default LoaderButton;
