import styles from './ViewGuest.module.css';
import { FormData, FormField } from '../../../../../apis/types';
import { SelectedGuest } from '../../types';
import { Dispatch } from 'react';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';

const ViewGuest = ({
  formFields,
  formData,
  setSelectedGuestId,
}: {
  formFields: FormField[];
  formData: FormData;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
}) => {
  return (
    <div className={styles.viewGuestsContainer}>
      <div className={styles.closeButton}>
        <SecondaryButton
          buttonText='Close'
          onClick={() => {
            setSelectedGuestId(null);
          }}
        />
      </div>
      <div className={styles.viewGuests}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.tsTexts}>
              <p className={styles.name}>{formData['name']}</p>
              <p className={styles.emailAddress}>{formData['email']}</p>
            </div>
            <div className={styles.type}>Students</div>
          </div>
          <div className={styles.tsRow2}>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Registered</p>
              <p className={styles.fieldData}>{formData['registered_at']}</p>
            </div>
            {formData['check_in_date'] && (
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Checked In</p>
                <p className={styles.fieldData}>{formData['check_in_date']}</p>
              </div>
            )}
          </div>
        </div>
        <hr className={styles.line} />
        <div className={styles.bottomSection}>
          {Object.keys(formData).map((key: string) => {
            if (
              key !== 'name' &&
              key !== 'email' &&
              key !== 'registered_at' &&
              key !== 'check_in_date'
            ) {
              return (
                <div className={styles.field} key={key}>
                  <p className={styles.fieldLabel}>
                    {key === 'amount'
                      ? 'Amount'
                      : formFields.find((field) => field.field_key === key)?.title}
                  </p>
                  <p className={styles.fieldData}>
                    {key === 'amount' && Number(formData[key]) <= 0 ? 'Free' : formData[key]}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewGuest;
