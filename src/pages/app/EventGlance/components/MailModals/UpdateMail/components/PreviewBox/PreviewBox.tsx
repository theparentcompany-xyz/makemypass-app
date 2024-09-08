import { MdClose } from 'react-icons/md';

import type { previewType } from '../../types';
import styles from './PreviewBox.module.css';

const PreviewBox = ({
  index,
  preview,
  handleDeleteAttachment,
}: {
  index: number;
  preview: previewType;
  handleDeleteAttachment?: (index: number) => void;
}) => {
  return (
    <div key={index} className={styles.previewBox}>
      {handleDeleteAttachment && (
        <div
          className={styles.closeButton}
          onClick={() => {
            handleDeleteAttachment(index);
          }}
        >
          <MdClose size={20} />
        </div>
      )}
      {preview.previewExtension.startsWith('image/') && (
        <img
          src={preview.previewURL}
          alt='Preview'
          style={{ width: 100, height: 100 }}
          onClick={() => window.open(preview.previewURL, '_blank')}
        />
      )}
      {preview.previewExtension.startsWith('video/') && (
        <video
          src={preview.previewURL}
          width='100'
          height='100'
          controls
          onClick={() => window.open(preview.previewURL, '_blank')}
        />
      )}
      {preview.previewExtension.startsWith('audio/') && (
        <audio
          src={preview.previewURL}
          controls
          onClick={() => window.open(preview.previewURL, '_blank')}
        />
      )}
      {preview.previewExtension === 'application/pdf' && (
        <embed
          onClick={() => window.open(preview.previewURL, '_blank')}
          src={preview.previewURL}
          width='100'
          height='100'
          type='application/pdf'
        />
      )}
      {<div className={styles.nameContainer}>{preview.previewName}</div>}
    </div>
  );
};

export default PreviewBox;
