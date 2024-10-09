import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { getOrgData } from '../../../../apis/orgs';
import Theme from '../../../../components/Theme/Theme';
import styles from './OrganizationGlance.module.css';
import type { OrganizationType } from './types';

const OrganizationGlance = () => {
  const location = useLocation();
  const { state } = location;

  const [organization, setOrganization] = useState<OrganizationType>({
    id: '',
    title: '',
    name: '',
    banner: '',
    logo: '',
    description: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    getOrgData(state.orgId, setOrganization);
  }, [state]);

  return (
    <Theme>
      <div className={styles.organizationContainer}>
        <div className={styles.bannerContainer}>
          {organization.banner ? (
            <img src={organization.banner} alt='' className={styles.banner} />
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

          <div className={styles.bannerTexts}>
            <div className={styles.headingTexts}>
              <p className={styles.eventTitle}>{organization.title}</p>
              <p className={styles.eventDescription}>{organization.description}</p>
            </div>
          </div>

          <div
            className={styles.buttons}
            onClick={() =>
              navigate(`/organization/${organization.name}/edit/`, {
                state: organization,
              })
            }
          >
            <button className={styles.editEventButton}>Edit Organization</button>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default OrganizationGlance;
