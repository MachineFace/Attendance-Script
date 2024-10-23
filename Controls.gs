/**
 * ------------------------------------------------------------------------------------------------
 * Conrolls
 */



const SetPurgeTrigger = () => ScriptApp.newTrigger(`CleanOutJPSNotifications`).timeBased().everyDays(1).create();
const SetPurgeMoreTrigger = () => ScriptApp.newTrigger('purgeMore').timeBased().at(new Date(new Date().getTime() + 1000 * 60 * 2)).create();

/**
 * Clean Out Old JPS Notifications
 * @TRIGGERED Daily
 */
const CleanOutJPSNotifications = () => {
  let cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DELETE_AFTER_DAYS);
  console.warn(`Cutoff Date ${DELETE_AFTER_DAYS} Days ago: ${cutoff}`);
  let purgeDate  = Utilities.formatDate(cutoff, `PST`, `yyyy-MM-dd`);
  try {
    let pageToken;
    do {
      const threadList = Gmail.Users.Threads.list('me', {
        q: `label:jacobs-project-support-jps-notifications before:${purgeDate}`,
        pageToken: pageToken
      });
      if (threadList.threads && threadList.threads.length > 0) {
        console.info(`Removing ${threadList.threads.length} Emails....`)
        threadList.threads.forEach(thread => {
          // console.info(`Removing Thread: ${thread}`);
          Gmail.Users.Threads.remove(`me`, thread.id)
          // console.info(thread.getId());
          // console.info(`Snip: ${thread.snippet}`);

        });
      }
      pageToken = threadList.nextPageToken;
    } while (pageToken);
  } catch (err) {
    console.error(`Whoops ----> ${err}`);
  } finally {
    console.warn(`Emails Cleaned Out.`);
  }
}

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
 * Set validation
 * @TRIGGERED - Once a month
 */
const SetValidationRules = () => {
  try {
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
    return 0;
  } catch(err) {
    console.error(`"SetValidationRules()" failed : ${err}`);
    return 1;
  }
}
