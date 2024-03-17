import styles from './Projects.module.css';

import sup1 from '../../images/sup1.webp';
import sup2 from '../../images/sup2.webp';
import sup3 from '../../images/sup3.webp';

import p1 from '../../images/p1.webp';
import p2 from '../../images/p2.webp';
import p3 from '../../images/p3.webp';

import in1 from '../../images/in1.webp';
import in2 from '../../images/in2.webp';
import in3 from '../../images/in3.webp';

import dd1 from '../../images/dd1.webp';
import dd2 from '../../images/dd2.webp';
import dd3 from '../../images/dd3.webp';

import { PubllicEvent } from './types';
import { formatDate } from '../../../../../common/commonFunctions';
import { IoLocationOutline } from 'react-icons/io5';

const Projects = ({ events }: { events: PubllicEvent[] }) => {
  return (
    <>
      <div className={styles.grad2}></div>
      <div className={styles.grad3}></div>
      <div className={styles.projectsSection}>
        {events.filter((event) => {
          return event && new Date(event.start_date) > new Date();
        }).length > 0 && (
          <div className={styles.projectsHeading}>
            <p className={styles.projectsHeadingText}>Upcoming Events</p>
          </div>
        )}
        {events.map(
          (event) =>
            new Date(event.start_date) > new Date() && (
              <div className={styles.projectsListing}>
                <div className={styles.project}>
                  <div className={styles.projectDateDay}>
                    <p className={styles.projectDate}>{formatDate(event.start_date)}</p>
                    <p className={styles.projectDay}>
                      {new Date(event.start_date).toLocaleString('en-us', { weekday: 'long' })}
                    </p>
                  </div>
                  <div className={styles.lineDot}>
                    <div className={styles.dot}></div>
                    <div
                      style={{
                        height: '9rem',
                      }}
                      className={styles.line}
                    ></div>
                  </div>
                  <div className={styles.projectDetails}>
                    <div className={styles.projectTexts}>
                      <p className={styles.projectHeading}>{event.title}</p>
                      <p
                        className={styles.projectText}
                        dangerouslySetInnerHTML={{
                          __html: event.description.substring(0, 150) + '...',
                        }}
                      ></p>
                    </div>
                    <div className={styles.eventDatePlace}>
                      <div className={styles.eventPlace}>
                        <div className={styles.locationBox}>
                          <IoLocationOutline size={25} className={styles.locationIcon} />
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>{event?.place}</p>
                        </div>
                      </div>
                      <a
                        href={`https://makemypass.com/${event.name}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <button className={styles.registerButton}>Register Now!</button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
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
                  <img
                    src={sup1}
                    alt='group of students infornt of makemypass welcome screen at scaleup conclave 2024'
                    className={styles.projectImage}
                  />
                  <img
                    src={sup2}
                    alt='students using makemypass application for seamless checkin process at scaleup conclave 2024'
                    className={styles.projectImage}
                  />
                  <img
                    src={sup3}
                    alt='closeup shot of scanning the makemypass ticket using the qr scanner'
                    className={styles.projectImage}
                  />
                </div>
                <div className={styles.projectImages}>
                  <img
                    src={sup1}
                    alt='group of students infornt of makemypass welcome screen at scaleup conclave 2024'
                    className={styles.projectImage}
                  />
                  <img
                    src={sup2}
                    alt='students using makemypass application for seamless checkin process at scaleup conclave 2024'
                    className={styles.projectImage}
                  />
                  <img
                    src={sup3}
                    alt='closeup shot of scanning the makemypass ticket using the qr scanner'
                    className={styles.projectImage}
                  />
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
                  <img
                    src={p1}
                    alt='team makemypass being recognized as the ticketing partner for permute 2024'
                    className={styles.projectImage}
                  />
                  <img
                    src={p2}
                    alt='a glimpse of people who checkedin using makemypass tickets'
                    className={styles.projectImage}
                  />
                  <img
                    src={p3}
                    alt='a shot showing a studnet showing his makemypass ticket'
                    className={styles.projectImage}
                  />
                </div>
                <div className={styles.projectImages}>
                  <img
                    src={p1}
                    alt='team makemypass being recognized as the ticketing partner for permute 2024'
                    className={styles.projectImage}
                  />
                  <img
                    src={p2}
                    alt='a glimpse of people who checkedin using makemypass tickets'
                    className={styles.projectImage}
                  />
                  <img
                    src={p3}
                    alt='a shot showing a studnet showing his makemypass ticket'
                    className={styles.projectImage}
                  />
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
              <div className={styles.line}></div>
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
              <div className={styles.projectImagesContainer}>
                <div className={styles.projectImages}>
                  <img
                    src={in1}
                    alt='deepu s nath speaking after checkin using makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={in2}
                    alt='group photo of people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={in3}
                    alt='people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                </div>
                <div className={styles.projectImages}>
                  <img
                    src={in1}
                    alt='deepu s nath speaking after checkin using makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={in2}
                    alt='group photo of people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={in3}
                    alt='people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>14th March 2024</p>
              <p className={styles.projectDay}>Thursday</p>
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
                <p className={styles.projectHeading}>Dawn Of DPI</p>
                <p className={styles.projectText}>
                  Bringing together practitioners from diverse backgrounds to share their valuable
                  experiences in building Digital Public Goods (DPGs) and Digital Public
                  Infrastructure (DPI) using Open-Source technology.
                </p>
              </div>
              <div className={styles.projectImagesContainer}>
                <div className={styles.projectImages}>
                  <img
                    src={dd1}
                    alt='deepu s nath speaking after checkin using makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={dd2}
                    alt='group photo of people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={dd3}
                    alt='people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                </div>
                <div className={styles.projectImages}>
                  <img
                    src={dd1}
                    alt='deepu s nath speaking after checkin using makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={dd2}
                    alt='group photo of people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
                  <img
                    src={dd3}
                    alt='people who have used makemypass at in50hours'
                    className={styles.projectImage}
                  />
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
