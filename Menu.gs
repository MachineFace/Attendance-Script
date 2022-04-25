
/**
 * Mark a job as abandoned and send an email to that student
 */
/*
const PopUpMarkAsAbandoned = async () => {
  let ui = SpreadsheetApp.getUi(); 
  let response = ui.prompt(`Mark Print as Abandoned`, `Scan a ticket with this cell selected and press "OK".`, ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    let jobnumber = response.getResponseText();
    console.warn(`Finding ${jobnumber}`);
    let res = FindOne(jobnumber);
    if(res == null) {
      progressUpdate.setValue(`Job number not found. Try again.`);
    } else {
      let sheet = SHEETS[res.sheetName];
      let row = res.row;
      let email = res.email;
      let projectname = res.filename;
      let material1Quantity = res.materials;
      SetByHeader(sheet, HEADERNAMES.status, row, STATUS.abandoned.plaintext);
      console.info(`Job number ${jobnumber} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${row}`);
      await new Emailer({
        email : email, 
        status : STATUS.abandoned.plaintext,
        projectname : projectname,
        jobnumber : jobnumber,
        material1Quantity : material1Quantity,
      })
      console.warn(`Owner ${email} of abandoned job: ${jobnumber} emailed...`);
      ui.alert(`Marked as Abandoned`, `${email}, Job: ${jobnumber} emailed... Sheet: ${sheet.getSheetName()} row: ${row}`, ui.ButtonSet.OK);
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    console.warn(`User chose not to send an email...`);
  } else {
    console.warn(`User cancelled.`);
  }
    
}
*/
/**
 * Mark a job as abandoned and send an email to that student
 */
/*
const PopUpMarkAsPickedUp = async () => {
  let ui = SpreadsheetApp.getUi(); 
  let response = ui.prompt(`Mark Print as Picked Up`, `Scan a ticket with this cell selected and press "OK".`, ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    let jobnumber = response.getResponseText();
    console.warn(`Finding ${jobnumber}`);
    let res = FindOne(jobnumber);
    if(res == null) {
      progressUpdate.setValue(`Job number not found. Try again.`);
    } else {
      let sheet = SHEETS[res.sheetName];
      let row = res.row;
      let email = res.email;
      SetByHeader(sheet, HEADERNAMES.status, row, STATUS.pickedUp.plaintext);
      console.warn(`${email}, Job: ${jobnumber} marked as picked up... Sheet: ${sheet.getSheetName()} row: ${row}`);
      ui.alert(`Marked as Picked Up`, `${email}, Job: ${jobnumber}... Sheet: ${sheet.getSheetName()} row: ${row}`, ui.ButtonSet.OK);
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    console.warn(`User chose not to mark as picked up...`);
  } else {
    console.warn(`User cancelled.`);
  }
    
}
*/

/**
 * -----------------------------------------------------------------------------------------------------------------
 * Creates a pop-up for counting users.
 */
// const calc = new CalculateMetrics();
//   calc.CountPresent();
//   calc.CountAbsent();
//   calc.CountAllTrainedUsers();
//   calc.CalculateDistribution();



/**
 * Popup Count each category Trained
 */
const PopupCategoryTrained = async () => {
  let ui = await SpreadsheetApp.getUi();
  const calc = new CalculateMetrics();
  let counts = await calc.CountEachCategoryTrained();
  ui.alert(
    `MachineFace Alert`,
    `${JSON.stringify(counts)}`,
    ui.ButtonSet.OK
  );
};

/**
 * Popup Count each category Trained
 */
const PopupCountAllTrainedUsers = async () => {
  let ui = await SpreadsheetApp.getUi();
  const c = new CalculateMetrics();
  let counts = await c.CountAllTrainedUsers();
  let absent = await c.CountAbsent();
  let present = c.CountPresent();
  ui.alert(
    `MachineFace Alert`,
    `Number of Trained Users ----> ${counts}\n` + 
    `Absent ----> ${absent}\n` + 
    `Present ----> ${present}\n`,
    ui.ButtonSet.OK
  );
};

