function toChineseDateTime(isoString: string): string {
  const date = new Date(isoString);

  let timeString = date.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  const hour = date.getHours();
  if (hour === 0) {
    timeString = timeString.replace("上午", "凌晨");
  } else if (hour === 12) {
    timeString = timeString.replace("下午", "中午");
  }

  const dateString = date.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return `${dateString} ${timeString}`;
}

export { toChineseDateTime };
