
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics Class for Attendance Data
 */ 
class Calculate {
  constructor() {
    
  }

  /** @private */
  _CountUnique(iterable) {
    return new Set(iterable).size;
  }

  /** @private */
  _CountCategorical(list) {
    let count = {};
    list.forEach( key => count[key] = ++count[key] || 1);
    return count;
  }

  /**
   * Count Categories
   */
  static CountCategories() {
    let categories = [];
    GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)
      .filter(Boolean)
      .forEach( type => {
        if(Object.values(TYPES).includes(type)) categories.push(type);
      });
    
    let occurrences = categories.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    console.info(occurrences);
    return occurrences; 
  }

  static PrintCountsPerMonth() {
    const counts = this.CountPerMonth();
    console.info(counts)
    Object.entries(counts).forEach(entry => {
      const year = Number(entry[0].split("-")[0]);
      const month = Number(entry[0].split("-")[1]);
      const value = Number(entry[1]);

      const row = year - 2018 + 2;
      const col = month + 1;
      // console.info(`Row: ${row}, Year: ${year},Col: ${col}, Mo: ${month}, Value: ${value}`);
      OTHERSHEETS.CountsPerMonth.getRange(row, col, 1, 1).setValue(value);
    })
  }

  static CountPerMonth () {
    let dates = [];
    GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.date)
      .filter(Boolean)
      .forEach( date => {
        if(date instanceof(Date)) {
          let monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format as "YYYY-M"
          dates.push(monthYear);
        }
      });
    let occurrences = dates.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    const modified = this._fillMissingMonthsWithZero(occurrences);
    // console.info(modified);
    return modified;
  }

  /** @private */
  static _fillMissingMonthsWithZero(dateCounts) {
    const filledDateCounts = { ...dateCounts };
    const years = new Set();

    // Extract unique years from the dates
    Object.keys(dateCounts).forEach(date => {
      const [year] = date.split("-");
      years.add(year);
    });

    // Generate all months for each year and add to the dateCounts object if missing
    years.forEach(year => {
      for (let month = 1; month <= 12; month++) {
        const monthYear = `${year}-${month}`;
        if (!filledDateCounts[monthYear]) filledDateCounts[monthYear] = 0;
      }
    });

    // Sort the object keys
    const sortedKeys = Object.keys(filledDateCounts).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });

    // Create a new sorted object
    const sortedDateCounts = {};
    sortedKeys.forEach(key => {
      sortedDateCounts[key] = filledDateCounts[key];
    });

    return sortedDateCounts;
  }

  /**
   * Count User Types
   * @returns {object} types, count
   */
  static CountTypes() {
    try {
      let typeList = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)
        .filter(Boolean)
        .filter(x => x != `Test`)
        .filter(x => !x.includes(`Spring`))
        .filter(x => !x.includes(`Summer`))
        .filter(x => !x.includes(`Fall`))
        .filter(x => !x.includes(`Workshop`));

      let occurrences = typeList.reduce( (acc, curr) => {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});
      console.info(occurrences);
      return occurrences;
    } catch(err) {
      console.error(`"CountTypes()" failed : ${err}`);
    }
  }

  /**
   * Print Types to Data Page
   */
  static PrintTypes() {
    const types = Calculate.CountTypes();
    const values = [
      [ `Haas Mini Mill Trainings Completed:`, types[`Haas Mini Mill`] ],
      [ `Ultimaker Trainings Completed:`, types['Type A / Ultimakers'] ],
      [ `Tormach Trainings Completed:`, types[`Tormach`] ],
      [ `Fablight Trainings Completed:`, types[`FabLight`] ],
      [ `Laser Trainings Completed:`, types[`Laser Cutter`] ],
    ];
    OTHERSHEETS.Metrics.getRange(3, 3, values.length, 2).setValues(values);
  }



  /**
   * Count Present
   */
  static CountPresent() {
    let total = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.present)
      .filter(Boolean)
      .length;
    console.info(`Total Trained : ${total}`);
    OTHERSHEETS.Metrics.getRange(8, 3, 1, 2).setValues([[ `Total Trained:`, total ]]);
    return total;
  }

  /**
   * Count Absent
   */
  static CountAbsent() {
    let absent = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.absent)
      .filter(Boolean)
      .length;  
    console.info(`Total Absent : ${absent}`);
    OTHERSHEETS.Metrics.getRange(9, 3).setValue(`Total Absent:`);
    OTHERSHEETS.Metrics.getRange(9, 4).setValue(absent);
    return absent;
  }

  /**
   * Count All Trained
   */
  static CountAllTrainedUsers() {
    let students = [];
    const names = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name);
    const entered = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses);
    names.forEach((student, index) => {
      if(entered[index] == true) students.push(student);
    });
    let count = new Set(students).size;
    console.info(`Total Students Trained : ${count}`);
    return count;
  }

  /**
   * Distribution
   */
  static GetDistribution() { 
    let types = []
      .concat(...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment))
      .filter(Boolean)
      .filter(x => !x.includes(`Spring`))
      .filter(x => !x.includes(`Summer`))
      .filter(x => !x.includes(`Fall`))
      .filter(x => !x.includes(`Workshop`))
      .filter(x => !x.includes(`Conquering`));

    let occurrences = types.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    let items = Object.keys(occurrences)
      .map( key => [key, occurrences[key]])
      .sort((first, second) => second[1] - first[1]);

    console.info(`Distribution ----> ${items}`);
    return items;  
  }

  /**
   * Student Distribution
   */
  static StudentDistribution() {
    let names = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)]
      .filter(Boolean)
      .filter(x => x != `Semester Total`)
      .map(x => x = x.toLowerCase());

    let occurrences = names.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    let items = Object.keys(occurrences).map((key) => [TitleCase(key), occurrences[key]]);
    items.sort((first, second) => {
      return second[1] - first[1];
    });
    // console.info(`Distribution ----> ${items}`);
    return items;  
  }

  /**
   * Print Top Ten
   */
  static PrintTopTen() {
    const distribution = Calculate.StudentDistribution()
      .slice(0, 11)
    console.info(distribution);

    OTHERSHEETS.Metrics.getRange(19, 3)
      .setValue(`Top Ten Returning Trainees`)
      .setTextStyle(SpreadsheetApp.newTextStyle().setBold(true).build())
      .setHorizontalAlignment(`center`);
    distribution.forEach((pair, index) => {
      console.info(`${pair[0]} -----> ${pair[1]}`);
      OTHERSHEETS.Metrics.getRange(20 + index, 2).setValue(index + 1); 
      OTHERSHEETS.Metrics.getRange(20 + index, 3).setValue(pair[0]); 
      OTHERSHEETS.Metrics.getRange(20 + index, 4).setValue(pair[1]); 
    });
    OTHERSHEETS.Metrics.getRange(19, 2, 12, 3).setBackground(COLORS.grey);
  }

  /**
   * Print All Trained
   */
  static PrintAllTrainees() {
    let names = Calculate.StudentDistribution();
    OTHERSHEETS.Everyone.getRange(1, 5).setValue(`Total Trained: ${names.length}`);
    OTHERSHEETS.Everyone.getRange(2, 1, names.length, 2).setValues(names);
  }

  /**
   * List All Trainees
   * @private
   * @NOTIMPLEMENTED
   */
  static _ListAllTrainees() {
    let names = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)]
      .filter(Boolean)
      .filter(x => x != `Semester Total`)
      .map(x => x = x.toLowerCase());
    let unique = [...new Set(names)]
      .map(x => x = TitleCase(x));
    console.info(unique);
    return unique;
  }

  /**
   * Sum Categories
   * @DEFUNCT
   */
  static SumCategories() {
    let count = {};
    let types = [...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
      .filter(Boolean)
      .filter(x => !x.includes(`Test`))
      .filter(x => !x.includes(`Spring`))
      .filter(x => !x.includes(`Summer`))
      .filter(x => !x.includes(`Fall`))
      .filter(x => !x.includes(`Workshop`))
      .filter(x => !x.includes(`Conquering`));

    types.forEach(key => count[key] = ++count[key] || 1);
    for(const [key, value] of Object.entries(count)) {
      console.warn(`${key} : ${value}`);
    }
    return count;
  }
}

/**
 * Metrics
 * @TRIGGERED - Once a day
 */
const Metrics = () => {
  Calculate.CountTypes();
  Calculate.CountPresent();
  Calculate.CountAbsent();
  Calculate.CountAllTrainedUsers();
  Calculate.GetDistribution();
  Calculate.PrintTopTen();
  Calculate.PrintAllTrainees();
  Calculate.PrintCountsPerMonth();
}

const _testMetrics = () => {
  Calculate.CountCategories();
}









