const CreateWeeksTable = () => {
  const startYear = 2018;
  const endYear = 2030;
  const totalWeeks = 52;

  // Create the header row with week numbers
  const header = ["Year"];
  for (let week = 1; week <= totalWeeks; week++) {
    header.push(`Week ${week}`);
  }

  // Create the table rows for each year
  const table = [header];
  for (let year = startYear; year <= endYear; year++) {
    const row = [year];
    for (let week = 1; week <= totalWeeks; week++) {
      row.push("");
    }
    table.push(row);
  }
  console.info(table);
  return table;
}

const WriteWeeksTableToSheet = () => {
  const table = CreateWeeksTable();

  // Write the table to the active sheet
  const sheet = OTHERSHEETS.CountsPerWeek;
  sheet.clear(); // Clear existing content
  sheet.getRange(1, 1, table.length, table[0].length).setValues(table);
}







const PrintCountsPerWeek = () => {
  let counts = CountPerWeek();
  counts.forEach(([date, value], idx) => {
    const [year, week] = date.split('-W');
    let col = (idx % 52) + 2;
    let row = (year - 2018) + 2;
    console.info(`Row: ${row}, Year: ${year}, Week: ${week}, Value: ${value}, col: ${col}`);
    OTHERSHEETS.CountsPerWeek.getRange(row, col, 1, 1).setValue(value);
  })
}

const CountPerWeek = () => {
  let dates = [];
  GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.date)
    .filter(Boolean)
    .forEach( date => {
      if(date instanceof(Date)) {
        const year = date.getFullYear();
        const week = _getWeekNumber(date)
        const formatted = `${year}-W${week}`; // Format as "YYYY-Ww"
        dates.push(formatted);
      }
    });
  let occurrences = dates.reduce( (acc, curr) => {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});
  // console.info(occurrences);
  const modified = _fillMissingWeeks(occurrences);
  // console.info(modified);
  return modified;
}

/**
 * Get Week Number
 * @param {Date} date
 * @returns {number} week number
 * @private
 */
const _getWeekNumber = (d) => {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNumber;
}

/** @private */
const _fillMissingWeeks = (dates) => {
  // Create a map to store weeks for each year
  const weeksMap = {};

  // Parse input dates and fill the map
  Object.entries(dates).forEach(([date, value], idx) => {
    // console.info(`Date: ${date}, Value: ${value}, Idx: ${idx}`);
    const [year, week] = date.split('-W');
    if (!weeksMap[year]) {
      weeksMap[year] = new Set();
    }
    weeksMap[year][parseInt(week)] = value;
  });

  // Find missing weeks and fill them with 0
  const filledDatesWithValues = [];
  Object.keys(weeksMap).forEach(year => {
    const totalWeeks = _getWeeksInYear(year);
    for (let week = 1; week <= totalWeeks; week++) {
      const formattedWeek = `W${String(week).padStart(2, '0')}`;
      if (!weeksMap[year][week]) {
        filledDatesWithValues.push([`${year}-${formattedWeek}`, 0]);
      } else {
        filledDatesWithValues.push([`${year}-${formattedWeek}`, weeksMap[year][week]]);
      }
    }
  });

  // Sort the filled dates
  filledDatesWithValues.sort((a, b) => {
    const [yearA, weekA] = a[0].split('-W').map(Number);
    const [yearB, weekB] = b[0].split('-W').map(Number);
    return yearA === yearB ? weekA - weekB : yearA - yearB;
  });

  return filledDatesWithValues;
}

/** @private */
const _getWeeksInYear = (year) => {
  // Create a date object for December 31st of the given year
  const lastDayOfYear = new Date(Date.UTC(year, 11, 31));
  // Get the week number for December 31st
  const week = _getWeekNumber(lastDayOfYear);
  return week === 1 ? 52 : week;
}


