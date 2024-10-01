
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics Class for Attendance Data
 */ 
class Calculate {
  constructor() {
    
  }

  /** @private */
  static _CountUnique(iterable) {
    return new Set(iterable).size;
  }

  /**
   * Count Categories
   */
  static CountCategories() {
    try {
      let categories = [];
      [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
        .filter(Boolean)
        .forEach(type => {
          if(Object.values(TYPES).includes(type)) categories.push(type);
        });
      
      let occurrences = Calculate.Distribution(categories);
      return occurrences; 
    } catch(err) {
      console.error(`"CountCategories()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count Per Month
   */
  static CountPerMonth() {
    try {
      let dates = [];
      [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.date)]
        .filter(Boolean)
        .forEach(date => {
          let d = new Date(date);
          let monthYear = `${d.getFullYear()}-${d.getMonth() + 1}`; // Format as "YYYY-M"
          dates.push(monthYear);
        });

      let occurrences = Calculate.Distribution(dates);

      let filledDateCounts = occurrences;
      let years = new Set();

      // Extract unique years from the dates
      occurrences.forEach(([date, count], idx) => {
        const year = date && date.split("-")[0] || new Date().getFullYear();
        years.add(year);
      });

      // Generate all months for each year and add to the dateCounts object if missing
      years.forEach(year => {
        for (let month = 1; month <= 12; month++) {
          const monthYear = `${year}-${month}`;
          const data = [ monthYear, 0 ];
          let dates = filledDateCounts.map(x => x[0]);
          if (!dates.includes(monthYear)) {
            filledDateCounts.push([ monthYear, 0 ]);
          }
        }
      });

      const sorted = filledDateCounts
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))

      console.info(sorted);
      return sorted;
    } catch(err) {
      console.error(`"CountPerMonth()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Counts Per Month
   */
  static PrintCountsPerMonth() {
    try {
      const counts = Calculate.CountPerMonth();
      counts.forEach( ([date, count], idx) => {
        const year = Number(date.split("-")[0]) || new Date().getFullYear();
        const month = Number(date.split("-")[1]) || new Date().getMonth();
        const value = count || 0;
        // console.info(`DATE: ${date}, YEAR: ${year}, MONTH: ${month}, COUNT: ${value}`);

        const row = year - 2018 + 2;
        const col = month + 1;
        // console.info(`Row: ${row}, Year: ${year}, Col: ${col}, Mo: ${month}, Value: ${value}`);
        OTHERSHEETS.CountsPerMonth.getRange(row, col, 1, 1).setValue(value);
      });
      return 0;
    } catch(err) {
      console.error(`"PrintCountsPerMonth()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count User Types
   * @returns {object} types, count
   */
  static CountTypes() {
    try {
      let typeList = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
        .filter(Boolean)
        .filter(x => x != `Test`)
        .filter(x => !x.includes(`Spring`))
        .filter(x => !x.includes(`Summer`))
        .filter(x => !x.includes(`Fall`))
        .filter(x => !x.includes(`Workshop`));
      let occurrences = Calculate.Distribution(typeList);
      return occurrences;
    } catch(err) {
      console.error(`"CountTypes()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Types to Data Page
   */
  static PrintTypes() {
    try {
      const types = Calculate.CountTypes();
      const total = [...types]
        .map(x => x[1])
        .reduce((a,b) => a + b);
      console.info(total);
      const table = [...types]
        .map(([training, count], idx) => [ training, count, `${Number((count / total) * 100).toFixed(2)}%` ])
      const values = [
        [ `Training`, `Count`, `Percentage` ],
        ...table,
      ];
      console.info(values);
      OTHERSHEETS.Metrics.getRange(1, 10, values.length, 3).setValues(values);
      return 0;
    } catch(err) {
      console.error(`"PrintTypes()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count Attendance
   */
  static CountAttentance() {
    try {
      let attendance = {
        Present : 0,
        Online : 0,
        Entered : 0,
        Absent : 0,
      };

      const data = SHEETS.Main.getDataRange().getValues();
      data.forEach(entry => {
        const[ date, equipment, name, present, online, entered, absent, _, random, ] = entry;
        if(present && online && !absent) attendance.Present += 1;
        else if(present && online && entered && !absent) attendance.Present += 1;
        else if(online) attendance.Online += 1;
        else if(entered) attendance.Entered += 1;
        else if(!present && absent) attendance.Absent += 1;
        else if(absent) attendance.Absent += 1;
        else attendance.Absent += 1;
      });

      console.info(JSON.stringify(attendance, null, 2));
      return attendance;
    } catch(err) {
      console.error(`"CountAttentance()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Count Present
   */
  static PrintAttendance() {
    try {
      let attendance = Calculate.CountAttentance();
      let values = [
        [ `Attendance:`, `Count` ],
        ...Object.entries(attendance),
      ];
      OTHERSHEETS.Metrics.getRange(1, 3, values.length, 2).setValues(values);
    } catch(err) {
      console.error(`"PrintAttendance()" failed : ${err}`);
      return 1;
    }
  }


  /**
   * Count All Trained
   */
  static CountAllTrainedUsers() {
    try {
      const entered = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses)];
      const count = entered.length;
      const values = [
        [ `Total Trained`, count, ], 
      ];
      console.info(values);
      OTHERSHEETS.Metrics.getRange(8, 3, 1, 2).setValues(values);
      return count;
    } catch(err) {
      console.error(`"CountAllTrainedUsers()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count All Trained
   */
  static CountRecurringUsers() {
    try {
      let students = [];
      const distribution = [...Calculate.StudentDistribution()];
      const total = distribution.length;
      let recurringUsers = 0;
      distribution.forEach(([_, count], idx) => {
        if(count >= 2) recurringUsers += 1;
      });
      const percentage = `${Number((recurringUsers / total) * 100).toFixed(2)}%`;
      const values = [
        [ `Recurring Users`, recurringUsers, ],
        [ `Percent of Recurring`, percentage, ], 
      ];
      console.info(values);
      OTHERSHEETS.Metrics.getRange(9, 3, values.length, 2).setValues(values);
      return recurringUsers;
    } catch(err) {
      console.error(`"CountRecurringUsers()" failed : ${err}`);
      return 1;
    }
  }


  /**
   * Distribution
   */
  static GetTrainingTypeDistribution() { 
    try {
      let types = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
        .filter(Boolean)
        .filter(x => !x.includes(`Spring`))
        .filter(x => !x.includes(`Summer`))
        .filter(x => !x.includes(`Fall`))
        .filter(x => !x.includes(`Workshop`))
        .filter(x => !x.includes(`Conquering`));

      let items = Calculate.Distribution(types);
      return items;  
    } catch(err) {
      console.error(`"GetTrainingTypeDistribution()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Student Distribution
   */
  static StudentDistribution() {
    try {
      let names = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)]
        .filter(Boolean)
        .filter(x => x != `Semester Total`)
        .map(x => x = x.toLowerCase());
      let items = Calculate.Distribution(names);
      return items;  
    } catch(err) {
      console.error(`"StudentDistribution()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Student Distribution
   */
  static CountUniqueStudents() {
    try {
      const names = Calculate.StudentDistribution()
        .map(([name, count], idx) => name);
      const count = Calculate._CountUnique(names);
      const values = [
        [ `Total Unique Students`, count, ],
      ];
      console.info(values);
      OTHERSHEETS.Metrics.getRange(14, 3, 1, 2).setValues(values);
      return count;  
    } catch(err) {
      console.error(`"CountUniqueStudents()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print All Trained
   */
  static PrintAllTrainees() {
    try {
      const names = Calculate.StudentDistribution();
      OTHERSHEETS.Everyone.getRange(1, 5, 1, 1).setValue(`Total Trained: ${names.length}`);
      OTHERSHEETS.Everyone.getRange(2, 1, names.length, 2).setValues(names);
      return 0;
    } catch(err) {
      console.error(`"PrintAllTrainees()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Top Ten
   */
  static Top25() {
    try {
      const distribution = Calculate.StudentDistribution()
        .slice(0, 25)
        .map(([name, count], idx) => [ idx + 1, TitleCase(name), count,] );
      const values = [
        [ `Place`, `Top 25 Returning Trainees`, `# of Trainings Attended`, ],
        ...distribution,
      ];
      OTHERSHEETS.Metrics.getRange(1, 6, values.length, 3).setValues(values);
      return 0;
    } catch(err) {
      console.error(`"Top25()" failed: ${err}`);
      return 1;
    }

  }

  

  /**
   * List All Trainees
   * @private
   * @NOTIMPLEMENTED
   */
  static _ListAllTrainees() {
    try {
      let names = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)]
        .filter(Boolean)
        .filter(x => x != `Semester Total`)
        .map(x => x = x.toLowerCase());
      let unique = [...new Set(names)]
        .map(x => x = TitleCase(x));
      console.info(unique);
      return unique;
    } catch(err) {
      console.error(`"_ListAllTrainees()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * --------------------------------------------------------------------------------------------------------------
   */

  /**
   * Sum Numbers
   * @param {Array} numbers
   * @returns {number} sum
   */
  static Sum(numbers = []) {
    if(numbers.length > 1) {
      return Number(numbers.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
    } else if(numbers.length == 1) return numbers[0];
    else return 0;
  }

  /**
   * Calculate Distribution
   * @param {Array} input array to calculate Distribution
   * @returns {[string, number]} sorted list of users
   */
  static Distribution(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`List is empty: ${numbers.length}`);
      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;
      const occurrences = values.reduce( (acc, curr) => {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});

      let items = Object.keys(occurrences).map((key) => {
        if (key != "" || key != undefined || key != null || key != " ") {
          return [key, occurrences[key]];
        }
      });

      items.sort((first, second) => second[1] - first[1]);
      console.warn(`<<< DISTRIBUTION >>>`);
      console.info(items);
      return items;  
    } catch(err) {
      console.error(`"Distribution()" failed: ${err}`);
      return 1;
    }
  }


  /**
   * Calculate Standard Deviation
   * @param {Array} array of keys and values: "[[key, value],[]...]"
   * @returns {number} Standard Deviation
   */
  static StandardDeviation(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`List is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const mean = Calculate.GeometricMean(values);
      console.warn(`Mean = ${mean}`);

      const s = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);
      const standardDeviation = Math.abs(Number(s - mean).toFixed(3)) || 0;
      console.warn(`Standard Deviation: +/-${standardDeviation}`);
      return standardDeviation;
    } catch(err) {
      console.error(`"StandardDeviation()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Z Scores for Each Distribution Entry
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {Array} ZScored Entries [[key, value, score], [key, value, score], ... ]
   */
  static ZScore(distribution = [], stdDev = 0) {
    try {
      if(distribution.length < 2) throw new Error(`Distribution Empty: ${distribution.length}`);
      const mean = Calculate.GeometricMean(distribution);

      // Compute the Z-Score for each entry
      const zScore = distribution.map(([key, value]) => {
        const zScore = (value - mean) / stdDev;
        return [key, value, zScore];
      });
      return zScore;
    } catch(err) {
      console.error(`"ZScore()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Kurtosis
   * Measures the "tailedness" of the data distribution.
   * High kurtosis means more outliers; Low kurtosis means fewer outliers.
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {number} Kurtosis Number
   */
  static Kurtosis(distribution = [], stdDev = 0) {
    try {
      if(distribution.length < 2) throw new Error(`Distribution Empty: ${distribution.length}`);

      const mean = Calculate.GeometricMean(distribution);

      // Calculate the fourth moment
      const fourthMoment = distribution.reduce((acc, curr) => {
        return acc + Math.pow(curr[1] - mean, 4);
      }, 0) / distribution.length;

      // Calculate variance (standard deviation squared)
      const variance = Math.pow(stdDev, 2);

      // Compute kurtosis
      const kurtosis = fourthMoment / Math.pow(variance, 2);

      // Excess kurtosis (subtract 3 to make kurtosis of a normal distribution zero)
      const excessKurtosis = kurtosis - 3;

      return excessKurtosis;
    } catch(err) {
      console.error(`"Kurtosis()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Skewness
   * Measures the asymmetry of the data distribution.
   * Positive skew means a long right tail; Negative skew means a long left tail.
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {number} Skewness Number
   */
  static Skewness(distribution = [], stdDev = 0) {
    try {
      // Calculate the mean of the distribution
      const mean = Calculate.GeometricMean(distribution);

      // Calculate the third moment
      const thirdMoment = distribution.reduce((acc, curr) => {
        return acc + Math.pow(curr[1] - mean, 3);
      }, 0) / distribution.length;

      // Calculate the skewness
      const skewness = thirdMoment / Math.pow(stdDev, 3);

      return skewness;
    } catch(err) {
      console.error(`"Skewness()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Detect Outliers
   * Outlier detection typically involves identifying data points that are far from the mean of a distribution, 
   * often using a threshold based on the standard deviation. 
   * A common method for detecting outliers is to flag values that are more than a certain number of standard deviations away from the mean. 
   * For example, values beyond 2 or 3 standard deviations can be considered outliers.
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @param {number} threshold
   * @returns {Array} Outliers
   */
  static DetectOutliers(distribution = [], stdDev = 0, threshold = 3) {
    try {
      // Calculate the mean of the distribution
      const mean = Calculate.GeometricMean(distribution);

      // Find outliers
      const outliers = distribution.filter(x => {
        const diff = Math.abs(x[1] - mean);
        return diff > threshold * stdDev;
      });

      // Return the outliers as an array of [key, value] pairs
      return outliers;
    } catch(err) {
      console.error(`"DetectOutliers()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Quartiles
   * The list is divided into two halves for computing the lower (Q1) and upper (Q3) quartiles.
   * The median of the whole distribution is computed as Q2.
   * @param {Array} distribution [[key, value], [key, value]...]
   * @returns {Object} quartiles { q1 : value, q2 : value, q3 : value, }
   */
  static Quartiles(distribution = []) {
    try {
      const sorted = distribution
        .map(([key, value]) => value)
        .slice()
        .sort((a, b) => a - b);
      const len = sorted.length;

      // Split the sorted data into two halves
      const lowerHalf = sorted.slice(0, Math.floor(len * 0.5));
      const upperHalf = sorted.slice(Math.ceil(len * 0.5));

      // Calculate Q1, Q2 (median), and Q3
      const q1 = Calculate.Median(lowerHalf);
      const q2 = Calculate.Median(sorted);
      const q3 = Calculate.Median(upperHalf);

      return { 
        Q1 : q1, 
        Q2 : q2, 
        Q3 : q3, 
      }
    } catch(err) {
      console.error(`"Quartiles()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Arithmetic Mean
   * @returns {number} arithmetic mean
   */
  static ArithmeticMean(distribution = []) {
    try {
      const n = distribution.length;
      if(n == 0) throw new Error(`Distribution is empty: ${n}`);

      let values = [];
      if (Array.isArray(distribution[0])) values = distribution.map(item => item[1]);
      else values = distribution;

      const mean = values.reduce((a, b) => a + b) / n;
      console.warn(`ARITHMETIC MEAN: ${mean}`);
      return mean.toFixed(3);
    } catch(err) {
      console.error(`"ArithmeticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Geometric Mean
   * @param {Array} numbers
   * @returns {number} Geometric Mean
   */
  static GeometricMean(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Distribution is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => Number(item[1]));
      else values = numbers.map(x => Number(x));

      const product = values.reduce((product, num) => product * num, 1);
      const geometricMean = Math.pow(product, 1 / values.length);
      console.warn(`GEOMETRIC MEAN: ${geometricMean}`);
      return geometricMean;
    } catch(err) {
      console.error(`"GeometricMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Harmonic Mean
   * @param {Array} numbers
   * @returns {number} Harmonic Mean
   */
  static HarmonicMean(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Distribution is empty: ${numbers.length}`);
      
      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const harmonicMean = values.length / values.reduce((a, b) => a + 1 / b, 0);
      console.warn(`HERMONIC MEAN: ${harmonicMean}`);
      return harmonicMean;
    } catch(err) {
      console.error(`"HarmonicMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Quadratic Mean
   * @param {Array} numbers
   * @returns {number} Quadratic Mean
   */
  static QuadraticMean(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Distribution is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const quadraticMean = Math.sqrt(values.reduce((a, b) => a + b * b, 0) / values.length);
      console.warn(`QUADRATIC MEAN: ${quadraticMean}`);
      return quadraticMean;
    } catch(err) {
      console.error(`"QuadraticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Median Mean
   * @param {Array} numbers
   * @returns {number} Median
   */
  static Median(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Input less than 2: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const sortedNumbers = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sortedNumbers.length / 2);
      const median = sortedNumbers.length % 2 === 0 ?
          (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2 :
          sortedNumbers[middle];

      console.warn(`MEDIAN: ${median}`);
      return median;
    } catch(err) {
      console.error(`"Median()" failed : ${err}`);
      return 1;
    }
  }
}

/**
 * Metrics
 * @TRIGGERED - Once a day
 */
const Metrics = () => {
  Calculate.PrintTypes();
  Calculate.PrintAttendance();
  Calculate.CountAllTrainedUsers();
  Calculate.GetTrainingTypeDistribution();
  Calculate.Top25();
  Calculate.PrintAllTrainees();
  Calculate.PrintCountsPerMonth();
  Calculate.CountRecurringUsers();
  Calculate.CountUniqueStudents();
}

const _testMetrics = () => {
  Calculate.CountUniqueStudents();
}









