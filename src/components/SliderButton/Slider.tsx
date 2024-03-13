import styles from './Slider.module.css'

type Props = {
    checked: boolean
    text: string
    onChange: () => void
}

const Slider = ({ checked, onChange, text }: Props) => {
    return (
        <div className={styles.container}>
            <label className={styles.text}>{text}</label>
            <label className={styles.switch}>
                <input type='checkbox' checked={checked} onChange={onChange} />
                <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
        </div>

    )
}

export default Slider