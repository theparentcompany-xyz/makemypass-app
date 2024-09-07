import React, { useEffect } from 'react';

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
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightClickMenu: React.FC<RightClickMenuProps> = ({
  isOpen,
  position,
  onClose,
  setShowModal,
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuClicked = target.closest('.rightClickMenu');
      if (isMenuClicked) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <li
          onClick={() => {
            setShowModal(true);
            onClose();
          }}
        >
          Duplicate Event
        </li>
      </ul>
    </div>
  );
};

export default RightClickMenu;
