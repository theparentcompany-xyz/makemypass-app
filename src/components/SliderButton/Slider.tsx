import styles from './Slider.module.css';

type Props = {
  checked: boolean;
  text?: string;
  onChange: () => void;
  labelStyle?: React.CSSProperties;
  sliderStyle?: React.CSSProperties;
};

const Slider = ({ checked, onChange, text, labelStyle, sliderStyle }: Props) => {
  if (!text) {
    return (
      <label className={styles.switch} style={sliderStyle}>
        <input type='checkbox' checked={checked} onChange={onChange} />
        <span
          className={`${styles.slider} ${styles.round} ${checked ? `${styles.checked}` : ''}`}
        ></span>
      </label>
    );
  }

  return (
    <div className={styles.container}>
      {text && (
        <label className={styles.text} style={labelStyle}>
          {text} {checked ? 'ON' : 'OFF'}
        </label>
      )}
      <label className={styles.switch} style={sliderStyle}>
        <input type='checkbox' checked={checked} onChange={onChange} />
        <span
          className={`${styles.slider} ${styles.round} ${checked ? `${styles.checked}` : ''}`}
        ></span>
      </label>
    </div>
  );
};

export default Slider;
