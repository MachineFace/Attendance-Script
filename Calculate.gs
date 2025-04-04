
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
      [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
        .filter(Boolean)
        .forEach(type => {
          if(Object.values(TYPES).includes(type)) categories.push(type);
        });
      
      let occurrences = StatisticsService.Distribution(categories);
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
      [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.date)]
        .filter(Boolean)
        .forEach(date => {
          let d = new Date(date);
          let monthYear = `${d.getFullYear()}-${d.getMonth() + 1}`; // Format as "YYYY-M"
          dates.push(monthYear);
        });

      let occurrences = StatisticsService.Distribution(dates);

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
      let typeList = [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
        .filter(Boolean)
        .filter(x => x != `Test`)
        .filter(x => !x.includes(`Spring`))
        .filter(x => !x.includes(`Summer`))
        .filter(x => !x.includes(`Fall`))
        .filter(x => !x.includes(`Workshop`));
      let occurrences = StatisticsService.Distribution(typeList);
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
      }

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
      const entered = [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses)];
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
      let types = [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)]
        .filter(Boolean)
        .filter(x => !x.includes(`Spring`))
        .filter(x => !x.includes(`Summer`))
        .filter(x => !x.includes(`Fall`))
        .filter(x => !x.includes(`Workshop`))
        .filter(x => !x.includes(`Conquering`));

      let items = StatisticsService.Distribution(types);
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
      let names = [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)]
        .filter(Boolean)
        .filter(x => x != `Semester Total`)
        .map(x => x = x.toLowerCase());
      let items = StatisticsService.Distribution(names);
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
      let names = [...SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)]
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
  Calculate.PrintTypes();
}









