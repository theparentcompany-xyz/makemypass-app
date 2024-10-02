import styles from './EventPartners.module.css';

type Logo = {
  src: string;
  alt: string;
  style?: React.CSSProperties;
};

const logos = [
  { src: '/app/landing/sp1.webp', alt: 'permute brand logo' },
  { src: '/app/landing/sp6.webp', alt: 'scaleup conclave brand logo', style: { height: '45px' } },
  { src: '/app/landing/sp7.webp', alt: 'sunbird brand logo' },
  { src: '/app/landing/sp8.webp', alt: 'ekstep brand logo' },
  { src: '/app/landing/sp3.webp', alt: 'bridge the gap brand logo' },
  { src: '/app/landing/sp9.webp', alt: 'brand logo 9', style: { height: '45px' } },
  { src: '/app/landing/sp10.webp', alt: 'brand logo 10', style: { height: '45px' } },
  { src: '/app/landing/sp11.webp', alt: 'brand logo 11', style: { height: '45px' } },
  { src: '/app/landing/sp5.webp', alt: 'In50Hours brand logo' },
  { src: '/app/landing/sp12.webp', alt: 'brand logo 12', style: { height: '45px' } },
  { src: '/app/landing/sp13.webp', alt: 'brand logo 13' },
  { src: '/app/landing/sp4.webp', alt: 'faya:80 brand logo' },
  { src: '/app/landing/sp14.webp', alt: 'brand logo 14' },
  { src: '/app/landing/sp2.webp', alt: 'mulearn brand logo' },
  { src: '/app/landing/sp15.webp', alt: 'brand logo 15' , style: { height: '45px' } },
];

const shuffleArray = (array: Logo[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const EventPartners = () => {
  const shuffledLogos = shuffleArray([...logos]);

  return (
    <>
      <div className={styles.eventPartnersContainer}>
        <div className={styles.eventPartners}>
          {shuffledLogos.map((logo, index) => (
            <img
              key={index}
              className={styles.logos}
              src={logo.src}
              alt={logo.alt}
              style={logo.style}
            />
          ))}
        </div>
        <div className={styles.eventPartners}>
          {shuffledLogos.map((logo, index) => (
            <img
              key={index}
              className={styles.logos}
              src={logo.src}
              alt={logo.alt}
              style={logo.style}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EventPartners;
