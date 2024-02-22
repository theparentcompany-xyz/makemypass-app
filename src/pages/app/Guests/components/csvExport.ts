import { TableType } from '../../../../components/Table/types';

const downloadCSV = (csvContent: BlobPart, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const convertToCSV = (data: any[]) => {
  const headers = Object.keys(data[0]);
  const csvContent =
    headers.join(',') +
    '\n' +
    data
      .map((item) => {
        return headers.map((header) => item[header]).join(',');
      })
      .join('\n');
  return csvContent;
};

export const handleClick = (data: TableType[], fileName: string) => {
  const csvContent = convertToCSV(data);
  downloadCSV(csvContent, fileName);
};
