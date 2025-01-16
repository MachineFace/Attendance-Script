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
  const { date, equipment, name, present, online, bCourses, absent, random, row } = SheetService.GetRowData(SHEETS.Main, thisRow);
  
  // Add a Random Fact
  if(name && present && online && bCourses && !absent) {
    console.info(`Setting Random Fact....`);
    SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, await RandomFacts.UselessFact());
  } else if(name && absent) {
    // console.info(`Skipping FuckOff....`);
    SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.online, thisRow, false);
    SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.present, thisRow, false);
    SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.bCourses, thisRow, false);
    SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, await new FuckOffAsAService({ name : name }).GetRandom());
  } else {
    SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, undefined);
  }

  
}









