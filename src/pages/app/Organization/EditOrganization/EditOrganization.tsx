import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useLocation } from 'react-router';

import { isUserEditor } from '../../../../common/commonFunctions';
import Theme from '../../../../components/Theme/Theme';
import styles from './EditOrganization.module.css';

const EditOrganization = () => {
  const location = useLocation();
  const { organization } = location.state || {};

  const [banner, setBanner] = useState<File | null>(null);

  return (
    <Theme>
      <div className={styles.eventNameContainer}>
        <textarea placeholder='Event Name' className={styles.inputEventName} />
      </div>
      <div className={styles.bannerContainer}>
        <input
          type='file'
          className={styles.fileUpload}
          disabled={!isUserEditor()}
          accept='image/*'
          onChange={(e) => isUserEditor() && setBanner(e.target.files ? e.target.files[0] : null)}
        />
        {organization?.banner && !organization?.name ? (
          <>
            <IoCloseOutline className={styles.closeIcon} />
            {organization?.banner && typeof organization?.banner === 'string' && (
              <img src={organization?.banner} alt='' className={styles.banner} />
            )}
          </>
        ) : (
          <>
            {organization?.name ? (
              <>
                <IoCloseOutline className={styles.closeIcon} />
                {banner && (
                  <img src={URL.createObjectURL(banner)} alt='' className={styles.banner} />
                )}
              </>
            ) : (
              <svg height='250' width='100%' className={styles.banner}>
                {organization?.name && (
                  <>
                    <rect width='100%' height='100%' className={styles.banner} />
                    <text x='12%' y='50%' fill='white' className={styles.svgText}>
                      No Banner. Click Here to Upload (2000px x 1000px)
                    </text>
                  </>
                )}
              </svg>
            )}
          </>
        )}
      </div>
    </Theme>
  );
};

export default EditOrganization;
