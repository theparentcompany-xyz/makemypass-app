const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  };

  const formattedDate: string = date.toLocaleString('en-US', options);
  const [datePart, timePart]: string[] = formattedDate.split(', ');

  const [day, month, year]: string[] = datePart.split(' ');
  const [hour, minute]: string[] = timePart.split(':');

  return `${day} ${month}, ${year}, ${hour}:${minute}`;
};

const inputDate: string = '2024-02-18T18:46:56+05:30';
const formattedDate: string = formatDate(inputDate);
console.log(formattedDate);
