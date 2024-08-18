import { listMailType } from '../../../../../apis/types';

export type PropTypes = {
  selectedMail: listMailType | undefined;
  setSelectedMail: React.Dispatch<React.SetStateAction<listMailType | undefined>>;
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
  setMails: React.Dispatch<React.SetStateAction<listMailType[]>>;
};

export type AttachmentType = {
  type: 'newFile' | 'existingFile';
  file: File;
  fileURL?: string;
};

export type previewType = {
  previewURL: string;
  previewExtension: string;
  previewName: string;
};