/**
 * Popup Generate Random Fact
 */
const PopupRandomFact = async () => {
  let ui = await SpreadsheetApp.getUi();
  let fact = await new RandomFacts().UselessFact()
  ui.alert(
    `MachineFace Alert`,
    `${fact}`,
    ui.ButtonSet.OK
  );
};

/**
 * Popup Generate Fuckoff as a service
 */
const PopupFOff = async () => {
  let ui = await SpreadsheetApp.getUi();
  let fOff = await new FuckOffAsAService({name : `Cody`}).GetRandom()
  ui.alert(
    `MachineFace Alert`,
    `${fOff}`,
    ui.ButtonSet.OK
  );
};



/**
 * Builds HTML file for the modal pop-up from the help list.
 */
const BuildHTMLHELP = () => {
  let items = [
    "Note : All status changes trigger an email to the student except for 'CLOSED' status",
    "New Project comes into a sheet and status will automatically be set to 'Received'.",
    "Assign yourself as the DS / SS and fill in the materials as best you can.",
    "Change the status to 'In-Progress' when you're ready to start the project.",
    "Wait 30 seconds for the printable ticket to generate, and print it.",
    "Fabricate the project.",
    "When it's done, bag the project + staple the ticket to the bag and change the status to 'Completed'.",
    "Select any cell in the row and choose 'Generate Bill' to bill the student. The status will change itself to 'Billed'.",
    "If you don't need to bill the student, choose 'CLOSED' status.",
    "If you need to cancel the job, choose 'Cancelled'. ",
    "If the project can't be fabricated at all, choose 'FAILED', and email the student why it failed.",
    "If you need student approval before proceeding, choose 'Pending Approval'. ",
    "'Missing Access' will be set automatically, and you should not choose this as an option.",
    "If the student needs to be waitlisted for more information or space, choose 'Waitlisted'. ",
    "See Cody or Chris for additional help + protips.",
  ];
  let html = '<h2 style="text-align:center"><b> HELP MENU </b></h2>';
  html += '<h3 style="font-family:Roboto">How to Use JPS : </h3>';
  html += "<hr>";
  html += "<p>" + items[0] + "</p>";
  html += '<ol style="font-family:Roboto font-size:10">';
  items.forEach((item, index) => {
    if (index > 0 && index < items.length - 1) {
      html += "<li>" + item + "</li>";
    }
  });
  html += "</ol>";
  html += "<p>" + items[items.length - 1] + "</p>";

  console.info(html);
  return html;
};

/**
 * Creates a modal pop-up for the help text.
 */
const PopupHelp = () => {
  let ui = SpreadsheetApp.getUi();
  let title = "JPS Runtime HELP";
  let htmlOutput = HtmlService.createHtmlOutput(BuildHTMLHELP())
    .setWidth(640)
    .setHeight(480);
  ui.showModalDialog(htmlOutput, title);
};



/**
 * Builds our JPS Menu and sets functions.
 */
const BarMenu = () => {
  SpreadsheetApp.getUi()
    .createMenu(`Cody's Menu`)
    .addItem(`Go to Main Tab`, `OpenMainTab`)
    .addItem(`Generate Random Fact`, `PopupRandomFact`)
    .addItem(`F-Off as a Service`, `PopupFOff`)
    .addSeparator()
    .addItem(`Count Categories Trained`, `PopupCategoryTrained`)
    .addItem(`Count All Trained Users`, `PopupCountAllTrainedUsers`)
    .addSeparator()
    .addItem(`Help`, `PopupHelp`)
    .addSeparator()
    .addItem(`Recompute Metrics`, `Metrics`)
    .addToUi();
};



/**
 * Switch to scanning page.
 */
const OpenMainTab = async () => {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  await spreadsheet.setActiveSheet(SHEETS.Main).getRange('B3').activate();
}


