export const formatDateWithHour = (date: string | Date | number) => {
  const dateFormatted = formatDate(date);
  const hourFormatted = formatHour(date);
  return `${dateFormatted} ${hourFormatted}`;
};

export const formatDate = (date?: string | number | Date) => {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  let day = '' + d.getDate();
  let month = '' + (d.getMonth() + 1);
  if (day.length < 2) {
    day = '0' + day;
  }

  if (month.length < 2) {
    month = '0' + month;
  }

  return [year, month, day].join('/');
};

export const formatHour = (date: string | Date | number) => {
  const d = new Date(date);
  let hour = '' + d.getHours();
  let minutes = '' + d.getMinutes();

  if (hour.length < 2) {
    hour = '0' + hour;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }

  return [hour, minutes].join(':');
};
