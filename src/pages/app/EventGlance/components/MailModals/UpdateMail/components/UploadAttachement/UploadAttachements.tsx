import { isUserEditor } from '../../../../../../../../common/commonFunctions';
import type { previewType } from '../../types';
import PreviewBox from '../PreviewBox/PreviewBox';
import styles from './UploadAttachements.module.css';

const UploadAttachement = ({
  previews,
  handleFileChange,
  handleDeleteAttachment,
  allowedFileTypes,
}: {
  previews: previewType[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAttachment: (index: number) => void;
  allowedFileTypes?: string[];
}) => {
  return (
    <>
      <div className={styles.attachmentsContainer}>
        {previews?.length > 0 && (
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
          disabled={!isUserEditor()}
          value={''}
          onChange={handleFileChange}
          className={styles.fileInput}
          accept={allowedFileTypes ? allowedFileTypes.join(',') : '*'}
        />
      </div>
    </>
  );
};

export default UploadAttachement;
