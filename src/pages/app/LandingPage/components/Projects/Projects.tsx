import styles from './Projects.module.css';

import sup1 from '../../images/sup1.webp';
import sup2 from '../../images/sup2.webp';
import sup3 from '../../images/sup3.webp';

import p1 from '../../images/p1.webp';
import p2 from '../../images/p2.webp';
import p3 from '../../images/p3.webp';

const Projects = () => {
  return (
    <>
      <div className={styles.grad2}></div>
      <div className={styles.grad3}></div>
      <div className={styles.projectsSection}>
        <div className={styles.projectsHeading}>
          <p className={styles.projectsHeadingText}>Our Projects</p>
        </div>
        <div className={styles.projectsListing}>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>2-3rd Feb 2024</p>
              <p className={styles.projectDay}>Friday</p>
            </div>
            <div className={styles.lineDot}>
              <div className={styles.dot}></div>
              <div className={styles.line}></div>
            </div>
            <div className={styles.projectDetails}>
              <div className={styles.projectTexts}>
                <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
                <p className={styles.projectText}>
                  The debut of an annual spectacle. Uniting entrepreneurs, investors, professionals,
                  and business enthusiasts at an electrifying two-day extravaganza!
                </p>
                <div className={styles.counts}>
                  <p className={styles.countT}>
                    <span className={styles.count}>6897 </span>
                    <span className={styles.countText}>Registrations</span>
                  </p>
                  <p className={styles.countT}>
                    <span className={styles.count}>3394 </span>
                    <span className={styles.countText}>Check-Ins</span>
                  </p>
                </div>
              </div>
              <div className={styles.projectImagesContainer}>
                <div className={styles.projectImages}>
                  <img src={sup1} alt='' className={styles.projectImage} />
                  <img src={sup2} alt='' className={styles.projectImage} />
                  <img src={sup3} alt='' className={styles.projectImage} />
                </div>
                <div className={styles.projectImages}>
                  <img src={sup1} alt='' className={styles.projectImage} />
                  <img src={sup2} alt='' className={styles.projectImage} />
                  <img src={sup3} alt='' className={styles.projectImage} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>23rd Feb 2024</p>
              <p className={styles.projectDay}>Friday</p>
            </div>
            <div className={styles.lineDot}>
              <div className={styles.dot}></div>
              <div className={styles.line}></div>
            </div>
            <div className={styles.projectDetails}>
              <div className={styles.projectTexts}>
                <p className={styles.projectHeading}>Permute 2024</p>
                <p className={styles.projectText}>
                  μLearn’s flagship soiree, unfolded at Park Centre, Technopark, Trivandrum with the
                  unveiling of μLearn 3.0, the next phase in its much-awaited evolution.
                </p>
                <div className={styles.counts}>
                  <p className={styles.countT}>
                    <span className={styles.count}>120+ </span>
                    <span className={styles.countText}>Invites Sent via MakeMyPass</span>
                  </p>
                </div>
              </div>
              <div className={styles.projectImagesContainer}>
                <div className={styles.projectImages}>
                  <img src={p1} alt='' className={styles.projectImage} />
                  <img src={p2} alt='' className={styles.projectImage} />
                  <img src={p3} alt='' className={styles.projectImage} />
                </div>
                <div className={styles.projectImages}>
                  <img src={p1} alt='' className={styles.projectImage} />
                  <img src={p2} alt='' className={styles.projectImage} />
                  <img src={p3} alt='' className={styles.projectImage} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>24th Feb 2024</p>
              <p className={styles.projectDay}>Friday</p>
            </div>
            <div className={styles.lineDot}>
              <div className={styles.dot}></div>
              <div
                className={styles.line}
                style={{
                  maxHeight: '12rem',
                }}
              ></div>
            </div>
            <div className={styles.projectDetails}>
              <div className={styles.projectTexts}>
                <p className={styles.projectHeading}>In50Hours</p>
                <p className={styles.projectText}>
                  Ideate, Innovate and Attract Investment with students, developers, and
                  entrepreneurs racing against the clock, ticking down at a 50-hour hackathon.
                </p>
                <div className={styles.counts}>
                  <p className={styles.countT}>
                    <span className={styles.count}>Paid Event </span>
                    <span className={styles.countText}>with Razorpay</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
