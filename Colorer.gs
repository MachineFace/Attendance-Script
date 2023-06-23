
/**
 * Set the Conditional Formatting for each page
 * @TRIGGERED - Once a month
 */
const SetConditionalFormatting = () => {
  const sheet = SHEETS.Main;
  let rules = [
    // if(present == true && online == true && entered == true)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=True,$E2=True, $F2=True, $G2=False)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.green_light)
      .setFontColor(COLORS.green_dark)
      .build()
    ,
    // if(present == true && online == true && entered == false)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=True,$E2=True, $F2=False, $G2=False)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.orange_light)
      .setFontColor(COLORS.orange_dark)
      .build()
    ,
    // if(present == false && online == false && entered == true)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=False,$E2=False, $F2=True, $G2=False)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.yellow_light)
      .setFontColor(COLORS.yellow_dark)
      .build()
    ,
    // if(present == false && online == true && entered == false)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=False,$E2=True, $F2=False, $G2=False)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.red_light)
      .setFontColor(COLORS.red)
      .build()
    ,
    // if(present == true && online == false)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=True,$E2=False, $F2=False, $G2=False)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.red_light)
      .setFontColor(COLORS.red)
      .build()
    ,
    // if(absent == true)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=False,$E2=False, $F2=False, $G2=True)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.grey_light)
      .setFontColor(COLORS.grey)
      .build()
    ,
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=$C2="Semester Total"`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.purple)
      .setFontColor(COLORS.purple_dark)
      .build()
    ,
  ];
  sheet.setConditionalFormatRules(rules);

}






/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set Row colors
 * @NOTIMPLEMENTED
 */
class Colorer {
  constructor({ row : row = 2 }) {
    /** @private */
    this.row = row;
  }

  /**
   * Set Color
   */
  SetColor() {
    const wholerow = SHEETS.Main.getRange(this.row, 1, 1, SHEETS.Main.getLastColumn());
    const { date, equipment, name, present, online, bCourses, absent, random, row } = GetRowData(this.row);

    try {
      if(present && online && bCourses) {
        wholerow
          .setFontColor(COLORS.green) 
          .setBackground(COLORS.green_light);
      } else if(present && online && !bCourses) {
        wholerow
          .setFontColor(COLORS.orange_dark) 
          .setBackground(COLORS.orange_light); 
      } else if(!present && !online && bCourses) {
        wholerow
          .setFontColor(COLORS.yellow)  
          .setBackground(COLORS.yellow_light);
      } else if(!present && online && !bCourses) {
        wholerow
          .setFontColor(COLORS.red_dark_1)  
          .setBackground(COLORS.yellow_light);
      } else if(present && !online) {
        wholerow
          .setFontColor(COLORS.red_dark_1)
          .setBackground(COLORS.red_light); 
      } else if(!present && !online && !bCourses && absent) {
        SHEETS.Main.getRange(this.row, 4).setValue("FALSE");
        wholerow
          .setFontColor(COLORS.grey) 
          .setBackground(COLORS.grey_light);
      } else if(absent) {
        SHEETS.Main.getRange(this.row, 4).setValue("FALSE");
        wholerow
          .setFontColor(COLORS.grey) 
          .setBackground(COLORS.grey_light);
      } else {
        wholerow
          .setFontColor(COLORS.unset) 
          .setBackground(COLORS.unset)
        Log.Info(`Unset Colors`);
      }
    } catch(err) {
      Log.Error(`${err} : Couldn't change colors`);
      return 1;
    }
  }
}

const _testColor = () => new Colorer({row : 794}).SetColor();



