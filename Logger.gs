/**
 * -----------------------------------------------------------------------------------------------------------------
 * Class For Logging
 */
class Log {
  constructor() {
    /** @private */ 
    this.date = Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
    /** @private */ 
    this.sheet = OTHERSHEETS.Logger;
    /** @private */ 
    this.row = OTHERSHEETS.Logger.getLastRow() + 1;
    /** @private */ 
    this.maxRows = OTHERSHEETS.Logger.getMaxRows();
    /** @private */ 
    this.maxColumns = OTHERSHEETS.Logger.getMaxColumns();
    /** @private */ 
    this.type = {
      Error : `ERROR!!`,
      Warning : `WARNING!`,
      Info : `INFO`,
      Debug : `DEBUG`,
    }
  }
  Error(message = ``) {
    const text = [this.date, this.type.Error, message, ];
    this.sheet.appendRow(text);
    console.error(`${text[0]}, ${text[1]} : ${message}`);
    let rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$B2="${this.type.Error}"`)
        .setRanges([this.sheet.getRange(2, 1, this.maxRows, this.maxColumns),])
        .setBackground(COLORS.red_light)
        .setFontColor(COLORS.red)
        .build(),
    ];
    this.sheet.setConditionalFormatRules(rules);
    this._PopItem();
    this._CleanupSheet();
  }
  Warning(message = ``) {
    const text = [this.date, this.type.Warning, message, ];
    this.sheet.appendRow(text);
    console.warn(`${text[0]}, ${text[1]} : ${message}`);
    let rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$B2="${this.type.Warning}"`)
        .setRanges([this.sheet.getRange(2, 1, this.maxRows, this.maxColumns),])
        .setBackground(COLORS.orange_light)
        .setFontColor(COLORS.orange)
        .build(),
    ];
    this.sheet.setConditionalFormatRules(rules);
    this._PopItem();
    this._CleanupSheet();
  }
  Info(message = ``) {
    const text = [this.date, this.type.Info, message, ];
    this.sheet.appendRow(text);
    console.info(`${text[0]}, ${text[1]} : ${message}`);
    let rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$B2="${this.type.Info}"`)
        .setRanges([this.sheet.getRange(2, 1, this.maxRows, this.maxColumns),])
        .setBackground(COLORS.grey_light)
        .setFontColor(COLORS.grey_dark)
        .build(),
    ];
    this.sheet.setConditionalFormatRules(rules);
    this._PopItem();
    this._CleanupSheet();
  }
  Debug(message = ``) {
    const text = [this.date, this.type.Debug, message, ];
    this.sheet.appendRow(text);
    console.log(`${text[0]}, ${text[1]} : ${message}`);
    let rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$B2="${this.type.Debug}"`)
        .setRanges([this.sheet.getRange(2, 1, this.maxRows, this.maxColumns),])
        .setBackground(COLORS.purle_light)
        .setFontColor(COLORS.purple_dark)
        .build(),
    ];
    this.sheet.setConditionalFormatRules(rules);
    this._PopItem();
    this._CleanupSheet();
  }
  _PopItem() {
    if(this.row > 100) {
      this.sheet.deleteRows(2, 1);
    } else {
      this.sheet.insertRowAfter(this.sheetLength - 1);
    }
  }
  _CleanupSheet() {
    if(this.row < 2000) return;
    this.sheet.deleteRows(2, 1999);
  }
  
}

const _testWrite = () => {
  const l = new Log();
  for(let i = 0; i < 2; i++) {
    l.Info(`${i} Some Info...`);
    l.Warning(`${i} Some Warning....`);
    l.Error(`${i} Some Error....`);
    l.Debug(`${i} Some Debug....`);
  }
}

