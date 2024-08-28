import { previewType } from '../../types';
import PreviewBox from '../PreviewBox/PreviewBox';
import styles from './UploadAttachements.module.css';

const UploadAttachement = ({
  previews,
  handleFileChange,
  handleDeleteAttachment,
}: {
  previews: previewType[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAttachment: (index: number) => void;
}) => {
  return (
    <>
      <div className={styles.attachmentsContainer}>
        {previews.length > 0 && (
          <div className={styles.previewContainer}>
            {previews?.map((preview, index) => (
              <PreviewBox
                key={index}
                index={index}
                preview={preview}
                handleDeleteAttachment={handleDeleteAttachment}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.uploadContainer}>
        <input
          type='file'
          multiple
          value={''}
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </div>
    </>
  );
};

export default UploadAttachement;
