

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Fuck Off as a Service
 */
class FuckOffAsAService {
  constructor({
    username : username = `Me`,
    name : name = `Whatever-your-name-is`,
    company : company = `Whatever-your-dumb-company-is`,
    tool : tool = `Google Apps-Script`,
    something : something = `Eat it`,
    behavior : behavior = `Always asking questions`,
  }) {
    /** @private */
    this.root = `https://foass.1001010.com`;     // `http://foaas.com`
    /** @private */
    this.username = username;
    /** @private */
    this.name = name;
    /** @private */
    this.company = company;
    /** @private */
    this.tool = tool;
    /** @private */
    this.something = something;
    /** @private */
    this.behavior = behavior;
    /** @private */
    this.reference = `http://google.com`;
    /** @private */
    this.endpoints = this._Endpoints();
    /** @private */
    this.randomEndpoint = this.endpoints[Math.floor(Math.random() * this.endpoints.length)];
    /** @private */
    this.params = {
      "method" : "GET",
      "headers" : { "authorization" : "basic ", "content-type" : "application/json"},
      "content-type" : "application/json",
      "muteHttpExceptions" : true,
    };
  }

  /** @private */
  _Endpoints() {
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


  /**
   * Get Random Fact
   * @return {string} random fact
   */
  async GetRandom() {
    const repo = this.randomEndpoint;
    try {
      const response = await UrlFetchApp.fetch(this.root + repo, this.params);
      const responseCode = response.getResponseCode();
      if (responseCode !== 200) throw new Error(`Bad response from server : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      const content = response.getContentText();
      const parsed = this._Parse(content).title;
      console.info(parsed);
      return parsed;
    } catch(err) {
      console.error(`"GetRandom()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Parse html content.
   * @private
   * @param {string} html
   * @return {{}} {title : string, subtitle : string}
   */
  _Parse (content) {
    content = content.toString();
    const titleStart = content.search(`<h1>`);
    const titleEnd = content.search(`</h1>`);
    const subStart = content.search(`<em>`);
    const subEnd = content.search(`</em>`);
    let title = content.substring(titleStart + 4, titleEnd);
    title = decodeURI(title);
    const sub = content.substring(subStart + 4, subEnd);
    // console.info(`Title : ${title}, Subtitle : ${sub}`);
    return {
      title : title,
      subtitle : sub,
    } 
  }


}


const _testFuckOff = async () => await new FuckOffAsAService({ name : `Mike Roch`}).GetRandom();

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
