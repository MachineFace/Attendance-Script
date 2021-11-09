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
  const thisSheetName = ss.getSheetName();
  switch (thisSheetName) {
    case "Data / Metrics":
    case 'Chart1':
    case 'Haas Usage':
    case 'Logger':
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
  
  // Set up types of training via Validation
  const rule = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(Object.values(TYPES), true)
    .build();
  SHEETS.main.getRange(thisRow, 2).setDataValidation(rule);
  
  // True false validation
  const setCheckbox = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();

  // Loop through cols 4 to 7 and set validation to checkbox
  for(let i = 4; i <= 7; i++) {
    SHEETS.main.getRange(thisRow, i).setDataValidation(setCheckbox);
  }
  
  // Set Date
  SHEETS.main.getRange(thisRow, 1).setValue(new Date());

  // Parse Row
  const studentName = GetByHeader(SHEETS.main, "Student Name", thisRow);
  const present = GetByHeader(SHEETS.main, "Present", thisRow);
  const online = GetByHeader(SHEETS.main, "Online", thisRow);
  const entered = GetByHeader(SHEETS.main, "Entered in bCourses", thisRow);
  
  
  // Color Rows
  const colorer = new Colorer({thisRow : thisRow}).SetColor();

  // Add a Random Fact
  if(studentName != null && present == true && online == true && entered == true) {
    SetByHeader(SHEETS.main, "Random Fact", thisRow, await new RandomFacts().UselessFact());
  } else {
    SetByHeader(SHEETS.main, "Random Fact", thisRow, "");
  }
  
  
  // Run Metrics
  const calc = new CalculateMetrics();
  calc.CountPresent();
  calc.CountAbsent();
  calc.CountAllTrainedUsers();
  calc.CountEachCategoryTrained();
}









