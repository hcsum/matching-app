function getFormattedDateTimeString(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  // define an array of Chinese month names
  const chineseMonths = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  // get the day, month, year, hours, minutes, and seconds
  const day = date.getDate();
  const month = chineseMonths[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // format the date and time string
  return `${year}年${month}${day}日 ${hours}:${minutes}:${seconds}`;
}

export { getFormattedDateTimeString };
