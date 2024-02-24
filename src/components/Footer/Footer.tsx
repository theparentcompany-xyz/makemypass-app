import styles from './Footer.module.css';
import { FaInstagram } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <>
      <footer>
        <div className={styles.footerContainer}>
          <hr />
          <div
            style={{
              justifyContent: 'space-between',
            }}
            className='row'
          >
            <a href='https://www.theparentcompany.xyz/' target='_blank' rel='noopener noreferrer'>
              <img className={styles.tpclogo} src='/app/tpc.webp' alt='' />
            </a>
            <div className={styles.socialIcons}>
              <a
                href='https://www.instagram.com/theparentcompany.xyz/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram color='a4a4a4' size={20} />
              </a>
              <a href='https://twitter.com/tpc_xyz' target='_blank' rel='noopener noreferrer'>
                <FaXTwitter color='a4a4a4' size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
