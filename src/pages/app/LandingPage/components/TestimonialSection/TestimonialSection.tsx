import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

import styles from './TestimonialSection.module.css';

interface Testimonial {
  company: string;
  content: string;
}

const TestimonialCard: React.FC<Testimonial> = ({ company, content }) => {
  return (
    <div className={styles.testimonialCard}>
      <FaQuoteLeft className={styles.quoteIcon} />
      <p className={styles.testimonialContent}>{content}</p>
      <div className={styles.testimonialAuthor}>
        <div className={styles.authorInfo}>
          <p className={styles.authorRole}>{company}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      company: 'ScaleUp Conclave 2024',
      content:
        'Being an event organiser, the hassle of managing participants was a tough spot. When I started using MakeMyPass, it was easy for me to navigate the whole event. Also the customisation in each fields is cherry on top. Loved using MakeMyPass and will be using it future events.',
    },
    {
      company: 'In50Hours',
      content:
        'The platform made it easy to manage registrations and track participants effectively. I also appreciated the email feature, which allowed me to communicate with all attendees seamlessly. Highly recommend MakeMyPass for event management!',
    },
    {
      company: 'Faya:80',
      content:
        'Working with MakeMyPass has been a smooth and efficient experience. The team is professional, responsive, and made the ticketing process seamless for our event. Highly recommend their service!',
    },
    {
      company: 'FalloutVerse',
      content:
        'Our experience with MakeMyPass has been nothing short of smooth and efficient. The team demonstrated professionalism and quick responsiveness, making the ticketing process seamless for our event. We highly recommend their services!',
    },
    {
      company: 'InitCrew',
      content:
        "Using MakeMyPass for our events has been a seamless experience. The real-time analytics, ease of managing tickets, communication, and check-ins all in one place have made event planning so much easier. It's a must-have tool for anyone looking to organize events efficiently.",
    },
    {
      company: 'Incepto 24',
      content:
        "The main part we liked was the customization they have done specifically for our needs. As far as I know, Makemypass was a single-participant registration platform. But, when we reached out to the team with our hackathon and said we needed a team-based registration they modified the platform within 1-2 days and gave us for opening registration. The overall participant experience was also seamless and effective. Will suggest Makemypass for those who are looking for a stable platform for event managing. What makes it unique is not the platform or name or app, It's the people behind it and their exceptional support.",
    },
  ];

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.testimonialGrid}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
