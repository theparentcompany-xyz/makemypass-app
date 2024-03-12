import { Link, useNavigate } from 'react-router-dom';
import styles from './BulkImportHeader.module.css';
import { PiFileCsv } from "react-icons/pi";
import { getCsvTemplate } from '../../../../../apis/guests';
import SectionButton from '../../../../../components/SectionButton/SectionButton';
import { GlobalContext } from '../../../../../contexts/globalContext';
import { useContext } from 'react';

const BulkImportHeader = ({
    buttonType,
}: {
    buttonType?: string;
}) => {
    const { eventId } = useContext(GlobalContext);
    const navigate = useNavigate();
    return (
        <>
            <div className={styles.checkInHeader}>
                <button
                    onClick={() => {
                        navigate(-1);
                    }}
                    className={styles.backButton}
                >
                    {'<'}
                </button>
                <p className={styles.checkInHeading}>Bulk Import</p>
            </div>

            <div className={styles.checkInActions}>
                {buttonType != 'back' && (
                    <Link to={'./'}>
                        <SectionButton
                            buttonText='Download CSV Template'
                            buttonColor='#C33D7B'
                            icon={<PiFileCsv size={25} color='#5B75FB' />}
                            onClick={() => {
                                if (eventId) {
                                    getCsvTemplate(eventId);
                                }
                            }}
                        />
                    </Link>

                )}
                ``
            </div>
        </>
    );
};

export default BulkImportHeader;
