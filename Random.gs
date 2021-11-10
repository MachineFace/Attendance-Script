
class RandomFacts
{
  constructor() {
    
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Fetch a Useless Fact
   * @return {string} fact
   */
  async UselessFact () {
    let repo = `https://uselessfacts.jsph.pl/random.json?language=en`;
    const params = {
      method : "GET",
      headers : { "Authorization" : "Basic ", },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
    let html = await UrlFetchApp.fetch(repo, params);
    let responseCode = html.getResponseCode();
    // writer.Debug(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = JSON.parse(html.getContentText())["text"];
      Logger.log(content);
      return content;
    } else {
      Logger.log('Failed to Do Dat');
      return false;
    }
  }
  
  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Fill the sheet
   */
  async LoopAndFill () {
    const present = GetColumnDataByHeader(SHEETS.main, "Present");
    const online = GetColumnDataByHeader(SHEETS.main, "Online");
    const entered = GetColumnDataByHeader(SHEETS.main, "Entered in bCourses");
    let f = GetColumnDataByHeader(SHEETS.main, "Random Fact")
    let factColumn = f.filter(Boolean);
    Logger.log(`${present.length}, ${online.length}, ${entered.length}`);
    
    for(let i = 0; i < present.length; i++) {
      if(present[i] == true && online[i] == true && entered[i] == true) {
        let fact = await this.UselessFact();
        if(factColumn.indexOf(fact) == -1) {
          Logger.log(fact)
          SetByHeader(SHEETS.main, "Random Fact", i + 2, fact);
        } else {
          fact = await this.UselessFact();
          Logger.log(`Trying again : ${fact}`)
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
    let f = GetColumnDataByHeader(SHEETS.main, "Random Fact")
    let factColumn = f.filter(Boolean);
    const index = factColumn.indexOf(fact);
    const limit = 10;
    let count = 0;
    let newFact;
    if(index == -1 && count < limit) {
      Logger.log(count)
      return newFact;
    } else {
      newFact = await this.UselessFact();
      count++;
      Logger.log(count)
      this._CheckFactRecursively(newFact);
      Logger.log(index)
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

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Test Useless Fact Generator
 */
const _testUselessness = async () => await new RandomFacts().UselessFact();
const _testUselessnessAgain = async () => await new RandomFacts().ShowMeTheMoney(50);
const _testRecursion = async () => await new RandomFacts()._CheckFactRecursively("166,875,000,000 pieces of mail are delivered each year in the US");





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Test Fuck Off as a Service
 */
class FuckOffAsAService
{
  constructor() {
    this.root = `http://foaas.com`;
    this.username = `Mike\ Dingus`;
    this.name = `Mike`;
    this.company = `Somecompany`;
    this.tool = `a Chainsaw`;
    this.something = `Something`;
    this.reference = `http://google.com`;
    this.endpoints = this.Endpoints();
    this.randomEndpoint = this.endpoints[Math.floor(Math.random() * this.endpoints.length)];
  }

  Endpoints () {
    return [
      `/version`,
      `/operations`,
      `/absolutely/${this.company}/${this.username}`,
      `/anyway/${this.company}/${this.username}`,
      `/asshole/${this.username}`,
      `/awesome/${this.username}`,
      `/back/${this.name}/${this.username}`,
      `/bag/${this.username}`,
      `/ballmer/${this.name}/${this.company}/${this.username}`,
      `/bday/${this.name}/${this.username}`,
      `/because/${this.username}`,
      `/blackadder/${this.name}/${this.username}`,
      `/bm/${this.name}/${this.username}`,
      `/bucket/${this.username}`,
      `/bus/${this.name}/${this.username}`,
      `/bye/${this.username}`,
      `/caniuse/${this.tool}/${this.username}`,
      `/chainsaw/${this.name}/${this.username}`,
      `/cocksplat/${this.name}/${this.username}`,
      `/cool/${this.username}`,
      `/cup/${this.username}`,
      `/dense/${this.username}`,
      `/deraadt/${this.name}/${this.username}`,
      `/diabetes/${this.username}`,
      `/donut/${this.name}/${this.username}`,
      `/dosomething/:do/${this.something}/${this.username}`,
      `/dumbledore/${this.username}`,
      `/dalton/${this.name}/${this.username}`,
      `/equity/${this.name}/${this.username}`,
      `/even/${this.username}`,
      `/everyone/${this.username}`,
      `/everything/${this.username}`,
      `/fascinating/${this.username}`,
      `/fewer/${this.name}/${this.username}`,
      `/field/${this.name}/${this.username}/${this.reference}`,
      `/flying/${this.username}`,
      `/ftfy/${this.username}`,
      `/fts/${this.name}/${this.username}`,
      `/fyyff/${this.username}`,
      `/gfy/${this.name}/${this.username}`,
      `/give/${this.username}`,
      `/greed/:noun/${this.username}`,
      `/holygrail/${this.username}`,
      `/family/${this.username}`,
      `/horse/${this.username}`,
      `/idea/${this.username}`,
      `/immensity/${this.username}`,
      `/ing/${this.name}/${this.username}`,
      `/jinglebells/${this.username}`,
      `/keep/${this.name}/${this.username}`,
      `/keepcalm/:reaction/${this.username}`,
      `/king/${this.name}/${this.username}`,
      `/legend/${this.name}/${this.username}`,
      `/life/${this.username}`,
      `/linus/${this.name}/${this.username}`,
      `/logs/${this.username}`,
      `/look/${this.name}/${this.username}`,
      `/looking/${this.username}`,
      `/lowpoly/${this.username}`,
      `/madison/${this.name}/${this.username}`,
      `/maybe/${this.username}`,
      `/me/${this.username}`,
      `/mornin/${this.username}`,
      `/no/${this.username}`,
      `/nugget/${this.name}/${this.username}`,
      `/off/${this.name}/${this.username}`,
      `/off-with/:behavior/${this.username}`,
      `/outside/${this.name}/${this.username}`,
      `/particular/:thing/${this.username}`,
      `/pink/${this.username}`,
      `/problem/${this.name}/${this.username}`,
      `/programmer/${this.username}`,
      `/pulp/:language/${this.username}`,
      `/question/${this.username}`,
      `/ratsarse/${this.username}`,
      `/retard/${this.username}`,
      `/ridiculous/${this.username}`,
      `/rockstar/${this.name}/${this.username}`,
      `/rtfm/${this.username}`,
      `/sake/${this.username}`,
      `/shakespeare/${this.name}/${this.username}`,
      `/shit/${this.username}`,
      `/shutup/${this.name}/${this.username}`,
      `/single/${this.username}`,
      `/thanks/${this.username}`,
      `/that/${this.username}`,
      `/think/${this.name}/${this.username}`,
      `/thinking/${this.name}/${this.username}`,
      `/this/${this.username}`,
      `/thumbs/${this.name}/${this.username}`,
      `/too/${this.username}`,
      `/tucker/${this.username}`,
      `/understand/${this.name}/${this.username}`,
      `/waste/${this.name}/${this.username}`,
      `/what/${this.username}`,
      `/xmas/${this.name}/${this.username}`,
      `/yeah/${this.username}`,
      `/yoda/${this.name}/${this.username}`,
      `/you/${this.name}/${this.username}`,
      `/zayn/${this.username}`,
      `/zero/${this.username}`,
    ]
  }

  async Version () {
    let repo = `/version`;
    const params = {
      "method" : "GET",
      "contentType" : `application/json`,
      "muteHttpExceptions" : true,
    };
    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    // Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = html.getContentText();
      let parsed = this.Parse(content);
      return parsed;
    } else {
      Logger.log(`${responseCode} ---> ${RESPONSECODES[responseCode]} : Failed to Do Dat`);
      return false;
    }
  }

  async GetBag () {
    let name = `Mike\ Dingus`
    let repo = `/bag/${name}`;
    const params = {
      "method" : "GET",
      "contentType" : `application/json`,
      "muteHttpExceptions" : true,
    };
    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    // writer.Debug(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = html.getContentText();
      let parsed = this.Parse(content);
      return parsed;
    } else {
      Logger.log(`${responseCode} ---> ${RESPONSECODES[responseCode]} : Failed to Do Dat`);
      return false;
    }
  }

  async GetRandom () {
    let repo = this.randomEndpoint;
    const params = {
      "method" : "GET",
      "headers" : { "authorization" : "basic ", "content-type" : "application/json"},
      "content-type" : "application/json",
      "muteHttpExceptions" : true,
    };
    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    // Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = html.getContentText();
      let parsed = this.Parse(content);
      return parsed;
    } else {
      Logger.log(`${responseCode} ---> ${RESPONSECODES[responseCode]} : Failed to Do Dat`);
      return false;
    }
  }

  /**
   * Parse html content.
   * @param {string} html
   * @return {{}} {title : string, subtitle : string}
   */
  Parse (content) {
    content = content.toString();
    const titleStart = content.search(`<h1>`);
    const titleEnd = content.search(`</h1>`);
    const subStart = content.search(`<em>`);
    const subEnd = content.search(`</em>`);
    const title = content.substring(titleStart + 4, titleEnd);
    const sub = content.substring(subStart + 4, subEnd);
    Logger.log(`Title : ${title}, Subtitle : ${sub}`);
    return {
      title : title,
      subtitle : sub,
    } 
  }


}
const _testFuckOff = async () => new FuckOffAsAService().GetRandom();













