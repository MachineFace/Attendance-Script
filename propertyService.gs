/**
 * Set the document properties
 */
try {
  PropertiesService.getScriptProperties()
    .setProperties({
      BCOURSES_ID : 5508592,
      BCOURSES_ROOT : `https://bcourses.berkeley.edu/api/v1/`,
      BCOURSES_COURSE : `courses/1353091`,
      BCOURSES_TEMP_TOKEN : `1072~bXyBuND4sPQniJVJYHRxVOP4gCMrhpUq0BMEVExytR1g4Kaznlm6cGzR5gk872AU`,
      BCOURSES_USER : `jacobsprojectsupport@berkeley.edu`,
      BCOURSES_PASS : `Jacobsde$ign1`,
      TRELLO_ROOT : `https://api.trello.com/1`,
      TRELLO_KEY : `e0254c6a804ca17bf546a48d779572fb`,
      TRELLO_SECRET : `b842cd68cc419bdc250713a6222f19d2408b9cbc77018e90cd421e4012224b8d`,
    });
} catch(err) {
  console.log(`Failed with error: ${err.message}`);
}

