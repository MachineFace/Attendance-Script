
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set Row colors
 * @NOTIMPLEMENTED
 */
/** 
class Colorer
{
  constructor({thisRow = 1}) {
    this.thisRow = thisRow;
    this.writer = new WriteLogger();
  }

  SetColor() {
    const wholerow = SHEETS.Main.getRange(this.thisRow, 1, 1, SHEETS.Main.getLastColumn());
    const present = GetByHeader(SHEETS.Main, HEADERNAMES.present, this.thisRow);
    const online = GetByHeader(SHEETS.Main, HEADERNAMES.online, this.thisRow);
    const entered = GetByHeader(SHEETS.Main, HEADERNAMES.bCourses, this.thisRow);
    const absent = GetByHeader(SHEETS.Main, HEADERNAMES.absent, this.thisRow);

    try {
      if(present == true && online == true && entered == true) {
        wholerow
          .setFontColor(COLORS.green) 
          .setBackground(COLORS.green_light);
      }
      else if(present == true && online == true && entered == false) {
        wholerow
          .setFontColor(COLORS.orange_dark) 
          .setBackground(COLORS.orange_light); 
      }
      else if(present == false && online == false && entered == true) {
        wholerow
          .setFontColor(COLORS.yellow)  
          .setBackground(COLORS.yellow_light);
      }
      else if(present == false && online == true && entered == false) {
        wholerow
          .setFontColor(COLORS.red_dark_1)  
          .setBackground(COLORS.yellow_light);
      }
      else if(present == true && online == false) {
        wholerow
          .setFontColor(COLORS.red_dark_1)
          .setBackground(COLORS.red_light); 
      }
      else if(absent == true) {
        SHEETS.Main.getRange(this.thisRow, 4).setValue("FALSE");
        wholerow
          .setFontColor(COLORS.grey) 
          .setBackground(COLORS.grey_light);
      }
      else {
        wholerow
          .setFontColor(COLORS.unset) 
          .setBackground(COLORS.unset)
        this.writer.Info(`Unset Colors`);
      }
    } catch(err) {
      this.writer.Error(`${err} : Couldn't change colors`);
    }
  }
}

const _testColor = () => new Colorer({thisRow : 794}).SetColor();
*/


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
      .setFontColor(COLORS.red_dark_1)
      .build()
    ,
    // if(present == true && online == false)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=True,$E2=False, $F2=False, $G2=False)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.red_light)
      .setFontColor(COLORS.red_dark_1)
      .build()
    ,
    // SpreadsheetApp.newConditionalFormatRule()
    //   .whenFormulaSatisfied(`=AND($D2=True,$E2=True, $F2=True, $G2=False)`)
    //   .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
    //   .setBackground(COLORS.purle_light)
    //   .setFontColor(COLORS.purple_dark)
    //   .build()
    // ,
    // if(absent == true)
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND($D2=False,$E2=False, $F2=False, $G2=True)`)
      .setRanges([sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns()),])
      .setBackground(COLORS.grey_light)
      .setFontColor(COLORS.grey)
      .build()
    ,
  ];
  sheet.setConditionalFormatRules(rules);

}