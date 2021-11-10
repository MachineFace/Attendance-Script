
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics Class for Attendance Data
 */ 
class CalculateMetrics
{
  constructor() {
    this.trainingType = GetColumnDataByHeader(SHEETS.main, "Equipment")
    this.students = GetColumnDataByHeader(SHEETS.main, "Student Name")
    this.presentColumn = GetColumnDataByHeader(SHEETS.main, "Present")
    this.onlineColumn = GetColumnDataByHeader(SHEETS.main, "Online")
    this.enteredColumn = GetColumnDataByHeader(SHEETS.main, "Entered in bCourses")
    this.absentColumn = GetColumnDataByHeader(SHEETS.main, "Absent")
    this.writer = new WriteLogger();
  }

  _CountUnique(iterable) {
    return new Set(iterable).size;
  }

  CountEachCategoryTrained() {
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
    this.writer.Info(`Haas Count : ${haasCount}`);
    this.writer.Info(`Tormach Count : ${tormachCount}`);
    this.writer.Info(`FabLight Count : ${fablightCount}`);
    this.writer.Info(`Type A / Ultimaker Count : ${ultimakerCount}`);
    this.writer.Info(`Laser Count : ${laserCount}`);

    // Write to Sheet
    SHEETS.metrics.getRange('E3').setValue(haasCount);
    SHEETS.metrics.getRange('E4').setValue(ultimakerCount);
    SHEETS.metrics.getRange('E5').setValue(tormachCount);
    SHEETS.metrics.getRange('E6').setValue(fablightCount);
    SHEETS.metrics.getRange('E7').setValue(laserCount);
    return {
      haas : haasCount, 
      tormach : tormachCount,
      fablight : fablightCount,
      ultimakers : ultimakerCount,
      lasers : laserCount,
    }
  }

  CountPresent() {
    // Count totals
    let total = 0;
    let cleaned = this.enteredColumn.filter(Boolean);
    cleaned.forEach(entry => {
      if(entry == true) total++
    });
    this.writer.Info(`Total Trained : ${total}`);
    SHEETS.metrics.getRange('E8').setValue(total);
  }

  CountAbsent() {
    // Count totals
    let absent = 0;
    this.absentColumn.forEach(absentee => {
      if(absentee == true) absent++
    });  
    this.writer.Info(`Total Absent : ${absent}`);
    SHEETS.metrics.getRange('E9').setValue(absent);
  }

  CountAllTrainedUsers() {
    let students = [];
    const cleaned = this.students.filter(Boolean);
    cleaned.forEach((student, index) => {
      if(this.enteredColumn[index] == true) students.push(student);
    })
    let unique = this._CountUnique(students);
    this.writer.Info(`Total Students Trained : ${unique}`);
  }

  CalculateDistribution() {
    let types = SHEETS.main.getRange(2, 2, SHEETS.main.getLastRow(), 1).getValues();
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
}


const _testCalc = () => {
  const calc = new CalculateMetrics();
  calc.CountEachCategoryTrained();
  calc.CountPresent();
  calc.CountAbsent();
  calc.CountAllTrainedUsers();
  calc.CalculateDistribution();
}










