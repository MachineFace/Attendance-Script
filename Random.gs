/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for accessing "Random Fact" API for a new random fact.
 */
class RandomFacts {
  constructor() {
  
  }

  /**
   * Fetch a Useless Fact
   * @return {string} fact
   */
  static async UselessFact() {
    const url = `https://uselessfacts.jsph.pl/random.json?language=en`;
    const params = {
      method : "GET",
      headers : { "Authorization" : "Basic ", },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
    try {
      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if (responseCode !== 200 && responseCode !== 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      const content = JSON.parse(response.getContentText())["text"];
      console.info(content);
      return content;
    } catch(err) {
      console.error(`"UselessFact()" failed : ${err}`);
      return 1;
    }
     
  }
  
  /**
   * Fill the sheet
   */
  static async LoopAndFill() {
    const present = SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.present);
    const online = SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.online);
    const entered = SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses);
    let factColumn = SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.random)
      .filter(Boolean);
    console.info(`${present.length}, ${online.length}, ${entered.length}`);
    
    for(let i = 0; i < present.length; i++) {
      if(present[i] == true && online[i] == true && entered[i] == true) {
        let fact = await RandomFacts.UselessFact();
        if(factColumn.indexOf(fact) == -1) {
          console.info(fact)
          SheetService.SetByHeader(SHEETS.Main, HEADERNAMES.random, i + 2, fact);
        } else {
          fact = await RandomFacts.UselessFact();
          console.info(`Trying again : ${fact}`);
        }
      }
    }

  }

  /**
   * Checks if a fact has already been printed or not.
   * @private
   * @param {string} fact
   * @return {string} newfact
   */
  static async CheckFactRecursively(fact) {
    const index = SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.random)
      .filter(Boolean)
      .indexOf(fact);
    const limit = 10;
    let count = 0;
    let newFact;
    if(index == -1 && count < limit) {
      console.info(count)
      return newFact;
    } else {
      newFact = await RandomFacts.UselessFact();
      count++;
      console.info(count)
      await RandomFacts.CheckFactRecursively(newFact);
      console.info(index)
      return newFact;
    }
  }

  /**
   * Loops through and prints some number of facts.
   * @param {number} count
   * @return {string} facts
   */
  static async ShowMeTheMoney(count = 5) {
    for(let i = 0; i < count; i++) {
      await RandomFacts.UselessFact();
    }
  }

  
}

const _testUselessFact = async () => {
  await RandomFacts.ShowMeTheMoney(100);
}














