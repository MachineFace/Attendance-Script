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







/**
 * ----------------------------------------------------------------------------------------------------------------
 * Fuck Off as a Service
 */
class FuckOffAsAService
{
  constructor({
    username : username = `Me`,
    name : name = `Whatever-your-name-is`,
    company : company = `Whatever-your-dumb-company-is`,
    tool : tool = `Google Apps-Script`,
    something : something = `Eat it`,
    behavior : behavior = `Always asking questions`,
  }) {
    this.root = `https://foass.1001010.com`;     // `http://foaas.com`
    this.username = username;
    this.name = name;
    this.company = company;
    this.tool = tool;
    this.something = something;
    this.behavior = behavior;
    this.reference = `http://google.com`;
    this.endpoints = this.Endpoints();
    this.randomEndpoint = this.endpoints[Math.floor(Math.random() * this.endpoints.length)];

    this.params = {
      "method" : "GET",
      "headers" : { "authorization" : "basic ", "content-type" : "application/json"},
      "content-type" : "application/json",
      "muteHttpExceptions" : true,
    };
  }

  Endpoints () {
    return [
      `/everyone/${this.username}`,
      `/thanks/${this.username}`,
      `/ity/${this.name}/${this.username}`,
      `/linus/${this.name}/${this.username}`,
      `/bag/${this.name}/${this.username}`,
      `/pink/${this.name}`,
      `/given/${this.name}`,
      `/bag/${this.name}/${this.username}`,
      `/bowl/${this.name}/${this.username}`,
      `/everything/${this.username}`,
      `/shakespeare/${this.name}/${this.username}`,
      `/you/${this.name}/${this.username}`,
      `/life/${this.username}`,
      `/that/${this.username}`,
      `/chainsaw/${this.name}/${this.username}`,
      `/eat/${this.name}/${this.username}`,
      `/king/${this.name}/${this.username}`,
      `/lawn/${this.name}/${this.username}`,
      `/off/${this.name}/${this.username}`,
      `/this/${this.username}`,
      `/donut/${this.name}/${this.username}`,
    ]
  }



  async GetRandom () {
    let repo = this.randomEndpoint;

    let html = await UrlFetchApp.fetch(this.root + repo, this.params);
    let responseCode = html.getResponseCode();
    console.info(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = html.getContentText();
      let parsed = this.Parse(content).title;
      return parsed;
    } else {
      console.error(`${responseCode} ---> ${RESPONSECODES[responseCode]} : Failed to Do Dat`);
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
    // console.info(`Title : ${title}, Subtitle : ${sub}`);
    return {
      title : title,
      subtitle : sub,
    } 
  }


}


const _testFuckOff = async () => {
  const x = await new FuckOffAsAService({}).GetRandom();
  console.info(x);
}

const DoFuckOff = async () => {
  const names = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name);
  const absentIndexes = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.absent);
  for(let i = 0; i < absentIndexes.length; i++) {
    console.info(`Index: ${i + 2}, Item: ${absentIndexes[i]}`);
    if(absentIndexes[i] == true) {
      const fuckoff = await new FuckOffAsAService({ name : names[i] }).GetRandom();
      SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, i + 2, fuckoff);
    }
  }
}











