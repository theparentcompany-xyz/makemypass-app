import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

import styles from './TestimonialSection.module.css';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const TestimonialCard: React.FC<Testimonial> = ({ name, role, company, content, rating }) => {
  return (
    <div className={styles.testimonialCard}>
      <FaQuoteLeft className={styles.quoteIcon} />
      <p className={styles.testimonialContent}>{content}</p>
      <div className={styles.testimonialAuthor}>
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>{name}</h3>
          <p className={styles.authorRole}>
            {role} at {company}
          </p>
        </div>
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? styles.starFilled : styles.starEmpty} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Event Organizer',
      company: 'TechConf',
      content:
        'This platform revolutionized our event management process. The custom tickets and analytics features are game-changers!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'StartupBoost',
      content:
        'The marketing tools and user communication features helped us increase our event attendance by 40%. Highly recommended!',
      rating: 4,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Manager',
      company: 'DevMeetup',
      content:
        "From registration to post-event follow-ups, this platform streamlined our entire process. It's a must-have for any event organizer.",
      rating: 5,
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
