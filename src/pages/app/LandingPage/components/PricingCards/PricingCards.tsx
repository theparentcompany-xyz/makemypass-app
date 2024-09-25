import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { SiGooglemeet } from 'react-icons/si';

import styles from './PricingCards.module.css';

interface Feature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string | number;
  currency: string;
  features: Feature[];
  popular?: boolean;
  updatedDaysAgo?: number;
  tagline: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  tagline,
  price,
  currency,
  features,
  popular,
}) => {
  return (
    <div className={`${styles.pricingCard} ${popular ? styles.popular : ''}`}>
      {popular && <div className={styles.popularTag}>POPULAR</div>}
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardFooter}>{tagline}</p>
      {price.toString().length > 0 && (
        <div className={styles.priceContainer}>
          {typeof price === 'number' && (
            <span className={styles.originalPrice}>{(price * 1.5).toFixed(0)}</span>
          )}
          <span className={styles.currentPrice}>{price}</span>
          <span className={styles.currency}>{currency}</span>
        </div>
      )}
      <ul className={styles.featureList}>
        {features.map((feature, index) => (
          <li key={index} className={feature.included ? styles.included : styles.excluded}>
            {feature.included ? (
              <FaCheck className={styles.checkIcon} />
            ) : (
              <FaTimes className={styles.xIcon} />
            )}
            {feature.name}
          </li>
        ))}
      </ul>
      <a href='http://cal.com/adnankattekaden/15min' target='_blank' rel='noopener noreferrer'>
        <button className={styles.getShipfastBtn}>
          <SiGooglemeet className={styles.lightningIcon} />
          Contact Sales
        </button>
      </a>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const freeEvents: Feature[] = [
    { name: 'Registration Analytics', included: true },
    { name: 'Multiple Ticket', included: true },
    { name: 'Mail Communication', included: true },
    { name: 'Self-CheckIn', included: false },
    { name: 'In-Event Ticket Printing', included: false },
    { name: 'Payment', included: false },
    { name: 'Volunteer Management', included: false },
    { name: 'Access Based Roles', included: false },
    { name: 'Recurring Events', included: false },
    { name: 'Manage Organisation Members', included: false },
    { name: 'Team Registration', included: true }, // Uncommon feature for free events
  ];

  const paidEvents: Feature[] = [
    { name: 'Self-CheckIn', included: true },
    { name: 'In-Event Ticket Printing', included: true },
    { name: 'Payment', included: true },
    { name: 'Volunteer Management', included: true },
    { name: 'Access Based Roles', included: true },
    { name: 'Recurring Events', included: true },
    { name: 'Manage Organisation Members', included: true },
    { name: 'Conditional Ticketing', included: true },
    { name: 'Team Registration', included: true },
    { name: 'Followup Communication', included: true },
    { name: 'Scratch Card', included: true },
  ];

  const largeEvents: Feature[] = [
    { name: 'Self-CheckIn', included: true },
    { name: 'In-Event Ticket Printing', included: true },
    { name: 'Payment', included: true },
    { name: 'Volunteer Management', included: true },
    { name: 'Access Based Roles', included: true },
    { name: 'Recurring Events', included: true },
    { name: 'Manage Organisation Members', included: true },
    { name: 'Compare Event in Organization', included: true },
    { name: 'Perk Management', included: true },
    { name: 'Venue Check-In and Check-Out Analytics', included: true },
    { name: 'Games and Engagement Features', included: true },
    { name: 'Scratch Card', included: true },
    { name: 'Priority Techical Support', included: true },
  ];

  return (
    <div className={styles.pricingSection}>
      <PricingCard
        title='Free Events'
        tagline='Free Events with < 250 Participants'
        price={'Free'}
        currency=''
        features={freeEvents}
        popular={false}
      />
      <PricingCard
        title='Paid Events'
        tagline='Paid Events with < 250 Participants'
        price={'4%'}
        currency=' of Ticket Price'
        features={paidEvents}
        popular={true}
      />
      <PricingCard
        title='Large Events'
        tagline='Large Events with > 250 Participants'
        price={''}
        currency=''
        features={largeEvents}
        popular={false}
      />
    </div>
  );
};

export default PricingSection;
