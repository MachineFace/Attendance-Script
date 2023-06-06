
/**
 * Popup Count each category Trained
 */
const PopupCategoryTrained = async () => {
  const ui = await SpreadsheetApp.getUi();
  const counts = Calculate.CountEachCategoryTrained();
  ui.alert(
    `${ServiceName}`,
    `${JSON.stringify(counts, null, 3)}`,
    ui.ButtonSet.OK
  );
};

/**
 * Popup Count each category Trained
 */
const PopupCountAllTrainedUsers = async () => {
  const ui = await SpreadsheetApp.getUi();
  const counts = Calculate.CountAllTrainedUsers();
  const absent = Calculate.CountAbsent();
  const present = Calculate.CountPresent();
  ui.alert(
    `${ServiceName}`,
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
  const ui = await SpreadsheetApp.getUi();
  const fact = await RandomFacts.UselessFact();
  ui.alert(
    `${ServiceName}`,
    `${fact}`,
    ui.ButtonSet.OK
  );
};

/**
 * Popup Generate Fuckoff as a service
 */
const PopupFOff = async () => {
  const ui = await SpreadsheetApp.getUi();
  const fOff = await new FuckOffAsAService({name : `Cody`}).GetRandom()
  ui.alert(
    `${ServiceName}`,
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
  const ui = SpreadsheetApp.getUi();
  const title = `${ServiceName}`;
  const htmlOutput = HtmlService.createHtmlOutput(BuildHTMLHELP())
    .setWidth(640)
    .setHeight(480);
  ui.showModalDialog(htmlOutput, title);
};

/**
 * Popup Delete Old Emails
 */
const PopupCleanOutJPSNotifications = async () => {
  const ui = await SpreadsheetApp.getUi();
  const fOff = await new FuckOffAsAService({name : `Cody`}).GetRandom(); 
  const response = ui.alert(
    `${ServiceName}`,
    `Deleting all the old JPS Notification emails....`, 
    ui.ButtonSet.OK_CANCEL
  );
  if (response == ui.Button.OK) {
    CleanOutJPSNotifications();
  } else if (response == ui.Button.CANCEL) {
    ui.alert(
      `${ServiceName}`,
      `${fOff}`,
      ui.ButtonSet.OK
    )
  } else {
    console.warn(`User cancelled.`);
  }
}



/**
 * Builds our JPS Menu and sets functions.
 */
const BarMenu = () => {
  SpreadsheetApp.getUi()
    .createMenu(`${ServiceName} Menu`)
    .addItem(`💩 Go to Main Tab`, `OpenMainTab`)
    .addItem(`💩 Show Sidebar`, `ShowSidebar`)
    .addItem(`💩 Generate Random Fact`, `PopupRandomFact`)
    .addItem(`💩 Fuck Off as a Service`, `PopupFOff`)
    .addSeparator()
    .addItem(`💩 Count Categories Trained`, `PopupCategoryTrained`)
    .addItem(`💩 Count All Trained Users`, `PopupCountAllTrainedUsers`)
    .addSeparator()
    .addItem(`💩 Help`, `PopupHelp`)
    .addSeparator()
    .addItem(`💩 Recompute Metrics`, `Metrics`)
    .addSeparator()
    .addItem(`💩 Delete Old Emails`, `PopupCleanOutJPSNotifications`)
    .addToUi();
};



/**
 * Switch to scanning page.
 */
const OpenMainTab = async () => {
  SpreadsheetApp.getActiveSpreadsheet()
    .setActiveSheet(SHEETS.Main)
    .getRange('B3')
    .activate();
}


