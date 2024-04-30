import React from 'react';
import styles from './Events.module.css';

// RightClickMenu component
interface Position {
  x: number;
  y: number;
}

interface RightClickMenuProps {
  isOpen: boolean;
  position: Position;
  onClose: () => void;
}

const RightClickMenu: React.FC<RightClickMenuProps> = ({ isOpen, position, onClose }) => {
  const handleOptionClick = (option: string) => {
    console.log(`Selected option: ${option}`);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.rightClickMenu}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
      }}
    >
      <ul>
        <li onClick={() => handleOptionClick('Option 1')}>Duplicate Event</li>
      </ul>
    </div>
  );
};

export default RightClickMenu;
