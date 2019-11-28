export const getMonday = date => {
  let d = new Date(date);
  d.getDay() === 0
    ? d.setDate(d.getDate() - 6)
    : d.setDate(d.getDate() - (d.getDay() - 1));
  return d;
};

export const getSunday = date => {
  let d = new Date(date);
  if (d.getDay() !== 0) d.setDate(d.getDate() + (7 - d.getDay()));
  return d;
};

export const getDateRange = function([...operations]) {
  // Get all dates
  let dates = [];
  operations.forEach(operation => {
    dates = [...dates, ...operation.dates.map(d => d.date)];
    // include period dates
    let periodDates = operation.periods.flatMap(period =>
      period.days.map(d => stringToDate(d.day))
    );
    dates = [...dates, ...periodDates];
  });
  // get unique values
  dates = [...new Set(dates)];

  // convert dateStrings to dates
  dates = dates.map(d => stringToDate(d));

  // get min and max date in periods
  let min = new Date(dates[0]);
  let max = new Date(dates[0]);
  for (let d of dates) {
    if (d.getTime() < min.getTime()) {
      min = new Date(d);
    }
    if (d.getTime() > max.getTime()) {
      max = new Date(d);
    }
  }

  min.setDate(min.getDate() - 3);
  max.setDate(max.getDate() + 3);

  // create dates range
  const range = createRange(min, max);
  return range;
};

export const createRange = function(min, max) {
  let range = [];
  let start = new Date(min);
  while (start.getTime() <= max.getTime()) {
    range.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return range;
};

export const stringToDate = function(dateString) {
  if (typeof dateString !== "string") {
    if (dateString instanceof Date) return dateString;
  }

  var d = new Date(dateString);
  if (isValidDate(d)) return d;

  const [day, month, year] = dateString.split(".");
  const date = new Date("20" + year, +month - 1, day);
  return date;

  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
};

export const dateToString = function(dateObj, format) {
  function getString(dateObj) {
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();

    switch (format) {
      case "dd.mm.yyyy":
        date = `0${date}`.slice(-2);
        month = `0${month}`.slice(-2);
        return `${date}.${month}.${year}`;

      case "dd.mm.yy":
        date = `0${date}`.slice(-2);
        month = `0${month}`.slice(-2);
        year = `0${year}`.slice(-2);
        return `${date}.${month}.${year}`;

      case "yyyy-mm-dd":
        date = `0${date}`.slice(-2);
        month = `0${month}`.slice(-2);
        return `${year}-${month}-${date}`;

      case "ISO":
        // compensate timezone
        let tempDate = new Date(dateObj);
        tempDate.setHours(
          tempDate.getHours() - tempDate.getTimezoneOffset() / 60
        );

        return tempDate.toISOString().slice(0, -5);

      default:
        date = `0${date}`.slice(-2);
        month = `0${month}`.slice(-2);
        return `${date}.${month}`;
    }
  }

  if (dateObj instanceof Date) {
    // var [year, month, date] = getYearMonthDay(dateObj);
    return getString(dateObj);
  } else if (Array.isArray(dateObj)) {
    let start = new Date(dateObj[0]);
    let end = new Date(dateObj[dateObj.length - 1]);
    let weekString = `${getString(start)}-${getString(end)}`;
    return weekString;
  } else {
    throw new Error("God help us");
  }
};

export const getLeftOffset = function(startDate, datesRange, tf) {
  let index = null;
  if (tf.type === "day") {
    datesRange.forEach((item, i) => {
      if (item.getTime() === startDate.getTime()) index = i;
    });
    return index;
  } else {
    datesRange.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        const ft = day.getTime();
        const st = startDate.getTime();
        if (ft === st) {
          index = weekIndex + dayIndex / 7;
        }
      });
    });
    return index;
  }
};
