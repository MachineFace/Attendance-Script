
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics Class for Attendance Data
 */ 
class CalculateMetrics
{
  constructor() {
    this.data = SHEETS.Main.getDataRange().getValues();
    this.trainingType = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)
    this.students = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name)
    this.presentColumn = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.present)
    this.onlineColumn = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.online)
    this.enteredColumn = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses)
    this.absentColumn = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.absent)
    this.writer = new WriteLogger();
  }

  _CountUnique(iterable) {
    return new Set(iterable).size;
  }

  _CountCategorical (list) {
    let count = {};
    list.forEach( key => count[key] = ++count[key] || 1);
    return count;
  }

  CountCategories () {
    let categories = [];
    GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment)
      .filter(Boolean)
      .forEach( type => {
        if(Object.values(TYPES).includes(type)) categories.push(type);
      });
    

    let occurrences = categories.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    return occurrences; 
  }

  CountEachCategoryTrained () {
    let haasCount = 0;
    let tormachCount = 0;
    let fablightCount = 0;
    let ultimakerCount = 0;
    let laserCount = 0;
    this.trainingType.forEach( (type,index) => {
      if(type == TYPES.haas && this.presentColumn[index] == true) haasCount++;
      if(type == TYPES.tormach && this.presentColumn[index] == true) tormachCount++;
      if(type == TYPES.fablight && this.presentColumn[index] == true) fablightCount++;
      if(type == TYPES.ultimakers && this.presentColumn[index] == true) ultimakerCount++;
      if(type == TYPES.laser && this.presentColumn[index] == true) laserCount++;
    });
    console.info(`Haas Count : ${haasCount}`);
    console.info(`Tormach Count : ${tormachCount}`);
    console.info(`FabLight Count : ${fablightCount}`);
    console.info(`Type A / Ultimaker Count : ${ultimakerCount}`);
    console.info(`Laser Count : ${laserCount}`);

    // Write to Sheet
    OTHERSHEETS.Metrics.getRange(3, 3).setValue(`Haas Mini Mill Trainings Completed:`);
    OTHERSHEETS.Metrics.getRange(3, 4).setValue(haasCount);

    OTHERSHEETS.Metrics.getRange(4, 3).setValue(`Ultimaker Trainings Completed:`);
    OTHERSHEETS.Metrics.getRange(4, 4).setValue(ultimakerCount);

    OTHERSHEETS.Metrics.getRange(5, 3).setValue(`Tormach Trainings Completed:`);
    OTHERSHEETS.Metrics.getRange(5, 4).setValue(tormachCount);

    OTHERSHEETS.Metrics.getRange(6, 3).setValue(`Fablight Trainings Completed:`);
    OTHERSHEETS.Metrics.getRange(6, 4).setValue(fablightCount);

    OTHERSHEETS.Metrics.getRange(7, 3).setValue(`Laser Trainings Completed:`);
    OTHERSHEETS.Metrics.getRange(7, 4).setValue(laserCount);

    return {
      haas : haasCount, 
      tormach : tormachCount,
      fablight : fablightCount,
      ultimakers : ultimakerCount,
      lasers : laserCount,
    }
  }

  CountPresent () {
    // Count totals
    let total = 0;
    let cleaned = this.enteredColumn.filter(Boolean);
    cleaned.forEach(entry => {
      if(entry == true) total++
    });
    console.info(`Total Trained : ${total}`);
    OTHERSHEETS.Metrics.getRange(8, 3).setValue(`Total Trained:`);
    OTHERSHEETS.Metrics.getRange(8, 4).setValue(total);
    return total;
  }

  CountAbsent () {
    // Count totals
    let absent = 0;
    this.absentColumn.forEach(absentee => {
      if(absentee == true) absent++;
    });  
    this.writer.Info(`Total Absent : ${absent}`);
    OTHERSHEETS.Metrics.getRange(9, 3).setValue(`Total Absent:`);
    OTHERSHEETS.Metrics.getRange(9, 4).setValue(absent);
    return absent;
  }

  CountAllTrainedUsers () {
    let students = [];
    const cleaned = this.students.filter(Boolean);
    cleaned.forEach((student, index) => {
      if(this.enteredColumn[index] == true) students.push(student);
    })
    let unique = this._CountUnique(students);
    console.info(`Total Students Trained : ${unique}`);
    return unique;
  }

  CalculateDistribution () {
    
    let types = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.equipment);
    types = [].concat(...types);
    let culledTypes = types.filter(Boolean);
    
    let occurrences = culledTypes.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    let items = Object.keys(occurrences).map((key) => {
      if (key != "" || key != undefined || key != null) {
        return [key, occurrences[key]];
      }
    });
    items.sort((first, second) => {
      return second[1] - first[1];
    });
    this.writer.Info(`Distribution ----> ${items}`);
    return items;  
  }

  StudentDistribution () {
    let names = []
      .concat(...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name))
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
  PrintTopTen () {
    const distribution = this.StudentDistribution();

    // Create a new array with only the first 10 items
    let chop = distribution.slice(0, 11);
    console.info(chop);

    OTHERSHEETS.Metrics.getRange(19, 3)
      .setValue(`Top Ten Returning Trainees`)
      .setTextStyle(SpreadsheetApp.newTextStyle().setBold(true).build())
      .setHorizontalAlignment(`center`);
    chop.forEach((pair, index) => {
      console.info(`${pair[0]} -----> ${pair[1]}`);
      OTHERSHEETS.Metrics.getRange(20 + index, 2).setValue(index + 1); 
      OTHERSHEETS.Metrics.getRange(20 + index, 3).setValue(pair[0]); 
      OTHERSHEETS.Metrics.getRange(20 + index, 4).setValue(pair[1]); 
    })
    OTHERSHEETS.Metrics.getRange(19, 2, 12, 3).setBackground(COLORS.grey);
  }
  PrintAllTrainees () {
    let names = this.StudentDistribution();
    OTHERSHEETS.Everyone.getRange(2, 1, names.length, 2).setValues(names);
    OTHERSHEETS.Everyone.getRange(1, 5).setValue(`Total Trained: ${names.length}`);
  }

  // @NOTIMPLEMENTED
  ListAllTrainees () {
    let names = []
      .concat(...GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name))
      .filter(Boolean)
      .filter(x => x != `Semester Total`)
      .map(x => x = x.toLowerCase());
    let unique = [...new Set(names)]
      .map(x => x = TitleCase(x));
    console.info(unique);
    return unique;
  }

  
  SumCategories () {
    let count = {};
    let types = [].concat(...this.trainingType).filter(Boolean);

    let countFunc = (keys) => {
      count[keys] = ++count[keys] || 1;
    }
    types.forEach(countFunc);
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
  const calc = new CalculateMetrics();
  calc.CountEachCategoryTrained();
  calc.CountPresent();
  calc.CountAbsent();
  calc.CountAllTrainedUsers();
  calc.CalculateDistribution();
  calc.PrintTopTen();
  calc.PrintAllTrainees();
}

const _testMetrics = () => {
  const c = new CalculateMetrics();
  c.PrintAllTrainees();
}









