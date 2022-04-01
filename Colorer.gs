
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set Row colors
 */
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
          .setFontColor(COLORS.unset) 
          .setFontColor(COLORS.fontGreen) 
          .setBackground(COLORS.unset) 
          .setBackground(COLORS.cellGreen);
        this.writer.Info(`Set Color to ${COLORS.fontGreen}`);
      }
      else if(present == true && online == true && entered == false) {
        wholerow
          .setFontColor(COLORS.unset) 
          .setFontColor(COLORS.fontOrange) 
          .setBackground(COLORS.unset) 
          .setBackground(COLORS.cellOrange); 
        this.writer.Info(`Set Color to ${COLORS.fontOrange}`);
      }
      else if(present == false && online == false && entered == true) {
        wholerow
          .setFontColor(COLORS.unset)
          .setFontColor(COLORS.fontYellow)  
          .setBackground(COLORS.unset) 
          .setBackground(COLORS.cellYellow);
        this.writer.Info(`Set Color to ${COLORS.fontYellow}`);
      }
      else if(present == false && online == true && entered == false) {
        wholerow
          .setFontColor(COLORS.unset)
          .setFontColor(COLORS.fontYellow)  
          .setBackground(COLORS.unset) 
          .setBackground(COLORS.cellYellow);
        this.writer.Info(`Set Color to ${COLORS.fontYellow}`);
      }
      else if(present == true && online == false) {
        wholerow
          .setFontColor(COLORS.unset) 
          .setFontColor(COLORS.fontRed)
          .setBackground(COLORS.unset) 
          .setBackground(COLORS.cellRed); 
        this.writer.Info(`Set Color to ${COLORS.fontRed}`);
      }
      else if(absent == true) {
        SHEETS.Main.getRange(this.thisRow, 4).setValue("FALSE");
        wholerow
          .setFontColor(COLORS.unset) 
          .setFontColor(COLORS.fontGrey) 
          .setBackground(COLORS.unset) 
          .setBackground(COLORS.cellGrey);
        this.writer.Info(`Set Color to ${COLORS.fontGrey}`);
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