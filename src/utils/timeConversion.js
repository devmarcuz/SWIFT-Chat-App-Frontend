export function timeFormat(time) {
  if (time) {
    let date = time.split("T")[1].split(".")[0].split(":");
    let num = Number(date[0]) + 1;
    let index = date.indexOf(date[0]);
    if (index !== -1) {
      date[index] = String(num);
      date = date.join(":");
    }
    return tCovert(date);
  }
}

function tCovert(time) {
  const [hourString, minute] = time.split(":");
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
}
