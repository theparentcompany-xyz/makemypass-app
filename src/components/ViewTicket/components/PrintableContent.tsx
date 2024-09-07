import React from 'react';

import styles from '../ViewTicket.module.css';

const PrintableContent = ({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
  };

  return (
    <div className={styles.printableContent} style={style}>
      {children}
    </div>
  );
};

export default PrintableContent;
