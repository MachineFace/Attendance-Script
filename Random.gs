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
    const repo = `https://uselessfacts.jsph.pl/random.json?language=en`;
    const params = {
      method : "GET",
      headers : { "Authorization" : "Basic ", },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
    try {
      const response = await UrlFetchApp.fetch(repo, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      const content = JSON.parse(response.getContentText())["text"];
      console.info(content);
      return content;
    } catch(err) {
      console.error(`"UselessFact()" failed : ${err}`);
    }
     
  }
  
  /**
   * Fill the sheet
   */
  static async LoopAndFill() {
    const present = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.present);
    const online = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.online);
    const entered = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses);
    let factColumn = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.random)
      .filter(Boolean);
    console.info(`${present.length}, ${online.length}, ${entered.length}`);
    
    for(let i = 0; i < present.length; i++) {
      if(present[i] == true && online[i] == true && entered[i] == true) {
        let fact = await this.UselessFact();
        if(factColumn.indexOf(fact) == -1) {
          console.info(fact)
          SetByHeader(SHEETS.Main, HEADERNAMES.random, i + 2, fact);
        } else {
          fact = await this.UselessFact();
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
  async _CheckFactRecursively (fact) {
    const factColumn = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.random)
      .filter(Boolean);
    const index = factColumn.indexOf(fact);
    const limit = 10;
    let count = 0;
    let newFact;
    if(index == -1 && count < limit) {
      console.info(count)
      return newFact;
    } else {
      newFact = await this.UselessFact();
      count++;
      console.info(count)
      this._CheckFactRecursively(newFact);
      console.info(index)
      return newFact;
    }
  }

  /**
   * Loops through and prints some number of facts.
   * @param {number} count
   * @return {string} facts
   */
  static async ShowMeTheMoney(count) {
    for(let i = 0; i < count; i++) {
      await this.UselessFact();
    }
  }

  
}

const _testUselessFact = () => {
  RandomFacts.UselessFact();
}














