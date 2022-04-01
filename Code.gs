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
  
  // Set up types of training via Validation
  const rule = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(Object.values(TYPES), true)
    .build();
  SHEETS.Main.getRange(thisRow, 2).setDataValidation(rule);
  
  // True false validation
  const setCheckbox = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();

  // Loop through cols 4 to 7 and set validation to checkbox
  for(let i = 4; i <= 7; i++) {
    SHEETS.Main.getRange(thisRow, i).setDataValidation(setCheckbox);
  }
  
  // Set Date
  SetByHeader(SHEETS.Main, HEADERNAMES.date, thisRow, new Date());

  // Parse Row
  const studentName = GetByHeader(SHEETS.Main, HEADERNAMES.name, thisRow);
  const present = GetByHeader(SHEETS.Main, HEADERNAMES.present, thisRow);
  const online = GetByHeader(SHEETS.Main, HEADERNAMES.online, thisRow);
  const entered = GetByHeader(SHEETS.Main, HEADERNAMES.bCourses, thisRow);
  const absent = GetByHeader(SHEETS.Main, HEADERNAMES.absent, thisRow);
  
  // Color Rows
  const colorer = new Colorer({thisRow : thisRow}).SetColor();

  // Add a Random Fact
  if(studentName != null && present == true && online == true && entered == true) {
    SetByHeader(SHEETS.Main, "Random Fact", thisRow, await new RandomFacts().UselessFact());
  } else if(studentName != null && absent == true) {
    SetByHeader(SHEETS.Main, `Fuck Off As A Service`, thisRow, await new FuckOffAsAService({name : studentName}).GetRandom());
  } else {
    SetByHeader(SHEETS.Main, "Random Fact", thisRow, "");
    SetByHeader(SHEETS.Main, `Fuck Off As A Service`, thisRow, "");
  }

  
  
  // Run Metrics
  const calc = new CalculateMetrics();
  calc.CountPresent();
  calc.CountAbsent();
  calc.CountAllTrainedUsers();
  calc.CountEachCategoryTrained();
}









