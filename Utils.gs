
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set Row colors
 */
class Colorer
{
  constructor({thisRow = 1}) {
    this.thisRow = thisRow;
    this.writer = new WriteLogger();
    this.Colors = {
      unset : null,
      fontGreen : '#38761d',
      cellGreen : '#d9ead3',
      fontOrange : '#ff9900',
      cellOrange : '#fce5cd',
      fontYellow : '#f1c232',
      cellYellow : '#fff2cc',
      fontRed : '#ff0000',
      cellRed : '#e6b8af',
      fontGrey : '#999999',
      cellGrey : '#efefef',
    }
  }

  

  SetColor() {
    const wholerow = SHEETS.main.getRange(this.thisRow, 1, 1, SHEETS.main.getLastColumn());
    const present = GetByHeader(SHEETS.main, "Present", this.thisRow);
    const online = GetByHeader(SHEETS.main, "Online", this.thisRow);
    const entered = GetByHeader(SHEETS.main, "Entered in bCourses", this.thisRow);
    const absent = GetByHeader(SHEETS.main, "Absent", this.thisRow);

    try {
      if(present == true && online == true && entered == true) {
        wholerow
          .setFontColor(this.Colors.unset) 
          .setFontColor(this.Colors.fontGreen) 
          .setBackground(this.Colors.unset) 
          .setBackground(this.Colors.cellGreen);
        this.writer.Info(`Set Color to ${this.Colors.fontGreen}`);
      }
      else if(present == true && online == true && entered == false) {
        wholerow
          .setFontColor(this.Colors.unset) 
          .setFontColor(this.Colors.fontOrange) 
          .setBackground(this.Colors.unset) 
          .setBackground(this.Colors.cellOrange); 
        this.writer.Info(`Set Color to ${this.Colors.fontOrange}`);
      }
      else if(present == false && online == false && entered == true) {
        wholerow
          .setFontColor(this.Colors.unset)
          .setFontColor(this.Colors.fontYellow)  
          .setBackground(this.Colors.unset) 
          .setBackground(this.Colors.cellYellow);
        this.writer.Info(`Set Color to ${this.Colors.fontYellow}`);
      }
      else if(present == false && online == true && entered == false) {
        wholerow
          .setFontColor(this.Colors.unset)
          .setFontColor(this.Colors.fontYellow)  
          .setBackground(this.Colors.unset) 
          .setBackground(this.Colors.cellYellow);
        this.writer.Info(`Set Color to ${this.Colors.fontYellow}`);
      }
      else if(present == true && online == false) {
        wholerow
          .setFontColor(this.Colors.unset) 
          .setFontColor(this.Colors.fontRed)
          .setBackground(this.Colors.unset) 
          .setBackground(this.Colors.cellRed); 
        this.writer.Info(`Set Color to ${this.Colors.fontRed}`);
      }
      else if(absent == true) {
        SHEETS.main.getRange(this.thisRow, 4).setValue("FALSE");
        wholerow
          .setFontColor(this.Colors.unset) 
          .setFontColor(this.Colors.fontGrey) 
          .setBackground(this.Colors.unset) 
          .setBackground(this.Colors.cellGrey);
        this.writer.Info(`Set Color to ${this.Colors.fontGrey}`);
      }
      else {
        wholerow
          .setFontColor(this.Colors.unset) 
          .setBackground(this.Colors.unset)
        this.writer.Info(`Unset Colors`);
      }
    } catch(err) {
      this.writer.Error(`${err} : Couldn't change colors`);
    }
  }
}

const _testColor = () => new Colorer({thisRow : 794}).SetColor();



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the value of a cell by column name and row number
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 */
const GetByHeader = (sheet, columnName, row) => {
  try {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(columnName);
    if (col != -1) return data[row - 1][col];
  } catch (err) {
    Logger.log(`${err} : GetByHeader failed - Sheet: ${sheet} Col Name specified: ${columnName} Row: ${row}`);
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the values of a column by the name
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 */
const GetColumnDataByHeader = (sheet, columnName) => {
  try {
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf(columnName);
    let colData = data.map(d => d[col]);
    colData.splice(0, 1);
    if (col != -1) return colData;
  } catch (err) {
    Logger.log(`${err} : GetByHeader failed - Sheet: ${sheet} Col Name specified: ${columnName}`);
  }
};



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set the value of a cell by column name and row number
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 * @param {any} val
 */
const SetByHeader = (sheet, columnName, row, val) => {
  try {
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf(columnName) + 1;
    sheet.getRange(row, col).setValue(val);
  } catch (err) {
    Logger.log(`${err} : setByHeader failed - Sheet: ${sheet} Row: ${row} Col: ${col} Value: ${val}`);
  }
};

















