import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { getOrgData } from '../../../../apis/orgs';
import Theme from '../../../../components/Theme/Theme';
import styles from './OrganizationGlance.module.css';

const OrganizationGlance = () => {
  const dummyBanner = 'https://via.placeholder.com/75';
  const dummyTitle = 'Sample Event Title';

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    console.log('state', state);
    getOrgData(state.orgId);
  }, [state]);

  return (
    <Theme>
      <div className={styles.bannerContainer}>
        {dummyBanner ? (
          <img src={dummyBanner} alt='' className={styles.banner} />
        ) : (
          <svg height='250' width='100%' className={styles.banner}>
            <rect width='100%' height='100%' className={styles.banner} />
            <text x='40%' y='50%' fill='white' className={styles.svgText}>
              No Banner.
            </text>
            <text x='10%' y='60%' fill='white' className={styles.svgText}>
              Please Edit Event Details to add a banner
            </text>
          </svg>
        )}

        <div>
          <div className={styles.headingTexts}>
            <p className={styles.eventTitle}>{dummyTitle}</p>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default OrganizationGlance;
