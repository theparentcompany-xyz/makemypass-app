import styles from './Projects.module.css';

const Projects = () => {
  return (
    <div className={styles.projectsSection}>
      <div className={styles.projectsHeading}>
        <p className={styles.projectsHeadingText}>Our Projects</p>
      </div>
      <div className={styles.projectsListing}>
        <div className={styles.project}>
          <div className={styles.projectDateDay}>
            <p className={styles.projectDate}>2nd Feb 2024</p>
            <p className={styles.projectDay}>Wednesday</p>
          </div>
          <div className={styles.projectDetails}>
            <div className={styles.projectTexts}>
              <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
              <p className={styles.projectText}>
                The standard "Lorem ipsum" text starts with "Lorem ipsum dolor sit amet,{' '}
              </p>
            </div>
            <div className={styles.projectImages}>
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
            </div>
          </div>
        </div>
        <div className={styles.project}>
          <div className={styles.projectDateDay}>
            <p className={styles.projectDate}>2nd Feb 2024</p>
            <p className={styles.projectDay}>Wednesday</p>
          </div>
          <div className={styles.projectDetails}>
            <div className={styles.projectTexts}>
              <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
              <p className={styles.projectText}>
                The standard "Lorem ipsum" text starts with "Lorem ipsum dolor sit amet,{' '}
              </p>
            </div>
            <div className={styles.projectImages}>
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
            </div>
          </div>
        </div>
        <div className={styles.project}>
          <div className={styles.projectDateDay}>
            <p className={styles.projectDate}>2nd Feb 2024</p>
            <p className={styles.projectDay}>Wednesday</p>
          </div>
          <div className={styles.projectDetails}>
            <div className={styles.projectTexts}>
              <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
              <p className={styles.projectText}>
                The standard "Lorem ipsum" text starts with "Lorem ipsum dolor sit amet,{' '}
              </p>
            </div>
            <div className={styles.projectImages}>
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
              <img src='https://via.placeholder.com/150' alt='' className={styles.projectImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
