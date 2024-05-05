import Slider from '../../../components/SliderButton/Slider';
import styles from './FormBuilder.module.css';

const RequiredFields = ({ icon, label }: { icon: JSX.Element; label: string }) => {
  return (
    <>
      <div className={styles.requiredField}>
        <div>
          {icon}
          <p className={styles.requiredLabel}>{label}</p>
        </div>
        <Slider checked={true} text={''} onChange={() => {}} />
      </div>
    </>
  );
};

export default RequiredFields;
