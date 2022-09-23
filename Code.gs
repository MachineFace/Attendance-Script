/**
 * MAIN ENTRY POINT
 */
const OnChange = async (e) => {
  const writer = new WriteLogger();
  
  // Fetch Data from Sheets
  const ss = e.range.getSheet();
  
  // Fetch Columns and rows
  const thisCol = e.range.getColumn();
  const thisRow = e.range.getRow();
  
  // Ignore Edits on background sheets
  if(ss.getSheetName() !== SHEETS.Main.getSheetName()) {
    console.info(`Skipping sheet ${ss.getSheetName()}`);
    return;
  }

  if(thisRow == 1) return;

  // STATUS CHANGE TRIGGER
  // Only look at Column 'D,E,F,G' for trigger.
  if(thisCol < 3 && thisCol > 8) return;

  const keyword = 'Semester Total';
  if(ss.getRange(thisRow, 3, 1, 1) == keyword ) {
    writer.Warning(`Skipped Row ${thisRow}`);
    return;
  }
  
  

  // Parse Row
  const date = GetByHeader(SHEETS.Main, HEADERNAMES.date, thisRow);
  const studentName = GetByHeader(SHEETS.Main, HEADERNAMES.name, thisRow);
  const present = GetByHeader(SHEETS.Main, HEADERNAMES.present, thisRow);
  const online = GetByHeader(SHEETS.Main, HEADERNAMES.online, thisRow);
  const entered = GetByHeader(SHEETS.Main, HEADERNAMES.bCourses, thisRow);
  const absent = GetByHeader(SHEETS.Main, HEADERNAMES.absent, thisRow);
  
  // Set Date
  studentName && !date ? SetByHeader(SHEETS.Main, HEADERNAMES.date, thisRow, new Date().toLocaleDateString()) : null;

  // Add a Random Fact
  if(studentName && present == true && online == true && entered == true && absent == false) {
    console.info(`Setting Random Fact....`);
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, await new RandomFacts().UselessFact());
  } else if(studentName && absent == true) {
    console.info(`Setting FuckOff....`);
    SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, thisRow, await new FuckOffAsAService({name : studentName}).GetRandom());
  } else {
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, "");
    SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, thisRow, "");
  }

  
}



const _tt = () => {
  // let test = SHEETS.Main;
  let test = OTHERSHEETS.Logger
  if(Object.values(OTHERSHEETS).includes(test)) console.info(`Found sheet ${test.getSheetName()}`);
  // else if(Object.values(SHEETS).includes(test)) console.info(`Found sheet ${test.getSheetName()}`);
  else console.info(`No match....`)
}







