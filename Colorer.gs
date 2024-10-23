

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set Row colors
 * @NOTIMPLEMENTED
 */
class Colorizer {
  constructor() {

  }

  /**
   * Set Row Color
   * @param {sheet} sheet
   * @param {number} row
   * @returns {bool} success
   */
  static SetRowColor(sheet = SHEETS.Main, row = 2,) {
    const lastColumn = sheet.getLastColumn();
    const wholerow = sheet.getRange(row, 1, 1, lastColumn);
    const { date, equipment, name, present, online, bCourses, absent, random } = SheetService.GetRowData(SHEETS.Main, row);

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
        sheet.getRange(row, 4).setValue("FALSE");
        wholerow
          .setFontColor(COLORS.grey) 
          .setBackground(COLORS.grey_light);
      } else if(absent) {
        sheet.getRange(row, 4).setValue("FALSE");
        wholerow
          .setFontColor(COLORS.grey) 
          .setBackground(COLORS.grey_light);
      } else {
        wholerow
          .setFontColor(COLORS.unset) 
          .setBackground(COLORS.unset)
        Log.Info(`Unset Colors`);
      }
      return 0;
    } catch(err) {
      Log.Error(`"SetRowColor()" failed: ${err}`);
      return 1;
    }
  }
}

const _testColor = () => Colorizer.SetRowColor(SHEETS.Main, 794);



