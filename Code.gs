/**
 * MAIN ENTRY POINT
 */
const OnChange = async (e) => {
  
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
  if(thisCol < 3 && thisCol > 8) return;

  const keyword = 'Semester Total';
  if(ss.getRange(thisRow, 3, 1, 1) == keyword ) {
    console.warn(`Skipped Row ${thisRow}`);
    return;
  }

  // Parse Row
  const { date, equipment, name, present, online, bCourses, absent, random, row } = GetRowData(thisRow);
  
  // Set Date
  name && !date ? SetByHeader(SHEETS.Main, HEADERNAMES.date, thisRow, new Date().toLocaleDateString()) : null;

  // Add a Random Fact
  if(name && present == true && online == true && bCourses == true && absent == false) {
    console.info(`Setting Random Fact....`);
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, await RandomFacts.UselessFact());
  } else if(name && absent == true) {
    // console.info(`Skipping FuckOff....`);
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, await new FuckOffAsAService({ name : name }).GetRandom());
  } else {
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, undefined);
    // SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, thisRow, undefined);
  }

  
}









