
const ShowSidebar = async () => {
  const ui = SpreadsheetApp.getUi();
  let template = HtmlService.createTemplateFromFile('sidebar')
  template.types = TYPES;
  let html = HtmlService
    .createHtmlOutput(
      template.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .getBlob()
        .setName(`${ServiceName} Menu`)
      ).setWidth(400)
  ui.showSidebar(html);
}

const ProcessForm = (formObject) => {
  let type = ``, names = []; 
  Object.entries(formObject).forEach( pair => {
    // console.info(`Key: ${pair[0]}, Value: ${pair[1]}`);
    if(pair[0] == `type`) type = pair[1];
    if(pair[0] == `names`) names = pair[1];
  })
  console.info(`Type: ${type}, Names: ${names}`);
  let parsed = ParseStudents(names);
  parsed.forEach(name => {
    let data = [new Date().toLocaleDateString(), type, name, false, true, false, false];
    SHEETS.Main.appendRow(data)
  })
  const setCheckbox = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();
  SHEETS.Main.getRange(2, 4, SHEETS.Main.getLastRow() - 1, 4).setDataValidation(setCheckbox);

}




const _testTypes = () => {
  Object.values(TYPES).forEach( (key, value, index) => {
    console.warn(key)
  })
}

const handleFact = async () => {
  let fact = await RandomFacts.UselessFact(); 
  return fact;
}









