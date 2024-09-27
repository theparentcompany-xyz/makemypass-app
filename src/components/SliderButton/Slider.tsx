import { isUserEditor } from '../../common/commonFunctions';
import styles from './Slider.module.css';

type Props = {
  checked: boolean;
  text?: string;
  onChange: () => void;
  labelStyle?: React.CSSProperties;
  sliderStyle?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
};

const Slider = ({ checked, onChange, text, labelStyle, sliderStyle, size }: Props) => {
  if (!text) {
    return (
      <label className={styles.switch} style={sliderStyle}>
        <input type='checkbox' checked={checked} onChange={onChange} disabled={!isUserEditor()} />
        <span
          className={`${styles.slider} ${styles.round} ${checked ? `${styles.checked}` : ''} ${size && styles[size]}`}
        ></span>
      </label>
    );
  }

  return (
    <div className={styles.container}>
      {text && (
        <label className={styles.text} style={labelStyle}>
          {text}
        </label>
      )}
      <label className={styles.switch} style={sliderStyle}>
        <input type='checkbox' checked={checked} onChange={onChange} disabled={!isUserEditor()} />
        <span
          className={`${styles.slider} ${styles.round} ${checked ? `${styles.checked}` : ''} ${size && styles[size]}`}
        ></span>
      </label>
    </div>
  );
};

export default Slider;
