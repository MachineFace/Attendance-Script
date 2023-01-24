




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the value of a cell by column name and row number
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 */
const GetByHeader = (sheet, columnName, row) => {
  try {
    if(CheckSheetIsForbidden(sheet) == true) {
      throw new Error(`A non-sheet argument was passed to a function that requires a sheet.`);
    }
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(columnName);
    if (col != -1) return data[row - 1][col];
  } catch (err) {
    console.error(`${err} : GetByHeader failed - Sheet: ${sheet} Col Name specified: ${columnName} Row: ${row}`);
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
    if(CheckSheetIsForbidden(sheet) == true) {
      throw new Error(`A non-sheet argument was passed to a function that requires a sheet.`);
    }
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf(columnName);
    let colData = data.map(d => d[col]);
    colData.splice(0, 1);
    if (col != -1) return colData;
  } catch (err) {
    console.error(`${err} : GetByHeader failed - Sheet: ${sheet} Col Name specified: ${columnName}`);
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
    if(CheckSheetIsForbidden(sheet) == true) {
      throw new Error(`A non-sheet argument was passed to a function that requires a sheet.`);
    }
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf(columnName) + 1;
    sheet.getRange(row, col).setValue(val);
  } catch (err) {
    console.error(`${err} : setByHeader failed - Sheet: ${sheet} Row: ${row} Col: ${col} Value: ${val}`);
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the values of a row by the number
 * @param {sheet} sheet
 * @param {number} row
 * @returns {dict} {header, value}
 */
const GetRowData = (row) => {
  let dict = {};
  try {
    let headers = SHEETS.Main.getRange(1, 1, 1, SHEETS.Main.getMaxColumns()).getValues()[0];
    headers.forEach( (name, index) => {
      headers[index] = Object.keys(HEADERNAMES).find(key => HEADERNAMES[key] === name);
    })
    let data = SHEETS.Main.getRange(row, 1, 1, SHEETS.Main.getMaxColumns()).getValues()[0];
    headers.forEach( (header, index) => {
      dict[header] = data[index];
    });
    dict[`sheetName`] = SHEETS.Main.getSheetName();
    dict[`row`] = row;
    console.info(dict);
    return dict;
  } catch (err) {
    console.error(`${err} : GetRowData failed - Sheet: ${SHEETS.Main.getSheetName()} Row: ${row}`);
  }
}




/**
 * Check if this sheet is forbidden
 * @param {sheet} sheet to check
 * @returns {bool} false if sheet is allowed
 * @returns {bool} true if forbidden
 */
const CheckSheetIsForbidden = (someSheet) => {
  // Check if it's even a sheet
  if (someSheet !== Object(someSheet)) {
    console.error(`A non-sheet argument was passed to a function that requires a sheet.`);
    return true;
  }
  let forbiddenNames = Object.keys(OTHERSHEETS);
  const index = forbiddenNames.indexOf(someSheet.getName());
  if(index == -1 || index == undefined) {
    console.info(`Sheet is NOT FORBIDDEN : ${someSheet.getName()}`)
    return false;
  } else {
    console.error(`SHEET FORBIDDEN : ${forbiddenNames[index]}`);
    return true;
  }
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set validation
 * @TRIGGERED - Once a month
 */
const SetValidationRules = () => {
  console.warn(`Setting Validation Rules......`);
  const rule = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(Object.values(TYPES), true)
    .build();
  SHEETS.Main.getRange(2, 2, SHEETS.Main.getMaxRows(), 1).setDataValidation(rule);
  
  // True false validation
  const setCheckbox = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();
  SHEETS.Main.getRange(2, 4, SHEETS.Main.getLastRow(), 4).setDataValidation(setCheckbox);
  console.warn(`Validation Rules Set......`);
}













