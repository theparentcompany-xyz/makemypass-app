import { ColorRing } from 'react-loader-spinner';
import styles from './ButtonLoader.module.css';
type Props = {
  loading?: boolean | undefined;
};

const LoaderButton = ({ loading }: Props) => {
  return (
    <div className={`${styles.loaderButton} ${loading ? styles.loading : ''}`}>
      <ColorRing
        visible={true}
        height='15'
        width='20'
        ariaLabel='blocks-loading'
        wrapperStyle={{}}
        wrapperClass='blocks-wrapper'
        colors={['f3f3f3', 'f3f3f3', 'f3f3f3', 'f3f3f3', 'f3f3f3']}
      />
    </div>
  );
};

export default LoaderButton;
