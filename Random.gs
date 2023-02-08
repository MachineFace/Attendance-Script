/**
 * Class for accessing "Random Fact" API for a new random fact.
 */
class RandomFacts
{
  constructor() {
    this.repo = `https://uselessfacts.jsph.pl/random.json?language=en`;
    this.params = {
      method : "GET",
      headers : { "Authorization" : "Basic ", },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Fetch a Useless Fact
   * @return {string} fact
   */
  async UselessFact () {
    
    
    let html = await UrlFetchApp.fetch(this.repo, this.params);
    let responseCode = html.getResponseCode();
    // writer.Debug(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = JSON.parse(html.getContentText())["text"];
      console.info(content);
      return content;
    } else {
      console.error('Failed to Do Dat');
      return false;
    }
  }
  
  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Fill the sheet
   */
  async LoopAndFill () {
    const present = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.present);
    const online = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.online);
    const entered = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.bCourses);
    let f = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.random)
    let factColumn = f.filter(Boolean);
    console.info(`${present.length}, ${online.length}, ${entered.length}`);
    
    for(let i = 0; i < present.length; i++) {
      if(present[i] == true && online[i] == true && entered[i] == true) {
        let fact = await this.UselessFact();
        if(factColumn.indexOf(fact) == -1) {
          console.info(fact)
          SetByHeader(SHEETS.Main, HEADERNAMES.random, i + 2, fact);
        } else {
          fact = await this.UselessFact();
          console.info(`Trying again : ${fact}`)
        }
      }
    }

  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Checks if a fact has already been printed or not.
   * @param {string} fact
   * @return {string} newfact
   */
  async _CheckFactRecursively (fact) {
    let f = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.random)
    let factColumn = f.filter(Boolean);
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
   * ----------------------------------------------------------------------------------------------------------------
   * Loops through and prints some number of facts.
   * @param {number} count
   * @return {string} facts
   */
  async ShowMeTheMoney (count) {
    for(let i = 0; i < count; i++) {
      await this.UselessFact();
    }
  }

  
}
















