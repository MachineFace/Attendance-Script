/**
 * MAIN ENTRY POINT
 */
const OnEdit = async (e) => {
  const writer = new WriteLogger();
  
  // Fetch Data from Sheets
  const ss = e.range.getSheet();
  
  // Fetch Columns and rows
  const thisCol = e.range.getColumn();
  const thisRow = e.range.getRow();
  
  // Ignore Edits on background sheets
  Object.values(OTHERSHEETS).forEach(noGoSheet => {
    if(SpreadsheetApp.getActiveSpreadsheet().getSheetName() == noGoSheet.getSheetName()) return;
  })

  if(thisRow == 1) return;

  // STATUS CHANGE TRIGGER
  // Only look at Column 'D,E,F,G' for trigger.
  if(thisCol < 3 && thisCol > 8) return;

  const keyword = 'Semester Total';
  if(ss.getRange(thisRow, 3, 1, 1) == keyword ) {
    writer.Warning(`Skipped Row ${thisRow}`);
    return;
  }
  
  
  
  // Set Date
  SetByHeader(SHEETS.Main, HEADERNAMES.date, thisRow, new Date());

  // Parse Row
  const studentName = GetByHeader(SHEETS.Main, HEADERNAMES.name, thisRow);
  const present = GetByHeader(SHEETS.Main, HEADERNAMES.present, thisRow);
  const online = GetByHeader(SHEETS.Main, HEADERNAMES.online, thisRow);
  const entered = GetByHeader(SHEETS.Main, HEADERNAMES.bCourses, thisRow);
  const absent = GetByHeader(SHEETS.Main, HEADERNAMES.absent, thisRow);
  
  // Add a Random Fact
  if(studentName != null && present == true && online == true && entered == true) {
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, await new RandomFacts().UselessFact());
  } else if(studentName != null && absent == true) {
    SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, thisRow, await new FuckOffAsAService({name : studentName}).GetRandom());
  } else {
    SetByHeader(SHEETS.Main, HEADERNAMES.random, thisRow, "");
    SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, thisRow, "");
  }

  
}









